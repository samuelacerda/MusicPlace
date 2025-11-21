
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, UserProfile, ProductStatus, Notification, Message, Banner, Category, Brand, Plan, Coupon, SystemSettings, ThemeConfig, ContentPage, MarketingConfig, Log } from '../types';
import { SEED_DATABASE } from '../constants';

interface AppState {
  // Database Tables
  users: UserProfile[];
  products: Product[];
  reports: any[];
  notifications: Notification[];
  messages: Message[];
  favorites: string[]; 
  banners: Banner[];
  categories: Category[];
  brands: Brand[];
  plans: Plan[];
  coupons: Coupon[];
  
  // Config Tables
  systemSettings: SystemSettings;
  theme: ThemeConfig;
  contentPages: ContentPage[];
  marketing: MarketingConfig;
  logs: Log[];
  
  // Auth State
  currentUser: UserProfile | null;

  // Actions
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  
  // Auth Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  registerUser: (user: UserProfile) => void;
  updateProfile: (userId: string, data: Partial<UserProfile>) => void;
  
  // Product Actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  markAsSold: (id: string) => void;
  toggleFavorite: (id: string) => void;
  
  // Admin Actions
  approveProduct: (id: string) => void;
  rejectProduct: (id: string) => void;
  banUser: (id: string) => void;
  unbanUser: (id: string) => void;
  adminCreateUser: (user: UserProfile) => void;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  
  // Theme & Content Actions
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateContentPage: (id: string, data: Partial<ContentPage>) => void;
  updateMarketing: (data: Partial<MarketingConfig>) => void;
  addLog: (action: string, details: string) => void;

  // Dynamic Data Management Actions
  addBanner: (banner: Banner) => void;
  updateBanner: (id: string, data: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;

  addCategory: (category: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  clearCategories: () => void;

  addBrand: (brand: Brand) => void;
  updateBrand: (id: string, data: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;

  addPlan: (plan: Plan) => void;
  updatePlan: (id: string, data: Partial<Plan>) => void;
  deletePlan: (id: string) => void;

  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, data: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  
  // Expiration Logic
  checkExpirations: () => void;
  renewProduct: (id: string) => void;
  updateProductExpiration: (id: string, newDate: string) => void;
  toggleFeatured: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial Data 
      users: SEED_DATABASE.users,
      products: SEED_DATABASE.products,
      reports: [],
      notifications: SEED_DATABASE.notifications,
      messages: [],
      currentUser: null,
      searchQuery: '',
      favorites: SEED_DATABASE.favorites,
      banners: SEED_DATABASE.banners,
      categories: SEED_DATABASE.categories,
      brands: SEED_DATABASE.brands,
      plans: SEED_DATABASE.plans,
      coupons: SEED_DATABASE.coupons,
      
      // Configs
      systemSettings: SEED_DATABASE.settings,
      theme: SEED_DATABASE.theme,
      contentPages: SEED_DATABASE.content,
      marketing: SEED_DATABASE.marketing,
      logs: [],

      setSearchQuery: (query) => set({ searchQuery: query }),

      // Auth
      login: (email, password) => {
        const user = get().users.find(u => u.email === email);
        if (user && !user.isBanned) {
            if (email === 'admin@musicplace.com' && password !== 'admin123') return false;
            if (email !== 'admin@musicplace.com' && password.length < 3) return false; 
            
            set({ currentUser: user });
            get().addLog('LOGIN', `User ${user.email} logged in.`);
            return true;
        }
        return false;
      },
      
      logout: () => set({ currentUser: null }),
      
      registerUser: (newUser) => {
        set((state) => ({ 
          users: [...state.users, newUser],
          currentUser: newUser 
        }));
        get().addLog('REGISTER', `New user registered: ${newUser.email}`);
      },

      adminCreateUser: (newUser) => {
        set((state) => ({
          users: [...state.users, newUser]
        }));
        get().addLog('ADMIN_CREATE_USER', `Admin created user: ${newUser.email}`);
      },

      updateProfile: (userId, data) => {
        set((state) => {
          const updatedUsers = state.users.map(u => u.id === userId ? { ...u, ...data } : u);
          const updatedCurrentUser = state.currentUser?.id === userId ? { ...state.currentUser, ...data } : state.currentUser;
          
          const updatedProducts = state.products.map(p => {
             if (p.userId === userId) {
               return { 
                 ...p, 
                 sellerName: data.name || p.sellerName, 
                 whatsapp: data.phone || p.whatsapp,
                 locationState: data.state || p.locationState,
                 locationCity: data.city || p.locationCity
               };
             }
             return p;
          });

          return {
            users: updatedUsers,
            currentUser: updatedCurrentUser,
            products: updatedProducts
          };
        });
      },

      addProduct: (product) => {
        // Calculate expiration
        const user = get().currentUser;
        const planId = user?.plan;
        const plan = get().plans.find(p => p.id === planId);
        const isPaid = plan && plan.price > 0;
        
        const days = isPaid ? 30 : 15;
        const expirationDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        
        const productWithExpiration = { ...product, expirationDate };
        
        set((state) => ({ products: [productWithExpiration, ...state.products] }));
      },
      
      updateProduct: (id, data) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...data } : p)
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),

