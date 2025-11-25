
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Truck, RefreshCcw, MessageCircle, ImageOff } from 'lucide-react';
import { Product, DeliveryMethod } from '../types';
import { useAppStore } from '../store/useAppStore';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { favorites, toggleFavorite, theme } = useAppStore();
  const isFav = favorites.includes(product.id);

  const handleWhatsappClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Olá! Vi seu anúncio "${product.title}" no MusicPlace e gostaria de saber mais.`;
    const url = `https://wa.me/55${product.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const hasImages = Array.isArray(product.images) && product.images.length > 0;
  const displayImage = hasImages ? product.images[0] : null;

  return (
    <div 
      className="bg-white border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group relative h-full flex flex-col rounded-xl"
    >
      <Link to={`/produto/${product.id}`} className="relative">
        <div className="aspect-[4/3] overflow-hidden relative bg-gray-100 flex items-center justify-center">
          {displayImage ? (
            <img 
              src={displayImage} 
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
               <ImageOff size={32} />
               <span className="text-xs mt-1">Sem Foto</span>
            </div>
          )}
          
          {product.featured && (
            <span className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded-md uppercase shadow-sm" style={{ backgroundColor: theme.primaryColor }}>
              Destaque
            </span>
          )}
          {product.acceptsTrade && (
            <span className="absolute top-2 left-auto right-2 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md uppercase shadow-sm flex items-center gap-1">
              <RefreshCcw size={10} /> Trocas
            </span>
          )}
          
          {/* WhatsApp Button (Floating) */}
          <button 
            onClick={handleWhatsappClick}
            className="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-20 hover:bg-green-700"
            title="Conversar no WhatsApp"
          >
             <MessageCircle size={18} />
          </button>

          {product.delivery !== DeliveryMethod.RETIRADA && (
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm p-1.5 rounded-full text-white shadow-sm" title="Envia para todo Brasil">
               <Truck size={14} />
            </div>
          )}
        </div>
      </Link>

      <button 
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(product.id);
        }}
        className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors z-10 ${isFav ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}
        style={{ top: '0.5rem', right: '0.5rem' }}
      >
        <Heart size={18} fill={isFav ? "currentColor" : "none"} />
      </button>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-1">
           <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
             {product.condition}
           </span>
        </div>
        <Link to={`/produto/${product.id}`} className="flex-grow">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 h-10 group-hover:text-brand-600 transition-colors" style={{ '--hover-text': theme.primaryColor } as React.CSSProperties}>
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto">
           <p className="text-lg font-bold text-gray-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin size={12} />
              {product.locationCity} - {product.locationState}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
