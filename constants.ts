
import { Category, Condition, DeliveryMethod, Product, ServiceListing, UserProfile, Notification, Banner, Brand, Plan, Coupon, ThemeConfig, ContentPage, SystemSettings, MarketingConfig } from './types';

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'guitarras',
    name: 'Guitarras',
    icon: 'Guitar', // Lucide icon
    subcategories: [
      'Guitarras Stratocaster',
      'Guitarras Telecaster',
      'Guitarras Les Paul',
      'Guitarras SG',
      'Guitarras Superstrato',
      'Guitarras Semiacústicas',
      'Guitarras Hollow Body',
      'Guitarras Offset (Jazzmaster, Jaguar)',
      'Guitarras 7 ou 8 Cordas',
      'Guitarras Canhotas'
    ],
    active: true,
    image: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=640&h=400&fit=crop'
  },
  {
    id: 'baixos',
    name: 'Baixos',
    icon: 'Music',
    subcategories: [
      'Baixos de 4 cordas',
      'Baixos de 5 cordas',
      'Baixos de 6 cordas',
      'Baixos Fretless',
      'Baixos Acústicos',
      'Baixos Short Scale'
    ],
    active: true,
    image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=640&h=400&fit=crop'
  },
  {
    id: 'violoes',
    name: 'Violões',
    icon: 'Music',
    subcategories: [
      'Violões de Aço',
      'Violões de Nylon',
      'Violões Eletroacústicos',
      'Violões Folk / Dreadnought',
      'Violões Clássicos',
      'Violões Jumbo',
      'Violões 12 Cordas',
      'Ukuleles'
    ],
    active: true,
    image: 'https://images.unsplash.com/photo-1525201545678-146045bd1cbe?q=80&w=640&h=400&fit=crop'
  },
  {
    id: 'amplificadores',
    name: 'Amplificadores',
    icon: 'Speaker',
    subcategories: [
      'Combos de Guitarra',
      'Cabeçotes de Guitarra',
      'Gabinetes / Caixas de Guitarra',
      'Combos de Baixo',
      'Cabeçotes de Baixo',
      'Gabinetes / Caixas de Baixo',
      'Amplificadores de Violão',
      'Amplificadores Valvulados',
      'Mini Amplificadores'
    ],
    active: true,
    image: 'https://images.unsplash.com/photo-1565965451305-2888e78b491a?q=80&w=640&h=400&fit=crop'
  },
  {
    id: 'pedais-efeitos',
    name: 'Pedais e Efeitos',
    icon: 'Zap',
    subcategories: [
      'Overdrive e Distortion',
      'Fuzz',
      'Delay e Reverb',
      'Modulações (Chorus, Flanger, Phaser)',
      'Pedaleiras Multi-efeitos',
      'Compressores',
      'Wah-Wah e Filtros',
      'Loopers',
      'Pedalboards e Fontes',
      'Controladores MIDI de Pé'
    ],
    active: true,
    image: 'https://images.unsplash.com/photo-1519508234439-4f23643125c1?q=80&w=640&h=400&fit=crop'
  },
  {
    id: 'bateria-percussao',
    name: 'Bateria e Percussão',
    icon: 'Disc',
    subcategories: [
      'Baterias Acústicas',
      'Baterias Eletrônicas',
      'Pratos (Címbalos)',
      'Caixas (Snares)',
      'Pedais de Bateria',
      'Ferragens e Hardware',
      'Peles',
      'Percussão Latina (Congas, Bongôs)',
      'Cajons'
    ],
    active: true,
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=640&h=400&fit=crop'
  },
  {
    id: 'teclados-pianos',
    name: 'Teclados e Pianos',
    icon: 'Piano',
    subcategories: [
      'Pianos Digitais',
      'Sintetizadores',
      'Teclados Arranjadores',
      'Workstations',
      'Controladores MIDI',
      'Pianos Acústicos',
      'Órgãos e Clavinets'
    ],
    active: true,
    image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=640&h=400&fit=crop'
  },
  {
    id: 'audio-pro',
    name: 'Áudio Profissional',
    icon: 'Mic2',
    subcategories: [
      'Microfones de Estúdio',
      'Microfones Dinâmicos / Palco',
      'Interfaces de Áudio',
      'Monitores de Referência',
      'Fones de Ouvido',
      'Mesas de Som / Mixers',
      'Sistemas Sem Fio (In-Ear / Microfones)',
      'Pré-amplificadores e Processadores'
    ],
    active: true,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=640&h=400&fit=crop'
  },
  {
    id: 'sopro-orquestra',
    name: 'Sopro e Orquestra',
    icon: 'Wind',
    subcategories: [
      'Saxofones',
      'Trompetes',
      'Flautas',
      'Violinos e Violas',
      'Violoncelos',
      'Harmônicas (Gaitas)'
    ],
    active: true,
    image: 'https://images.unsplash.com/photo-1573871666457-7c7329118cf9?q=80&w=640&h=400&fit=crop'
  },
  {
    id: 'acessorios',
    name: 'Acessórios',
    icon: 'Package',
    subcategories: [
      'Cabos e Conectores',
      'Cordas (Guitarra, Baixo, Violão)',
      'Cases e Bags',
      'Suportes e Estantes',
      'Correias',
      'Capotrastes e Palhetas',
      'Manutenção e Limpeza'
    ],
    active: true,
    image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?q=80&w=640&h=400&fit=crop'
  }
];