      markAsSold: (id) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, status: 'sold' } : p)
      })),
      
      toggleFavorite: (id) => set((state) => {
        const isFav = state.favorites.includes(id);
        return {
          favorites: isFav 
            ? state.favorites.filter(favId => favId !== id)
            : [...state.favorites, id]
        };
      }),

      approveProduct: (id) => {
        set((state) => ({
          products: state.products.map(p => p.id === id ? { ...p, status: 'active' } : p)
        }));
        get().addLog('APPROVE_AD', `Product ${id} approved.`);
      },
      
      rejectProduct: (id) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, status: 'rejected' } : p)
      })),

      banUser: (id) => {
        set((state) => ({
          users: state.users.map(u => u.id === id ? { ...u, isBanned: true } : u),
          products: state.products.map(p => p.userId === id ? { ...p, status: 'rejected' } : p)
        }));
        get().addLog('BAN_USER', `User ${id} banned.`);
      },
      
      unbanUser: (id) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, isBanned: false } : u)
      })),

      updateSystemSettings: (data) => set((state) => ({
        systemSettings: { ...state.systemSettings, ...data }
      })),

      updateTheme: (data) => set((state) => ({
        theme: { ...state.theme, ...data }
      })),

      updateContentPage: (id, data) => set((state) => ({
        contentPages: state.contentPages.map(p => p.id === id ? { ...p, ...data } : p)
      })),

      updateMarketing: (data) => set((state) => ({
        marketing: { ...state.marketing, ...data }
      })),

      addLog: (action, details) => set((state) => ({
        logs: [{ id: Date.now().toString(), action, details, date: new Date().toISOString(), adminId: state.currentUser?.id }, ...state.logs]
      })),

      addBanner: (banner) => set((state) => ({ banners: [...state.banners, banner] })),
      updateBanner: (id, data) => set((state) => ({
        banners: state.banners.map(b => b.id === id ? { ...b, ...data } : b)
      })),
      deleteBanner: (id) => set((state) => ({ banners: state.banners.filter(b => b.id !== id) })),

      addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (id, data) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...data } : c)
      })),
      deleteCategory: (id) => set((state) => ({ categories: state.categories.filter(c => c.id !== id) })),
      clearCategories: () => set({ categories: [] }),

      addBrand: (brand) => set((state) => ({ brands: [...state.brands, brand] })),
      updateBrand: (id, data) => set((state) => ({
        brands: state.brands.map(b => b.id === id ? { ...b, ...data } : b)
      })),
      deleteBrand: (id) => set((state) => ({ brands: state.brands.filter(b => b.id !== id) })),

      addPlan: (plan) => set((state) => ({ plans: [...state.plans, plan] })),
      updatePlan: (id, data) => set((state) => ({
        plans: state.plans.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      deletePlan: (id) => set((state) => ({ plans: state.plans.filter(p => p.id !== id) })),

      addCoupon: (coupon) => set((state) => ({ coupons: [...state.coupons, coupon] })),
      updateCoupon: (id, data) => set((state) => ({
        coupons: state.coupons.map(c => c.id === id ? { ...c, ...data } : c)
      })),
      deleteCoupon: (id) => set((state) => ({ coupons: state.coupons.filter(c => c.id !== id) })),

      checkExpirations: () => {
        const now = new Date();
        set((state) => ({
          products: state.products.map(p => {
             if (p.status === 'active' && p.expirationDate) {
               const expDate = new Date(p.expirationDate);
               if (now > expDate) {
                 return { ...p, status: 'expired' };
               }
             }
             return p;
          })
        }));
      },

      renewProduct: (id) => {
        set((state) => {
          const product = state.products.find(p => p.id === id);
          if (!product) return {};

          const user = state.users.find(u => u.id === product.userId);
          const plan = state.plans.find(plan => plan.id === user?.plan);
          const isPaid = plan && plan.price > 0;
          const days = isPaid ? 30 : 15;
          
          const newExpiration = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

          return {
            products: state.products.map(p => p.id === id ? { ...p, status: 'active', expirationDate: newExpiration } : p)
          };
        });
        get().addLog('RENEW_AD', `Product ${id} renewed.`);
      },

      updateProductExpiration: (id, newDate) => {
        set((state) => ({
          products: state.products.map(p => p.id === id ? { ...p, expirationDate: newDate } : p)
        }));
        get().addLog('ADMIN_UPDATE_EXP', `Updated expiration for product ${id}`);
      },

      toggleFeatured: (id) => {
        set((state) => ({
          products: state.products.map(p => p.id === id ? { ...p, featured: !p.featured } : p)
        }));
        get().addLog('ADMIN_TOGGLE_FEATURED', `Toggled featured for product ${id}`);
      }
    }),
    {
      name: 'musicplace-db-v13', 
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        users: state.users, 
        products: state.products, 
        reports: state.reports,
        notifications: state.notifications,
        messages: state.messages,
        favorites: state.favorites,
        banners: state.banners,
        categories: state.categories,
        brands: state.brands,
        plans: state.plans,
        coupons: state.coupons,
        systemSettings: state.systemSettings,
        theme: state.theme,
        contentPages: state.contentPages,
        marketing: state.marketing,
        logs: state.logs
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
            if (!state.users?.length) state.users = SEED_DATABASE.users;
            if (!state.products?.length) state.products = SEED_DATABASE.products;
            if (!state.plans?.length) state.plans = SEED_DATABASE.plans;
            if (!state.coupons?.length) state.coupons = SEED_DATABASE.coupons;
            if (!state.systemSettings) state.systemSettings = SEED_DATABASE.settings;
            if (!state.theme) state.theme = SEED_DATABASE.theme;
            if (!state.contentPages?.length) state.contentPages = SEED_DATABASE.content;
            if (!state.marketing) state.marketing = SEED_DATABASE.marketing;
        }
      }
    }
  )
);
