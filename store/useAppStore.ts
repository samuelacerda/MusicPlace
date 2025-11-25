
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, UserProfile, ProductStatus, Notification, Message, Banner, Category, Brand, Plan, Coupon, SystemSettings, ThemeConfig, ContentPage, MarketingConfig, Log, BlogPost, Ticket } from '../types';
import { SEED_DATABASE } from '../constants';
import { supabase } from '../services/supabase';

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
  blogPosts: BlogPost[];
  recentlyViewed: string[]; // Array of product IDs
  tickets: Ticket[];
  
  // Config Tables
  systemSettings: SystemSettings;
  theme: ThemeConfig;
  contentPages: ContentPage[];
  marketing: MarketingConfig;
  logs: Log[];
  
  // Auth & System State
  currentUser: UserProfile | null;
  isLoading: boolean;
  searchQuery: string;

  // Actions
  setSearchQuery: (query: string) => void;
  
  // Initialization
  fetchData: () => Promise<void>;

  // Auth Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  registerUser: (user: UserProfile, password?: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (userId: string, data: Partial<UserProfile>) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  
  // Product Actions
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  markAsSold: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addToRecentlyViewed: (id: string) => void;
  
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

  // Blog Actions
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, data: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  toggleBlogPostFeatured: (id: string) => void;
  
  // Support Actions
  addTicket: (ticket: Ticket) => void;
  sendAdminEmail: (to: string[], subject: string, body: string) => void;

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
      isLoading: false,
      searchQuery: '',
      favorites: SEED_DATABASE.favorites,
      banners: SEED_DATABASE.banners,
      categories: SEED_DATABASE.categories,
      brands: SEED_DATABASE.brands,
      plans: SEED_DATABASE.plans,
      coupons: SEED_DATABASE.coupons,
      blogPosts: SEED_DATABASE.blogPosts,
      recentlyViewed: [],
      tickets: [],
      
      // Configs
      systemSettings: SEED_DATABASE.settings,
      theme: SEED_DATABASE.theme,
      contentPages: SEED_DATABASE.content,
      marketing: SEED_DATABASE.marketing,
      logs: [],

      setSearchQuery: (query) => set({ searchQuery: query }),

      // --- SUPABASE INTEGRATION ---

      fetchData: async () => {
        if (!supabase) return;
        set({ isLoading: true });

        try {
          // 1. Fetch Products
          const { data: productsData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
          if (productsData) {
             const mappedProducts = productsData.map((p: any) => ({
                id: p.id,
                userId: p.user_id,
                title: p.title || '',
                price: p.price,
                images: p.images || [],
                category: p.category || '',
                subcategory: p.subcategory || '',
                condition: p.condition,
                brand: p.brand || '',
                model: p.model || '',
                year: p.year,
                locationState: p.location_state || '',
                locationCity: p.location_city || '',
                description: p.description || '',
                delivery: p.delivery,
                sellerName: p.seller_name || 'Vendedor',
                whatsapp: p.whatsapp || '',
                status: p.status,
                featured: p.featured,
                acceptsNegotiation: p.accepts_negotiation,
                acceptsTrade: p.accepts_trade,
                createdAt: p.created_at,
                expirationDate: p.expiration_date
             }));
             set({ products: mappedProducts as Product[] });
          }

          // 2. Fetch Profiles (Users)
          const { data: usersData } = await supabase.from('profiles').select('*');
          if (usersData) {
             const mappedUsers = usersData.map((u: any) => ({
                id: u.id,
                email: u.email || '',
                name: u.name || 'Usuário',
                role: u.role,
                accountType: u.account_type,
                phone: u.phone || '',
                state: u.state || '',
                city: u.city || '',
                cpf: u.cpf,
                cnpj: u.cnpj,
                legalName: u.legal_name,
                tradeName: u.trade_name,
                professionalArea: u.professional_area,
                bio: u.bio,
                website: u.website,
                plan: u.plan,
                createdAt: u.created_at,
                isBanned: u.is_banned || false
             }));
             set({ users: mappedUsers as UserProfile[] });
          }

        } catch (error) {
          console.error("Error fetching data from Supabase:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        // Limpeza agressiva: remove todos os espaços e força minúsculas
        const cleanEmail = email ? email.replace(/\s/g, '').toLowerCase() : '';
        
        // --- EMERGENCY BACKDOOR (Login de Emergência) ---
        // Permite entrar como Admin Local ignorando o Supabase se as credenciais forem exatas.
        if (cleanEmail === 'admin@force.com' && password === 'force123') {
             console.warn("USANDO LOGIN DE EMERGÊNCIA (Bypass Supabase)");
             const adminUser: UserProfile = {
                id: 'admin-force-local',
                email: 'admin@force.com',
                name: 'Admin de Emergência',
                role: 'admin',
                accountType: 'professional',
                phone: '999999999',
                state: 'SP',
                city: 'São Paulo',
                createdAt: new Date().toISOString(),
                isBanned: false
             };
             set({ currentUser: adminUser });
             get().addLog('LOGIN_FORCE', `Emergency Admin Logged In`);
             return { success: true };
        }
        // ------------------------------------------------

        if (supabase) {
           const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
           if (error) return { success: false, error: error.message };
           
           if (data.user) {
              // Fetch profile details
              let { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
              
              // --- SELF-HEALING: Se o perfil não existir (erro anterior), tenta criar agora ---
              if (!profile) {
                 console.log("Perfil ausente. Tentando corrigir...");
                 // Se for o email do admin, força role admin
                 const role = cleanEmail === 'admin@musicplace.com' || cleanEmail === 'admin.root@musicplace.com' ? 'admin' : 'user';
                 
                 const newProfile = {
                    id: data.user.id,
                    email: cleanEmail,
                    name: data.user.user_metadata?.name || 'Usuário',
                    role: role,
                    account_type: 'individual',
                    created_at: new Date().toISOString()
                 };
                 // Tenta inserir (se falhar, ignora)
                 const { error: createError } = await supabase.from('profiles').insert(newProfile);
                 if(!createError) profile = newProfile;
              }
              // -------------------------------------------------------------------------

              if (profile) {
                 if (profile.is_banned) {
                    await supabase.auth.signOut();
                    return { success: false, error: "Esta conta foi suspensa." };
                 }

                 const user: UserProfile = {
                    id: profile.id,
                    email: profile.email,
                    name: profile.name,
                    role: profile.role as any,
                    accountType: profile.account_type as any,
                    phone: profile.phone || '',
                    state: profile.state || '',
                    city: profile.city || '',
                    cpf: profile.cpf,
                    cnpj: profile.cnpj,
                    legalName: profile.legal_name,
                    tradeName: profile.trade_name,
                    professionalArea: profile.professional_area as any,
                    bio: profile.bio,
                    website: profile.website,
                    plan: profile.plan,
                    createdAt: profile.created_at,
                    isBanned: profile.is_banned || false
                 };
                 set({ currentUser: user });
                 get().addLog('LOGIN', `User ${cleanEmail} logged in via Supabase.`);
                 return { success: true };
              }
           }
           return { success: false, error: "Perfil não encontrado." };
        } else {
           // Fallback Local
           const user = get().users.find(u => u.email === cleanEmail);
           if (user && !user.isBanned) {
               if (cleanEmail === 'admin@musicplace.com' && password !== 'admin123') return { success: false, error: "Senha inválida" };
               if (cleanEmail !== 'admin@musicplace.com' && password.length < 3) return { success: false, error: "Senha inválida" }; 
               
               set({ currentUser: user });
               get().addLog('LOGIN', `User ${user.email} logged in (Local).`);
               return { success: true };
           }
           return { success: false, error: "Usuário não encontrado ou suspenso." };
        }
      },
      
      logout: async () => {
        if (supabase) await supabase.auth.signOut();
        set({ currentUser: null });
      },
      
      registerUser: async (newUser, password) => {
        // Limpeza agressiva do e-mail
        const cleanEmail = newUser.email.replace(/\s/g, '').toLowerCase();
        
        if (supabase && password) {
           // TRUQUE PARA CRIAR O PRIMEIRO ADMIN:
           const role = cleanEmail === 'admin@musicplace.com' || cleanEmail === 'admin.root@musicplace.com' ? 'admin' : 'user';

           // Prepara metadados para o Trigger do banco
           const optionsData = {
              name: newUser.name,
              role: role,
              accountType: newUser.accountType,
              phone: newUser.phone,
              state: newUser.state,
              city: newUser.city,
              cpf: newUser.cpf,
              cnpj: newUser.cnpj,
              legal_name: newUser.legalName,
              trade_name: newUser.tradeName,
              professional_area: newUser.professionalArea,
              bio: newUser.bio,
              website: newUser.website,
              plan: newUser.plan
           };

           // 1. Cria Usuário de Autenticação (O Trigger criará o Perfil)
           const { data: authData, error: authError } = await supabase.auth.signUp({
              email: cleanEmail,
              password: password,
              options: {
                data: optionsData
              }
           });

           if (authError) return { success: false, error: authError.message };
           if (!authData.user) return { success: false, error: "Erro ao criar usuário." };

           // Atualiza estado local imediatamente
           const finalUser = { ...newUser, email: cleanEmail, id: authData.user.id, role: role as any };
           set((state) => ({ users: [...state.users, finalUser], currentUser: finalUser }));
           return { success: true };

        } else {
           // Fallback Local
           set((state) => ({ 
             users: [...state.users, newUser],
             currentUser: newUser 
           }));
           get().addLog('REGISTER', `New user registered: ${newUser.email}`);
           return { success: true };
        }
      },

      adminCreateUser: (newUser) => {
        set((state) => ({
          users: [...state.users, newUser]
        }));
        get().addLog('ADMIN_CREATE_USER', `Admin created user: ${newUser.email}`);
      },

      updateProfile: async (userId, data) => {
        if (supabase) {
           const dbData: any = {};
           if(data.name) dbData.name = data.name;
           if(data.phone) dbData.phone = data.phone;
           if(data.state) dbData.state = data.state;
           if(data.city) dbData.city = data.city;
           // ... map other fields as needed

           await supabase.from('profiles').update(dbData).eq('id', userId);
        }

        set((state) => {
          const updatedUsers = state.users.map(u => u.id === userId ? { ...u, ...data } : u);
          const updatedCurrentUser = state.currentUser?.id === userId ? { ...state.currentUser, ...data } : state.currentUser;
          
          // Also update products if seller info changed
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

      updatePassword: async (newPassword) => {
        const currentUser = get().currentUser;
        
        // Emergency Account Check
        if (currentUser?.email === 'admin@force.com') {
            return { success: false, error: "Conta de Emergência não suporta troca de senha. Crie um novo Admin real na aba Usuários." };
        }

        if (supabase) {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) return { success: false, error: error.message };
            return { success: true };
        }
        
        // Local Fallback (Mock)
        return { success: true };
      },

      requestPasswordReset: async (email) => {
        if (supabase) {
            // Simpler redirect URL for HashRouter. 
            // Supabase will append #access_token=...
            // The AuthListener will detect the event and redirect to /redefinir-senha
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin, 
            });
            if (error) return { success: false, error: error.message };
            return { success: true };
        }
        return { success: false, error: "Erro de conexão com Supabase." };
      },

      addProduct: async (product) => {
        // Calculate expiration
        const user = get().currentUser;
        const planId = user?.plan;
        const plan = get().plans.find(p => p.id === planId);
        const isPaid = plan && plan.price > 0;
        const days = isPaid ? 30 : 15;
        const expirationDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        const productWithExpiration = { ...product, expirationDate };

        if (supabase) {
           // Map to DB Columns
           const dbProduct = {
              user_id: product.userId,
              title: product.title,
              price: product.price,
              images: product.images,
              category: product.category,
              subcategory: product.subcategory,
              condition: product.condition,
              brand: product.brand,
              model: product.model,
              year: product.year,
              location_state: product.locationState,
              location_city: product.locationCity,
              description: product.description,
              delivery: product.delivery,
              seller_name: product.sellerName,
              whatsapp: product.whatsapp,
              status: product.status,
              featured: product.featured,
              accepts_negotiation: product.acceptsNegotiation,
              accepts_trade: product.accepts_trade,
              expiration_date: expirationDate
           };

           const { data, error } = await supabase.from('products').insert(dbProduct).select().single();
           if (data) {
              productWithExpiration.id = data.id; // Use real ID
           } else if (error) {
              console.error("Error adding product to Supabase", error);
           }
        }
        
        set((state) => ({ products: [productWithExpiration, ...state.products] }));
      },
      
      updateProduct: async (id, data) => {
         if (supabase) {
            // Map partial updates to DB
            const dbData: any = {};
            if(data.title) dbData.title = data.title;
            if(data.price) dbData.price = data.price;
            if(data.status) dbData.status = data.status;
            // ... map others as needed
            
            await supabase.from('products').update(dbData).eq('id', id);
         }

         set((state) => ({
            products: state.products.map(p => p.id === id ? { ...p, ...data } : p)
         }));
      },

      deleteProduct: async (id) => {
        if (supabase) {
           await supabase.from('products').delete().eq('id', id);
        }
        set((state) => ({
           products: state.products.filter(p => p.id !== id)
        }));
      },

      markAsSold: (id) => {
         get().updateProduct(id, { status: 'sold' });
      },
      
      toggleFavorite: (id) => set((state) => {
        const isFav = state.favorites.includes(id);
        return {
          favorites: isFav 
            ? state.favorites.filter(favId => favId !== id)
            : [...state.favorites, id]
        };
      }),

      addToRecentlyViewed: (id) => set((state) => {
        const filtered = state.recentlyViewed.filter(item => item !== id);
        const newList = [id, ...filtered].slice(0, 10);
        return { recentlyViewed: newList };
      }),

      approveProduct: (id) => {
        get().updateProduct(id, { status: 'active' });
        get().addLog('APPROVE_AD', `Product ${id} approved.`);
      },
      
      rejectProduct: (id) => {
        get().updateProduct(id, { status: 'rejected' });
      },

      banUser: async (id) => {
        if (supabase) {
           await supabase.from('profiles').update({ is_banned: true }).eq('id', id);
        }
        set((state) => ({
          users: state.users.map(u => u.id === id ? { ...u, isBanned: true } : u),
          products: state.products.map(p => p.userId === id ? { ...p, status: 'rejected' } : p)
        }));
        get().addLog('BAN_USER', `User ${id} banned.`);
      },
      
      unbanUser: async (id) => {
        if (supabase) {
           await supabase.from('profiles').update({ is_banned: false }).eq('id', id);
        }
        set((state) => ({
          users: state.users.map(u => u.id === id ? { ...u, isBanned: false } : u)
        }));
      },

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
      
      // BLOG ACTIONS
      addBlogPost: (post) => set((state) => ({ blogPosts: [post, ...state.blogPosts] })),
      updateBlogPost: (id, data) => set((state) => ({
        blogPosts: state.blogPosts.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      deleteBlogPost: (id) => set((state) => ({ blogPosts: state.blogPosts.filter(p => p.id !== id) })),
      toggleBlogPostFeatured: (id) => set((state) => ({
        blogPosts: state.blogPosts.map(p => p.id === id ? { ...p, featured: !p.featured } : p)
      })),
      
      // SUPPORT TICKET ACTIONS
      addTicket: (ticket) => {
        set((state) => ({ tickets: [ticket, ...state.tickets] }));
        get().addLog('NEW_TICKET', `New support ticket created: ${ticket.id}`);
      },

      sendAdminEmail: (to, subject, body) => {
        get().addLog('EMAIL_SENT', `Email sent to ${to.length} recipients. Subject: ${subject}`);
      },

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
      name: 'musicplace-db-v17', 
      storage: createJSONStorage(() => localStorage),
      // We keep persist for settings and fallback data, but DB calls will override lists on fetch
      partialize: (state) => ({ 
        reports: state.reports,
        notifications: state.notifications,
        messages: state.messages,
        favorites: state.favorites,
        banners: state.banners,
        categories: state.categories,
        brands: state.brands,
        plans: state.plans,
        coupons: state.coupons,
        blogPosts: state.blogPosts,
        recentlyViewed: state.recentlyViewed,
        tickets: state.tickets,
        systemSettings: state.systemSettings,
        theme: state.theme,
        contentPages: state.contentPages,
        marketing: state.marketing,
        logs: state.logs,
        // We persist users/products as fallback, but fetchData overwrites them
        users: state.users,
        products: state.products
      }),
    }
  )
);
