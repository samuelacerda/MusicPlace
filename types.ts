

export enum Condition {
  NOVO = 'Novo',
  SEMINOVO = 'Seminovo',
  USADO = 'Usado',
  COM_MARCAS = 'Com Marcas',
  PARA_REPARO = 'Para Reparo'
}

export enum DeliveryMethod {
  RETIRADA = 'Retirada local',
  ENVIO = 'Envio',
  AMBOS = 'Ambos'
}

export type ProductStatus = 'active' | 'pending' | 'rejected' | 'sold' | 'expired';

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  subcategories: string[];
  active: boolean;
  // New visual fields
  color?: string;
  image?: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  desktopImage: string;
  mobileImage: string;
  buttonText?: string;
  buttonLink?: string;
  startDate?: string; 
  endDate?: string;
  active: boolean;
  order: number;
  isPrincipal?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface Product {
  id: string;
  userId: string; // Foreign Key
  title: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  condition: Condition;
  locationState: string;
  locationCity: string;
  description: string;
  delivery: DeliveryMethod;
  sellerName: string;
  sellerRating: number;
  createdAt: Date | string;
  status: ProductStatus;
  featured?: boolean;
  whatsapp: string;
  brand: string;
  model: string;
  year?: number;
  acceptsNegotiation: boolean;
  acceptsTrade: boolean;
  expirationDate?: string;
}

export interface ServiceListing {
  id: string;
  name: string;
  type: 'Luthier' | 'Professor' | 'Estúdio' | 'Técnico' | 'DJ';
  location: string;
  rating: number;
  priceRange: string;
  image: string;
}

// BLOG TYPES
export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  content: string; // HTML supported
  image: string;
  category: string;
  author: string;
  createdAt: string;
  featured: boolean;
}

// Registration Types

export type AccountType = 'individual' | 'professional' | 'store';
export type ProfessionalType = 'individual' | 'business';
export type UserRole = 'user' | 'admin';

export type ProfessionalArea = 'Musician' | 'Luthier' | 'AudioTechnician' | 'MusicProducer' | 'DJ' | 'Builder' | 'Other';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string; 
  state: string;
  city: string;
  accountType: AccountType;
  createdAt: Date | string;
  isBanned: boolean;
  cpf?: string;
  birthDate?: string;
  cnpj?: string;
  legalName?: string; 
  tradeName?: string; 
  professionalArea?: ProfessionalArea;
  bio?: string;
  website?: string;
  plan?: string; // Plan ID
  avatar?: string;
  // History
  history?: Log[];
}

export interface Report {
  id: string;
  targetId: string; 
  targetType: 'product' | 'user';
  reason: string;
  createdAt: Date | string;
  status: 'open' | 'resolved';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
  link?: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  productId?: string;
  content: string;
  createdAt: Date | string;
  read: boolean;
}

export interface Ticket {
  id: string;
  userId?: string; // Optional (guest)
  name: string;
  email: string;
  type: 'Tecnico' | 'Pagamento' | 'Conta' | 'Outro';
  subject: string;
  message: string;
  status: 'open' | 'closed';
  createdAt: string;
}

// --- ADMIN & CONFIGURATION TYPES ---

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  duration: 'monthly' | 'quarterly' | 'yearly' | '15_days';
  adLimit: number; 
  featuredLimit: number;
  targetAudience: AccountType | 'all'; 
  benefits: string[];
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  expirationDate?: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
  applicablePlans: string[]; 
}

export interface Log {
  id: string;
  action: string;
  details: string;
  date: string;
  adminId?: string;
}

// --- NEW SIMPLIFIED THEME CONFIG ---

export interface HeaderTheme {
  logoUrl: string;
  backgroundColor: string;
  textColor: string;
  linksColor: string;
  visible: boolean;
}

export interface FooterTheme {
  backgroundColor: string;
  textColor: string;
  socialLinks: { label: string; url: string; icon: string }[];
  copyrightText: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  header: HeaderTheme;
  footer: FooterTheme;
}

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: string; // HTML/Markdown
  active: boolean;
}

export interface MarketingConfig {
  pixelId?: string;
  googleTagId?: string;
  popupEnabled: boolean;
  popupContent?: string;
  popupImage?: string;
  popupLink?: string;
  pushEnabled: boolean;
  // Old smtp fields removed, moved to SystemSettings
}

export interface EmailConfig {
  supportEmail: string;
  contactEmail: string;
  senderName: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string; // App Password
  encryption: 'ssl' | 'tls' | 'none';
  replyTo: string;
}

export interface WhatsappConfig {
  officialNumber: string;
  botProvider: string; // e.g., 'Typebot', 'Dialogflow', 'Custom'
  botId: string;
  welcomeMessage: string;
  humanTimeoutMinutes: number;
  humanAgentNumber: string;
  enabled: boolean;
}

export interface SystemSettings {
  // General
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  baseUrl: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  
  // New Email & Communication
  emailConfig: EmailConfig;
  whatsappConfig: WhatsappConfig;

  // Banners
  bannerRotationInterval: number; 
  
  // Sell CTA Banner (Home)
  sellCtaTitle: string;
  sellCtaText: string;
  sellCtaButtonText: string;
  sellCtaImage: string;

  // Payment
  paymentGateway: 'abacatepay' | 'manual';
  abacatePayApiKey?: string; // API Key do Abacate Pay
  recurringPayments: boolean;
  extraFeesPercentage: number;
  
  // Security / Advanced
  uploadLimitMB: number;
  allowedIPs: string[]; // Allowlist
}