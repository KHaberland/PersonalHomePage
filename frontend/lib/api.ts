/**
 * API-клиент для бэкенда Django REST
 */

import type {
  About,
  Book,
  Calculator,
  Contact,
  Experience,
  HomeTechnicalSkills,
  HomeBusinessOutcomes,
  GasCuttingRequest,
  GasCuttingResponse,
  GasFlowRequest,
  GasFlowResponse,
  HeatInputRequest,
  HeatInputResponse,
  Lang,
  PaginatedResponse,
  PageContent,
  SolutionsEditMap,
  PostDetail,
  PostListItem,
  SEOMetadata,
  ShieldingGasRequest,
  ShieldingGasResponse,
  WeldingCostRequest,
  WeldingCostResponse,
  WeldingParametersRequest,
  WeldingParametersResponse,
  LeadApiResponse,
  LeadArticleQuestionPayload,
  LeadContactInquiryPayload,
  LeadSubscribePayload,
  ArticleFaqItem,
  ArticleFaqResponse,
} from './api-types';
import type { ShieldingGasCatalog } from './shielding-gas/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const { params, ...init } = options || {};
  const url = new URL(`${API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    let data: unknown;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : undefined;
    } catch {
      data = undefined;
    }
    const payload = data as {
      error?: string;
      detail?: string;
      errors?: Record<string, string[]>;
    };
    const fieldError = payload.errors
      ? Object.values(payload.errors).flat()[0]
      : undefined;
    const errorMessage =
      payload.error || fieldError || payload.detail || response.statusText;
    throw new ApiError(errorMessage, response.status, data);
  }

  return response.json();
}

// Blog
export async function getPosts(
  lang: Lang = 'en',
  params?: {
    category?: string;
    category_slug?: string;
    tag?: string;
    tag_slug?: string;
    page?: string;
  }
): Promise<PaginatedResponse<PostListItem>> {
  const searchParams: Record<string, string> = { lang };
  if (params?.category) searchParams.category = params.category;
  if (params?.category_slug) searchParams.category_slug = params.category_slug;
  if (params?.tag) searchParams.tag = params.tag;
  if (params?.tag_slug) searchParams.tag_slug = params.tag_slug;
  if (params?.page) searchParams.page = params.page;
  return fetchApi<PaginatedResponse<PostListItem>>('/posts/', {
    params: searchParams,
  });
}

export async function getPost(
  slug: string,
  lang: Lang = 'en'
): Promise<PostDetail> {
  return fetchApi<PostDetail>(`/posts/${slug}/`, { params: { lang } });
}

type CategoryRow = {
  id: number;
  name_en: string;
  name_ru: string;
  name_lv: string;
  slug: string;
};

export async function getCategories(): Promise<CategoryRow[]> {
  const data = await fetchApi<{ results?: CategoryRow[] } | CategoryRow[]>(
    '/categories/'
  );
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function getTags(
  lang: Lang = 'en'
): Promise<{ id: number; name: string; slug: string }[]> {
  type TagRow = { id: number; name: string; slug: string };
  const data = await fetchApi<{ results?: TagRow[] } | TagRow[]>('/tags/', {
    params: { lang },
  });
  return Array.isArray(data) ? data : (data.results ?? []);
}

// Pages
export async function getPageContent(
  page: string,
  lang: Lang = 'en'
): Promise<PageContent> {
  return fetchApi<PageContent>(`/content/page/${encodeURIComponent(page)}/`, {
    params: { lang },
  });
}

export async function getSolutionsEditMap(): Promise<SolutionsEditMap> {
  return fetchApi<SolutionsEditMap>('/content/solutions-edit-map/');
}

export async function getSeoMetadata(
  page: string,
  lang: Lang = 'en'
): Promise<SEOMetadata | null> {
  try {
    return await fetchApi<SEOMetadata>(
      `/content/seo/${encodeURIComponent(page)}/`,
      {
        params: { lang },
      }
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getAbout(lang: Lang = 'en'): Promise<About> {
  return fetchApi<About>('/about/', { params: { lang } });
}

export async function getHomeTechnicalSkills(
  lang: Lang = 'en'
): Promise<HomeTechnicalSkills> {
  return fetchApi<HomeTechnicalSkills>('/home-technical-skills/', {
    params: { lang },
  });
}

export async function getHomeBusinessOutcomes(
  lang: Lang = 'en'
): Promise<HomeBusinessOutcomes> {
  return fetchApi<HomeBusinessOutcomes>('/home-business-outcomes/', {
    params: { lang },
  });
}

export async function getExperience(lang: Lang = 'en'): Promise<Experience[]> {
  const data = await fetchApi<{ results?: Experience[] } | Experience[]>(
    '/experience/',
    { params: { lang } }
  );
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function getBook(lang: Lang = 'en'): Promise<Book> {
  return fetchApi<Book>('/book/', { params: { lang } });
}

export async function getContact(): Promise<Contact> {
  return fetchApi<Contact>('/contact/');
}

// Calculators (API может вернуть массив или DRF-пагинацию { results })
export async function getTools(lang: Lang = 'en'): Promise<Calculator[]> {
  const data = await fetchApi<{ results?: Calculator[] } | Calculator[]>(
    '/tools/',
    { params: { lang } }
  );
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

export async function getShieldingGasCatalog(
  lang: Lang
): Promise<ShieldingGasCatalog> {
  return fetchApi<ShieldingGasCatalog>('/shielding-gas/catalog/', {
    params: { lang },
  });
}

export async function calculateHeatInput(
  data: HeatInputRequest
): Promise<HeatInputResponse> {
  return fetchApi<HeatInputResponse>('/calculate/heat-input/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function calculateGasFlow(
  data: GasFlowRequest
): Promise<GasFlowResponse> {
  return fetchApi<GasFlowResponse>('/calculate/gas-flow/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function calculateShieldingGas(
  data: ShieldingGasRequest = {}
): Promise<ShieldingGasResponse> {
  return fetchApi<ShieldingGasResponse>('/calculate/shielding-gas/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function calculateGasCutting(
  data: GasCuttingRequest
): Promise<GasCuttingResponse> {
  return fetchApi<GasCuttingResponse>('/calculate/gas-cutting/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function calculateWeldingCost(
  data: WeldingCostRequest
): Promise<WeldingCostResponse> {
  return fetchApi<WeldingCostResponse>('/calculate/welding-cost/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function calculateWeldingParameters(
  data: WeldingParametersRequest
): Promise<WeldingParametersResponse> {
  return fetchApi<WeldingParametersResponse>('/calculate/welding-parameters/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Leads
export async function subscribeToNewsletter(
  data: LeadSubscribePayload
): Promise<LeadApiResponse> {
  return fetchApi<LeadApiResponse>('/leads/subscribe/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitArticleQuestion(
  data: LeadArticleQuestionPayload
): Promise<LeadApiResponse> {
  return fetchApi<LeadApiResponse>('/leads/article-question/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitContactInquiry(
  data: LeadContactInquiryPayload
): Promise<LeadApiResponse> {
  return fetchApi<LeadApiResponse>('/leads/inquiries/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getArticleFaq(
  articleSlug: string,
  lang: Lang
): Promise<ArticleFaqItem[]> {
  const params = new URLSearchParams({
    article_slug: articleSlug,
    lang,
  });
  const response = await fetchApi<ArticleFaqResponse>(`/leads/faq/?${params}`);
  return response.items ?? [];
}
