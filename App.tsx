
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { SearchPage } from './pages/Search';
import { ProductDetails } from './pages/ProductDetails';
import { PostAd } from './pages/PostAd';
import { Services } from './pages/Services';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { BlogList } from './pages/blog/BlogList';
import { BlogPostPage } from './pages/blog/BlogPost';
import { SupportPage } from './pages/Support';
import { ContactPage } from './pages/Contact';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdminSetup } from './pages/AdminSetup';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { useAppStore } from './store/useAppStore';
import { AuthListener } from './components/AuthListener'; // Import AuthListener

// Admin Imports
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminUsers } from './pages/admin/Users';
import { AdminListings } from './pages/admin/Listings';
import { AdminBanners } from './pages/admin/Banners';
import { AdminCategories } from './pages/admin/Categories';
import { AdminBrands } from './pages/admin/Brands';
import { AdminPlans } from './pages/admin/Plans';
import { AdminCoupons } from './pages/admin/Coupons';
import { AdminSettings } from './pages/admin/Settings';
import { AdminTheme } from './pages/admin/Theme';
import { AdminContent } from './pages/admin/Content';
import { AdminMarketing } from './pages/admin/Marketing';
import { AdminBlog } from './pages/admin/Blog';

// Account Imports
import { AccountLayout } from './pages/account/AccountLayout';
import { Profile } from './pages/account/Profile';
import { MyAds } from './pages/account/MyAds';
import { Favorites } from './pages/account/Favorites';
import { EditAd } from './pages/account/EditAd';

function App() {
  const { fetchData } = useAppStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <HashRouter>
      <AuthListener /> {/* Global Auth Event Listener */}
      <WhatsAppButton />
      <Routes>
        {/* Secret Admin Setup Route */}
        <Route path="/admin-setup" element={<AdminSetup />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
        <Route path="/admin/listings" element={<AdminLayout><AdminListings /></AdminLayout>} />
        <Route path="/admin/banners" element={<AdminLayout><AdminBanners /></AdminLayout>} />
        <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
        <Route path="/admin/brands" element={<AdminLayout><AdminBrands /></AdminLayout>} />
        <Route path="/admin/plans" element={<AdminLayout><AdminPlans /></AdminLayout>} />
        <Route path="/admin/coupons" element={<AdminLayout><AdminCoupons /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
        <Route path="/admin/theme" element={<AdminLayout><AdminTheme /></AdminLayout>} />
        <Route path="/admin/content" element={<AdminLayout><AdminContent /></AdminLayout>} />
        <Route path="/admin/marketing" element={<AdminLayout><AdminMarketing /></AdminLayout>} />
        <Route path="/admin/reports" element={<AdminLayout><div>Em breve</div></AdminLayout>} />
        <Route path="/admin/blog" element={<AdminLayout><AdminBlog /></AdminLayout>} />

        {/* Public Routes */}
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/busca" element={<SearchPage />} />
              <Route path="/produto/:id" element={<ProductDetails />} />
              <Route path="/anunciar" element={<PostAd />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/esqueci-senha" element={<ForgotPassword />} />
              <Route path="/redefinir-senha" element={<ResetPassword />} />
              <Route path="/suporte" element={<SupportPage />} />
              <Route path="/contato" element={<ContactPage />} />
              
              {/* Account Routes - Wrapped in AccountLayout */}
              <Route path="/minha-conta/perfil" element={<AccountLayout><Profile /></AccountLayout>} />
              <Route path="/minha-conta/anuncios" element={<AccountLayout><MyAds /></AccountLayout>} />
              <Route path="/minha-conta/editar/:id" element={<AccountLayout><EditAd /></AccountLayout>} />
              <Route path="/minha-conta/favoritos" element={<AccountLayout><Favorites /></AccountLayout>} />
              <Route path="/minha-conta/mensagens" element={<AccountLayout><div className="text-center py-10 text-gray-500">Nenhuma mensagem nova.</div></AccountLayout>} />
              <Route path="/minha-conta/notificacoes" element={<AccountLayout><div className="text-center py-10 text-gray-500">Nenhuma notificação nova.</div></AccountLayout>} />
              
            </Routes>
          </Layout>
        } />
      </Routes>
    </HashRouter>
  );
}

export default App;
