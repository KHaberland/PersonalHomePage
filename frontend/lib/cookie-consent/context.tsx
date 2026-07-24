'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { subscribeOpenPreferences } from './events';
import {
  acceptAll as storageAcceptAll,
  getConsent,
  rejectAll as storageRejectAll,
  saveConsent,
  subscribeConsent,
} from './storage';
import type { CookieConsentLabels, CookieConsentRecord } from './types';

type CookieConsentContextValue = {
  labels: CookieConsentLabels;
  mounted: boolean;
  consent: CookieConsentRecord | null;
  showBanner: boolean;
  showModal: boolean;
  openPreferences: () => void;
  closeModal: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (analytics: boolean, marketing: boolean) => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

function subscribeToConsentStore(onStoreChange: () => void): () => void {
  return subscribeConsent(() => {
    onStoreChange();
  });
}

function getConsentSnapshot(): CookieConsentRecord | null {
  return getConsent();
}

function getServerConsentSnapshot(): CookieConsentRecord | null {
  return null;
}

function subscribeToMounted(_onStoreChange: () => void): () => void {
  return () => undefined;
}

function getMountedSnapshot(): boolean {
  return true;
}

function getServerMountedSnapshot(): boolean {
  return false;
}

type CookieConsentProviderProps = {
  labels: CookieConsentLabels;
  children: ReactNode;
};

export function CookieConsentProvider({
  labels,
  children,
}: CookieConsentProviderProps) {
  const mounted = useSyncExternalStore(
    subscribeToMounted,
    getMountedSnapshot,
    getServerMountedSnapshot
  );
  const consent = useSyncExternalStore(
    subscribeToConsentStore,
    getConsentSnapshot,
    getServerConsentSnapshot
  );
  const [showModal, setShowModal] = useState(false);

  // SSR-safe: first paint has mounted=false → no banner; after hydrate, null consent → banner.
  const showBanner = mounted && consent === null;

  useEffect(() => {
    return subscribeOpenPreferences(() => {
      setShowModal(true);
    });
  }, []);

  const openPreferences = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const acceptAll = useCallback(() => {
    storageAcceptAll();
    setShowModal(false);
  }, []);

  const rejectAll = useCallback(() => {
    storageRejectAll();
    setShowModal(false);
  }, []);

  const savePreferences = useCallback(
    (analytics: boolean, marketing: boolean) => {
      saveConsent({ analytics, marketing });
      setShowModal(false);
    },
    []
  );

  const value: CookieConsentContextValue = {
    labels,
    mounted,
    consent,
    showBanner,
    showModal,
    openPreferences,
    closeModal,
    acceptAll,
    rejectAll,
    savePreferences,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error(
      'useCookieConsent must be used within CookieConsentProvider'
    );
  }
  return ctx;
}
