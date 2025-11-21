
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Share2, Heart, MessageCircle, ShieldCheck, Truck, Star, CheckCircle, RefreshCcw, DollarSign, ArrowLeft, Calendar } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { DeliveryMethod } from '../types';

export const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, currentUser, toggleFavorite, favorites, theme } = useAppStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = products.find(p => p.id === id);
  const isFav = product ? favorites.includes(product.id) : false;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Produto não encontrado</h2>
        <p className="text-gray-500 mb-6">Este anúncio pode ter sido removido ou não existe.</p>
        <button 
          onClick={() => navigate('/busca')}
          className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition"
        >
          Voltar para a Loja
        </button>
      </div>
    );
  }

  const handleWhatsappClick = () => {
    const message = `Olá! Vi seu anúncio "${product.title}" no MusicPlace e gostaria de saber mais.`;
    const url = `https://wa.me/55${product.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Confira este instrumento no MusicPlace: ${product.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error('Share API not supported');
      }
    } catch (err) {
      // Fallback to clipboard if share fails (e.g. invalid URL, user cancel, or not supported)
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-600 hover:text-brand-600 font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Images */}
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 relative group">
            <img 
              src={product.images[activeImageIndex]} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
               <button 
                onClick={handleShare}
                className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-gray-700 hover:text-brand-600 transition"
                title="Compartilhar"
               >
                 <Share2 size={20} />
               </button>
               <button 
                onClick={() => toggleFavorite(product.id)}
                className={`p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition ${isFav ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}`}
                title="Favoritar"
               >
                 <Heart size={20} fill={isFav ? "currentColor" : "none"} />
               </button>
            </div>
            {product.featured && (
               <span className="absolute top-4 left-4 bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                 DESTAQUE
               </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${activeImageIndex === idx ? 'border-brand-600 ring-1 ring-brand-600' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Safety Card */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
             <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={20} />
             <div>
               <h3 className="font-bold text-blue-900 text-sm">Compra Segura</h3>
               <p className="text-sm text-blue-700 mt-1">
                 Nunca faça pagamentos antecipados fora da plataforma. Prefira encontrar-se em locais públicos para testar o instrumento.
               </p>
             </div>
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="flex flex-col">
           <div className="mb-6">
             <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
               <span>{product.category}</span>
               <span>•</span>
               <span>{product.subcategory}</span>
               <span>•</span>
               <span>{product.condition}</span>
             </div>
             <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.title}</h1>
             <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin size={16} /> {product.locationCity} - {product.locationState}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} /> Anunciado em {new Date(product.createdAt).toLocaleDateString()}
                </div>
             </div>
           </div>

           <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
              <p className="text-4xl font-bold text-brand-600 mb-4">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                 {product.acceptsNegotiation && (
                   <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <DollarSign size={12} /> Aceita Ofertas
                   </span>
                 )}
                 {product.acceptsTrade && (
                   <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <RefreshCcw size={12} /> Aceita Trocas
                   </span>
                 )}
                 {product.delivery !== DeliveryMethod.RETIRADA && (
                   <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Truck size={12} /> Envia para todo Brasil
                   </span>
                 )}
              </div>

              <div className="flex gap-3">
                 <button 
                   onClick={handleWhatsappClick}
                   className="flex-1 bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                 >
                    <MessageCircle size={20} />
                    Conversar no WhatsApp
                 </button>
              </div>
           </div>

           {/* Description */}
           <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Descrição do Produto</h3>
              <div className="prose prose-blue text-gray-600 whitespace-pre-line leading-relaxed">
                {product.description}
              </div>
           </div>

           {/* Technical Details */}
           <div className="mb-8 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Detalhes Técnicos</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="block text-xs text-gray-500 uppercase font-bold">Marca</span>
                    <span className="font-medium text-gray-900">{product.brand}</span>
                 </div>
                 <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="block text-xs text-gray-500 uppercase font-bold">Modelo</span>
                    <span className="font-medium text-gray-900">{product.model}</span>
                 </div>
                 {product.year && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                       <span className="block text-xs text-gray-500 uppercase font-bold">Ano</span>
                       <span className="font-medium text-gray-900">{product.year}</span>
                    </div>
                 )}
                 <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="block text-xs text-gray-500 uppercase font-bold">Condição</span>
                    <span className="font-medium text-gray-900">{product.condition}</span>
                 </div>
              </div>
           </div>

           {/* Seller Info */}
           <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sobre o Vendedor</h3>
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
                    {product.sellerName.charAt(0)}
                 </div>
                 <div>
                    <p className="font-bold text-gray-900 text-lg">{product.sellerName}</p>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                       <Star size={14} fill="currentColor" />
                       <span>{product.sellerRating || 'Novo Vendedor'}</span>
                       <span className="text-gray-400 mx-1">•</span>
                       <span className="text-gray-500 font-normal">Membro desde {new Date(product.createdAt).getFullYear()}</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};