export const CATEGORIES = SEED_CATEGORIES;

export const SEED_BRANDS: Brand[] = [
  // Guitarras, Baixos e Instrumentos de Corda
  { id: 'b1', name: 'Fender', description: 'Guitarra Elétrica, Baixo Elétrico, Violão, Amplificador', active: true },
  { id: 'b2', name: 'Gibson', description: 'Guitarra Elétrica, Violão Acústico', active: true },
  { id: 'b3', name: 'SIRE', description: 'Baixo Elétrico, Guitarra Elétrica', active: true },
  { id: 'b4', name: 'Ibanez', description: 'Guitarra Elétrica, Baixo Elétrico, Violão', active: true },
  { id: 'b5', name: 'PRS Guitars', description: 'Guitarra Elétrica, Violão Acústico', active: true },
  { id: 'b6', name: 'Tagima', description: 'Guitarra Elétrica, Baixo Elétrico, Violão', active: true },
  { id: 'b7', name: 'Giannini', description: 'Violão Acústico, Cavaquinho, Viola Caipira, Cordas', active: true },
  { id: 'b8', name: 'ESP / LTD', description: 'Guitarra Elétrica, Baixo Elétrico', active: true },
  { id: 'b9', name: 'Martin & Co.', description: 'Violão Acústico', active: true },
  { id: 'b10', name: 'Taylor', description: 'Violão Acústico', active: true },
  { id: 'b11', name: 'Cort', description: 'Guitarra Elétrica, Baixo Elétrico, Violão', active: true },
  { id: 'b12', name: 'Warwick', description: 'Baixo Elétrico', active: true },
  { id: 'b13', name: 'Jackson', description: 'Guitarra Elétrica', active: true },
  { id: 'b14', name: 'Takamine', description: 'Violão Eletroacústico', active: true },
  { id: 'b15', name: 'Rozini', description: 'Viola Caipira, Cavaquinho, Bandolim, Violão', active: true },
  { id: 'b16', name: 'Rickenbacker', description: 'Guitarra Elétrica, Baixo Elétrico', active: true },
  { id: 'b17', name: 'Squier', description: 'Guitarra Elétrica, Baixo Elétrico', active: true },
  { id: 'b18', name: 'Epiphone', description: 'Guitarra Elétrica, Violão Acústico', active: true },
  { id: 'b19', name: 'Michael', description: 'Violão, Guitarra, Baixo, Instrumentos de Sopro', active: true },
  { id: 'b20', name: 'Dean Guitars', description: 'Guitarra Elétrica, Baixo Elétrico', active: true },
  { id: 'b21', name: 'Seagull', description: 'Violão Acústico', active: true },
  { id: 'b22', name: "D'Addario", description: 'Cordas, Acessórios', active: true },
  { id: 'b23', name: 'Ernie Ball', description: 'Cordas, Pedais de Volume, Acessórios', active: true },

  // Amplificadores, Pedais e Efeitos
  { id: 'b24', name: 'Marshall', description: 'Amplificador de Guitarra, Gabinete', active: true },
  { id: 'b25', name: 'Boss', description: 'Pedal de Efeito, Multiefeito, Loop Station', active: true },
  { id: 'b26', name: 'Strymon', description: 'Pedal de Efeito Boutique, Delay, Reverb, Modulação', active: true },
  { id: 'b27', name: 'Mesa/Boogie', description: 'Amplificador de Guitarra, Gabinete', active: true },
  { id: 'b28', name: 'Landscape', description: 'Pedal de Efeito, Fonte de Alimentação, Acessórios', active: true },
  { id: 'b29', name: 'Santo Angelo', description: 'Cabos, Conectores, Acessórios', active: true },
  { id: 'b30', name: 'Orange', description: 'Amplificador de Guitarra, Amplificador de Baixo', active: true },
  { id: 'b31', name: 'Ampeg', description: 'Amplificador de Baixo', active: true },
  { id: 'b32', name: 'Vox', description: 'Amplificador de Guitarra', active: true },

  // Teclas e Áudio
  { id: 'b33', name: 'Yamaha', description: 'Teclado, Piano Digital, Bateria, Violão, Áudio Pro', active: true },
  { id: 'b34', name: 'Roland', description: 'Teclado, Sintetizador, Bateria Eletrônica, Amplificador', active: true },
  { id: 'b35', name: 'Korg', description: 'Teclado, Sintetizador, Piano Digital', active: true },
  { id: 'b36', name: 'Nord', description: 'Teclado, Sintetizador, Piano de Palco', active: true },
  { id: 'b37', name: 'Casio', description: 'Teclado, Piano Digital', active: true },
  { id: 'b38', name: 'Shure', description: 'Microfone, Fone de Ouvido, Sistema Sem Fio', active: true },
  { id: 'b39', name: 'Sennheiser', description: 'Microfone, Fone de Ouvido', active: true },
  { id: 'b40', name: 'Behringer', description: 'Mesa de Som, Interface de Áudio, Pedal, Sintetizador', active: true },
  { id: 'b41', name: 'AKG', description: 'Microfone, Fone de Ouvido', active: true },
  { id: 'b42', name: 'JBL', description: 'Caixa de Som, Monitor de Referência, PA Portátil', active: true },
  { id: 'b43', name: 'Focusrite', description: 'Interface de Áudio', active: true },
  { id: 'b44', name: 'Mackie', description: 'Mesa de Som, Monitor de Referência', active: true },

  // Bateria
  { id: 'b45', name: 'Pearl', description: 'Bateria Acústica, Ferragens, Pedal', active: true },
  { id: 'b46', name: 'Tama', description: 'Bateria Acústica, Ferragens, Pedal', active: true },
  { id: 'b47', name: 'Mapex', description: 'Bateria Acústica, Ferragens', active: true },
  { id: 'b48', name: 'DW Drums', description: 'Bateria Custom, Ferragens, Pedal', active: true },
  { id: 'b49', name: 'Zildjian', description: 'Pratos, Baquetas', active: true },
  { id: 'b50', name: 'Sabian', description: 'Pratos', active: true },
  { id: 'b51', name: 'Paiste', description: 'Pratos', active: true },
  
  // genérico
  { id: 'other', name: 'Outros', description: 'Outras marcas não listadas', active: true }
];

