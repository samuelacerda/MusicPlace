
import { supabase } from './supabase';
import { CATEGORIES, SEED_BRANDS, STATES } from '../constants';
import { Condition, DeliveryMethod, Product } from '../types';

const AD_TITLES = [
  'Guitarra Fender Stratocaster Custom Shop',
  'Baixo Sire Marcus Miller V7 2nd Gen',
  'Violão Taylor 214ce Deluxe',
  'Amplificador Marshall DSL40CR',
  'Pedal Strymon BigSky Reverb',
  'Bateria Tama Starclassic Walnut/Birch',
  'Teclado Roland RD-2000 Stage Piano',
  'Interface de Áudio Focusrite Scarlett 18i20',
  'Microfone Shure SM7B',
  'Saxofone Yamaha YAS-62 Professional',
  'Pedaleira Boss GT-1000',
  'Guitarra Gibson Les Paul Standard 60s',
  'Baixo Fender Precision American Professional II',
  'Violão Martin D-28 Authentic',
  'Monitor de Referência Yamaha HS8',
  'Sintetizador Korg Minilogue XD',
  'Pratos Zildjian K Custom Dark Set',
  'Caixa de Som JBL EON715',
  'Mesa de Som Behringer X32 Compact',
  'Guitarra Tagima Stella DW'
];

const DESCRIPTIONS = [
  'Instrumento em estado impecável, pouco uso. Acompanha todos os acessórios originais e nota fiscal.',
  'Excelente sonoridade e tocabilidade. Recentemente regulado por luthier de confiança.',
  'Ideal para profissionais e amadores exigentes. Timbre clássico que você procura.',
  'Venda por motivo de upgrade. Funcionando perfeitamente, sem detalhes.',
  'Um dos melhores equipamentos da categoria. Quem conhece sabe a qualidade.',
  'Sempre mantido em ambiente controlado e com capa protetora. Único dono.',
  'Oportunidade única para adquirir um clássico por um preço justo.',
  'Versátil e robusto, pronto para a estrada ou estúdio.'
];

const IMAGES = [
  'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1525201545678-146045bd1cbe?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565965451305-2888e78b491a?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519508234439-4f23643125c1?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573871666457-7c7329118cf9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?q=80&w=800&auto=format&fit=crop'
];

const CITIES = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Brasília', 'Salvador', 'Fortaleza', 'Recife', 'Goiânia'];

export const seedFakeAds = async (count: number = 10, userId: string) => {
  if (!supabase) throw new Error('Supabase not configured');

  // Ensure user exists in profiles to avoid FK errors
  const { data: profile } = await supabase.from('profiles').select('id').eq('id', userId).single();
  
  if (!profile) {
    console.log(`User ${userId} not found in profiles, creating dummy profile...`);
    await supabase.from('profiles').insert({
      id: userId,
      email: userId === 'u1' ? 'admin@musicplace.com' : `${userId}@example.com`,
      name: 'Vendedor Seed',
      role: 'user',
      account_type: 'individual',
      created_at: new Date().toISOString()
    });
  }

  const ads = [];
  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const subcategory = category.subcategories[Math.floor(Math.random() * category.subcategories.length)];
    const brand = SEED_BRANDS[Math.floor(Math.random() * SEED_BRANDS.length)];
    const state = STATES[Math.floor(Math.random() * STATES.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const condition = Object.values(Condition)[Math.floor(Math.random() * Object.values(Condition).length)];
    const delivery = Object.values(DeliveryMethod)[Math.floor(Math.random() * Object.values(DeliveryMethod).length)];
    
    const ad = {
      user_id: userId,
      title: AD_TITLES[Math.floor(Math.random() * AD_TITLES.length)],
      price: Math.floor(Math.random() * 15000) + 500,
      images: [IMAGES[Math.floor(Math.random() * IMAGES.length)], IMAGES[Math.floor(Math.random() * IMAGES.length)]],
      category: category.name,
      subcategory: subcategory,
      condition: condition,
      brand: brand.name,
      model: 'Modelo ' + (i + 1),
      year: 2010 + Math.floor(Math.random() * 14),
      location_state: state,
      location_city: city,
      description: DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)],
      delivery: delivery,
      seller_name: 'Vendedor Fake',
      whatsapp: '5511999999999',
      status: 'active',
      featured: Math.random() > 0.7,
      accepts_negotiation: Math.random() > 0.5,
      accepts_trade: Math.random() > 0.5,
      expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    ads.push(ad);
  }

  const { data, error } = await supabase.from('products').insert(ads);
  if (error) throw error;
  return data;
};
