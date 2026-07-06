export interface SiteSettings {
  siteName: string;
  ceoName: string;
  businessNumber: string;
  phone: string;
  email: string;
  address: string;
  fax: string;
  logoText: string;
  socialNaver: string;
  socialKakao: string;
  socialYoutube: string;
  socialInstagram: string;
  socialFacebook: string;
  socialLinkedin: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogType: string;
  canonicalUrl: string;
  robotsTxt: string;
}

export interface DesignSettings {
  themeMode: 'navy' | 'dark' | 'light' | 'custom';
  primaryColor: string; // e.g. #071A3D
  accentColor: string;  // e.g. #3B82F6 or #D4AF37 (Gold)
  bgColor: string;      // e.g. #071A3D
  cardBgColor: string;  // e.g. #0E2954
  textColor: string;    // e.g. #FFFFFF
  textMutedColor: string; // e.g. #94A3B8
  buttonStyle: 'rounded' | 'square' | 'pill';
  fontFamily: 'Pretendard' | 'Noto Serif KR' | 'Gowun Batang' | 'Inter';
  fontSize: 'sm' | 'base' | 'lg';
  cardShadow: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  heroBannerBg: string; // Background gradient description
  layoutWidth: 'container' | 'full';
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  icon: string; // Lucide icon name
  active: boolean;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  writer: string;
  date: string;
  isPinned: boolean;
  views: number;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  writer: string;
  date: string;
  category: string; // 정책자금, 정부지원사업, 창업, 기업인증, 세무, 금융
  tags: string[];
  imageUrl: string;
  status: 'draft' | 'published' | 'scheduled';
  publishDate?: string;
  views: number;
}

export interface Inquiry {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  content: string;
  memo: string;
  status: 'unprocessed' | 'consulting' | 'completed' | 'cancelled';
  date: string;
}

export interface SuccessCase {
  id: string;
  companyName: string;
  fundAmount: string; // e.g. 5억원, 12억원
  industry: string; // e.g. IT 제조업, 바이오 벤처
  description: string;
  testimonial: string;
  isFeatured: boolean;
}

export interface Review {
  id: string;
  reviewerName: string;
  company: string;
  position: string;
  content: string;
  rating: number; // 1 to 5
  isFeatured: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  size: string;
  type: string;
  date: string;
}

export interface FullDatabase {
  siteSettings: SiteSettings;
  designSettings: DesignSettings;
  services: ServiceCard[];
  notices: Notice[];
  blogs: Blog[];
  inquiries: Inquiry[];
  successCases: SuccessCase[];
  reviews: Review[];
  faqs: Faq[];
  mediaItems: MediaItem[];
}