// MOCK DATA FOR DEVELOPMENT
export const SEED_DATABASE = {
  users: [
    {
      id: 'u1',
      role: 'admin',
      name: 'Admin MusicPlace',
      email: 'admin@musicplace.com',
      phone: '(11) 99999-9999',
      state: 'SP',
      city: 'São Paulo',
      accountType: 'professional',
      createdAt: new Date().toISOString(),
      isBanned: false,
      plan: 'plan-pro'
    } as UserProfile,
    {
      id: 'u2',
      role: 'user',
      name: 'João da Silva',
      email: 'joao@email.com',
      phone: '(11) 98888-8888',
      state: 'SP',
      city: 'Campinas',
      accountType: 'individual',
      createdAt: new Date().toISOString(),
      isBanned: false,
      plan: 'plan-basic'
    } as UserProfile,
    {
      id: 'u3',
      role: 'user',
      name: 'Music Shop Pro',
      email: 'contato@musicshoppro.com',
      phone: '(11) 3333-3333',
      state: 'SP',
      city: 'São Paulo',
      accountType: 'store',
      tradeName: 'Music Shop Pro',
      createdAt: new Date().toISOString(),
      isBanned: false,
      plan: 'plan-store'
    } as UserProfile
  ],
  products: [
    {
      id: 'p1',
      userId: 'u2',
      title: 'Guitarra Fender Stratocaster Mexicana Standard',
      price: 4500,
      images: [
        'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=800&auto=format&fit=crop'
      ],
      category: 'Guitarras',
      subcategory: 'Guitarras Stratocaster',
      condition: Condition.SEMINOVO,
      locationState: 'SP',
      locationCity: 'Campinas',
      description: 'Guitarra em perfeito estado, regulada por luthier. Acompanha bag original.',
      delivery: DeliveryMethod.AMBOS,
      sellerName: 'João da Silva',
      sellerRating: 4.8,
      createdAt: new Date().toISOString(),
      status: 'active',
      featured: true,
      whatsapp: '(11) 98888-8888',
      brand: 'Fender',
      model: 'Standard Stratocaster',
      year: 2010,
      acceptsNegotiation: true,
      acceptsTrade: false,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    } as Product,
    {
      id: 'p2',
      userId: 'u3',
      title: 'Teclado Nord Stage 3 88',
      price: 28000,
      images: [
        'https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=800&auto=format&fit=crop'
      ],
      category: 'Teclados e Pianos',
      subcategory: 'Pianos de Palco',
      condition: Condition.NOVO,
      locationState: 'SP',
      locationCity: 'São Paulo',
      description: 'Produto novo na caixa com garantia e nota fiscal. Enviamos para todo Brasil.',
      delivery: DeliveryMethod.ENVIO,
      sellerName: 'Music Shop Pro',
      sellerRating: 5.0,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: 'active',
      featured: true,
      whatsapp: '(11) 3333-3333',
      brand: 'Nord',
      model: 'Stage 3 88',
      year: 2023,
      acceptsNegotiation: false,
      acceptsTrade: true,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    } as Product,
    {
      id: 'p3',
      userId: 'u2',
      title: 'Pedal Boss DD-7 Digital Delay',
      price: 850,
      images: [
        'https://images.unsplash.com/photo-1519508234439-4f23643125c1?q=80&w=800&auto=format&fit=crop'
      ],
      category: 'Pedais e Efeitos',
      subcategory: 'Delay e Reverb',
      condition: Condition.USADO,
      locationState: 'SP',
      locationCity: 'Campinas',
      description: 'Algumas marcas de uso mas funcionando 100%. Velcro no fundo.',
      delivery: DeliveryMethod.RETIRADA,
      sellerName: 'João da Silva',
      sellerRating: 4.8,
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      status: 'active',
      featured: false,
      whatsapp: '(11) 98888-8888',
      brand: 'Boss',
      model: 'DD-7',
      acceptsNegotiation: true,
      acceptsTrade: false,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    } as Product
  ],
  notifications: [
    {
      id: 'n1',
      userId: 'u2',
      type: 'success',
      title: 'Anúncio Aprovado',
      message: 'Sua Guitarra Fender foi aprovada e já está visível para compradores.',
      read: false,
      createdAt: new Date().toISOString()
    } as Notification,
    {
      id: 'n2',
      userId: 'u2',
      type: 'info',
      title: 'Dica de Venda',
      message: 'Adicione mais fotos ao seu anúncio do Pedal Boss para vender mais rápido.',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    } as Notification
  ],
  favorites: ['p2'],
  banners: [
    {
       id: 'b1',
       title: 'Venda seus equipamentos parados',
       description: 'Transforme seus instrumentos antigos em dinheiro novo. Anuncie grátis hoje mesmo!',
       desktopImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=1920&auto=format&fit=crop',
       mobileImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800&auto=format&fit=crop',
       buttonText: 'Começar a Vender',
       buttonLink: '/anunciar',
       active: true,
       order: 1,
       isPrincipal: true
    },
    {
       id: 'b2',
       title: 'Encontre o timbre perfeito',
       description: 'Milhares de pedais, amplificadores e guitarras esperando por você.',
       desktopImage: 'https://images.unsplash.com/photo-1525201545678-146045bd1cbe?q=80&w=1920&auto=format&fit=crop',
       mobileImage: 'https://images.unsplash.com/photo-1525201545678-146045bd1cbe?q=80&w=800&auto=format&fit=crop',
       buttonText: 'Ver Ofertas',
       buttonLink: '/busca',
       active: true,
       order: 2,
       isPrincipal: false
    }
  ] as Banner[],
  categories: SEED_CATEGORIES,
  brands: SEED_BRANDS,
  plans: [
    {
       id: 'plan-basic',
       name: 'Básico',
       description: 'Para começar a vender',
       price: 0,
       duration: 'monthly',
       adLimit: 2,
       featuredLimit: 0,
       targetAudience: 'individual',
       benefits: ['2 Anúncios Grátis', 'Chat com compradores'],
       active: true
    },
    {
       id: 'plan-pro',
       name: 'Profissional',
       description: 'Para quem negocia com frequência',
       price: 29.90,
       duration: 'monthly',
       adLimit: 20,
       featuredLimit: 2,
       targetAudience: 'professional',
       benefits: ['20 Anúncios', '2 Destaques', 'Estatísticas avançadas'],
       active: true
    },
    {
       id: 'plan-store',
       name: 'Loja Parceira',
       description: 'Solução completa para lojistas',
       price: 99.90,
       duration: 'monthly',
       adLimit: -1, // Unlimited
       featuredLimit: 10,
       targetAudience: 'store',
       benefits: ['Anúncios Ilimitados', '10 Destaques', 'Página exclusiva', 'Suporte VIP'],
       active: true
    }
  ] as Plan[],
  coupons: [
    {
      id: 'c1',
      code: 'BEMVINDO10',
      discountType: 'percentage',
      value: 10,
      usageCount: 12,
      active: true,
      applicablePlans: ['all']
    }
  ] as Coupon[],
  settings: {
    siteName: 'MusicPlace',
    logoUrl: '',
    faviconUrl: '',
    baseUrl: 'https://musicplace.com.br',
    maintenanceMode: false,
    maintenanceMessage: 'Estamos em manutenção para melhorar sua experiência. Voltamos logo!',
    bannerRotationInterval: 5,
    paymentGateway: 'mercadopago',
    recurringPayments: true,
    extraFeesPercentage: 0,
    uploadLimitMB: 5,
    allowedIPs: []
  } as SystemSettings,
  theme: {
    primaryColor: '#0057FF',
    secondaryColor: '#111827',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    header: {
      logoUrl: '',
      backgroundColor: '#FFFFFF',
      textColor: '#111827',
      linksColor: '#4B5563',
      visible: true
    },
    footer: {
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      socialLinks: [
        { label: 'Instagram', url: 'https://instagram.com', icon: 'Instagram' },
        { label: 'Facebook', url: 'https://facebook.com', icon: 'Facebook' },
        { label: 'Twitter', url: 'https://twitter.com', icon: 'Twitter' }
      ],
      copyrightText: '© 2024 MusicPlace. Todos os direitos reservados.'
    }
  } as ThemeConfig,
  content: [
    { id: 'p1', slug: 'termos-de-uso', title: 'Termos de Uso', content: '<h1>Termos de Uso</h1><p>Texto padrão...</p>', active: true },
    { id: 'p2', slug: 'privacidade', title: 'Política de Privacidade', content: '<h1>Privacidade</h1><p>Texto padrão...</p>', active: true }
  ] as ContentPage[],
  marketing: {
    popupEnabled: false,
    popupContent: '',
    popupLink: '',
    pushEnabled: false,
    pixelId: '',
    googleTagId: ''
  } as MarketingConfig
};

export const SERVICES_MOCK: ServiceListing[] = [
  {
    id: 's1',
    name: 'Roberto Luthier',
    type: 'Luthier',
    location: 'São Paulo, SP',
    rating: 4.9,
    priceRange: '$$',
    image: 'https://images.unsplash.com/photo-1586173806725-797f4d632f5d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 's2',
    name: 'Studio 54',
    type: 'Estúdio',
    location: 'Rio de Janeiro, RJ',
    rating: 5.0,
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 's3',
    name: 'Ana Keys',
    type: 'Professor',
    location: 'Online / Curitiba',
    rating: 4.8,
    priceRange: '$',
    image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=800&auto=format&fit=crop'
  }
];

export const STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];
