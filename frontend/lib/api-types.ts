/**
 * Типы для API-ответов бэкенда Django REST
 */

export type Lang = 'en' | 'ru' | 'lv';
export type PageContent = Record<string, Record<string, string>>;

export type SolutionsEditMap = {
  sections: Record<
    string,
    {
      sectionId: number;
      columns: Record<string, number>;
    }
  >;
};

// Blog
export interface Author {
  id: number;
  name: string;
  bio: string | null;
  photo: string | null;
}

export interface Category {
  id: number;
  name_en: string;
  name_ru: string;
  name_lv: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface PostImage {
  id: number;
  image_url: string | null;
  caption: string | null;
  created_at: string;
}

export interface PostListItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: Author;
  category: Category;
  tags: Tag[];
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
}

export interface PostDetail extends PostListItem {
  content: string;
  images: PostImage[];
  status: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Pages
export interface About {
  id: number;
  bio: string;
  /** Краткий HTML для блока «Обо мне» на главной (админка About – Main). */
  bio_main: string;
  education: string;
  qualifications: string;
  photo: string | null;
  updated_at: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  description: string;
  start_year: number;
  end_year: number | null;
  order: number;
}

export interface BookPageImage {
  id: number;
  image: string | null;
  order: number;
  alt: string;
}

export interface Book {
  id: number;
  title: string;
  description: string;
  year: number;
  cover_image: string | null;
  pages?: BookPageImage[];
  updated_at: string;
}

export interface Contact {
  id: number;
  email: string;
  linkedin_url: string | null;
  youtube_url: string | null;
  updated_at: string;
}

export interface SEOMetadata {
  page: string;
  language: Lang;
  title: string;
  description: string;
  updated_at: string;
}

export interface HomeTechnicalSkillCard {
  order: number;
  title: string;
  description: string;
}

/** Блок «Технические навыки» на главной (админка). */
export interface HomeTechnicalSkills {
  technical_lead: string;
  items: HomeTechnicalSkillCard[];
}

/** Блок «Business outcomes» на главной (админка). */
export interface HomeBusinessOutcomes {
  business_subtitle: string;
  business_lead: string;
  items: HomeTechnicalSkillCard[];
}

// Calculators
export interface Calculator {
  id: number;
  name: string;
  description: string;
  slug: string;
  created_at: string;
}

// Calculator request/response types
export interface HeatInputRequest {
  voltage: number;
  current: number;
  travel_speed: number;
}

export interface HeatInputResponse {
  heat_input_kj_mm: number;
  voltage: number;
  current: number;
  travel_speed: number;
}

export interface GasFlowRequest {
  flow_rate: number;
  welding_time_min: number;
  cylinder_volume_l: number;
}

export interface GasFlowResponse {
  consumption_l: number;
  cylinder_duration_min: number;
  flow_rate: number;
  welding_time_min: number;
  cylinder_volume_l: number;
}

export interface ShieldingGasRequest {
  wire_diameter_mm?: number;
  material?: string;
  process?: string;
}

export interface ShieldingGasResponse {
  flow_rate_min: number;
  flow_rate_max: number;
  flow_rate_typical: number;
  wire_diameter_mm: number;
  material: string;
  process: string;
}

export interface GasCuttingRequest {
  plate_thickness_mm: number;
  gas_type?: string;
  cutting_speed_m_min?: number | null;
}

export interface GasCuttingResponse {
  plate_thickness_mm: number;
  gas_type: string;
  o2_pressure_bar: number;
  fuel_flow_l_h: number;
  cutting_speed_m_min: number | null;
}

export interface WeldingCostRequest {
  wire_price_per_kg: number;
  gas_price_per_cylinder: number;
  cylinder_volume_l: number;
  deposition_rate_kg_h: number;
  welding_time_h: number;
}

export interface WeldingCostResponse {
  wire_consumption_kg: number;
  gas_consumption_l: number;
  cylinders_used: number;
  wire_cost: number;
  gas_cost: number;
  total_cost: number;
}

export interface WeldingParametersRequest {
  plate_thickness_mm: number;
  joint_type?: string;
  wire_diameter_mm?: number;
}

export interface WeldingParametersResponse {
  plate_thickness_mm: number;
  joint_type: string;
  wire_diameter_mm: number;
  current_a: number;
  voltage_v: number;
  travel_speed_mm_min: number;
}

// Leads
export interface LeadTrackingPayload {
  locale: Lang;
  page_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  website?: string;
}

export interface LeadSubscribePayload extends LeadTrackingPayload {
  email: string;
  name?: string;
  article_slug?: string;
  article_title?: string;
}

export interface LeadArticleQuestionPayload extends LeadTrackingPayload {
  name: string;
  email: string;
  question: string;
  article_slug: string;
  article_title: string;
  subscribe_opt_in?: boolean;
}

export type ContactRequestType =
  'defects' | 'process' | 'training' | 'cooperation' | 'commercial' | 'other';

export interface ArticleFaqItem {
  question: string;
  answer: string;
  answered_at: string | null;
}

export interface ArticleFaqResponse {
  ok: boolean;
  items: ArticleFaqItem[];
}

export interface LeadContactInquiryPayload extends LeadTrackingPayload {
  name: string;
  email: string;
  request_type: ContactRequestType;
  message: string;
}

export interface LeadApiResponse {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}
