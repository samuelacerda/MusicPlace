
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, MessageCircle, ImageOff } from 'lucide-react';
import { Product } from '../types';
import { useAppStore } from '../store/useAppStore';

interface Props {
  product: Product;
}

export const ProductListCard: React.FC<Props> = ({ product }) => {
  const { favorites, toggleFavorite } = useAppStore();
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
      className="bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group relative flex flex-row rounded-lg h-40 md:h-48"
    >
      {/* Image Section */}
      <Link to={`/produto/${product.id}`} className="relative w-2/5 md:w-1/3">
        <div className="h-full w-full bg-gray-100 relative overflow-hidden flex items-center justify-center">
          {displayImage ? (
            <img 
              src={displayImage} 
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
               <ImageOff size={24} />
               <span className="text-[10px] mt-1">Sem Foto</span>
            </div>
          )}
          
          {product.featured && (
            <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Destaque
            </span>
          )}
        </div>
      </Link>

      {/* Info Section */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
           <div className="flex justify-between items-start">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-full mb-1 inline-block">
                 {product.condition}
               </span>
               <button 
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(product.id);
                }}
                className={`p-1.5 rounded-full transition-colors ${isFav ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-500 hover:bg-gray-50'}`}
              >
                <Heart size={16} fill={isFav ? "currentColor" : "none"} />
              </button>
           </div>
           
           <Link to={`/produto/${product.id}`}>
             <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight line-clamp-2 mb-1 hover:text-brand-600 transition-colors">
               {product.title}
             </h3>
           </Link>
           
           <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
              <MapPin size={10} /> {product.locationCity} - {product.locationState}
           </p>
        </div>

        <div className="flex items-end justify-between mt-auto">
           <p className="text-lg font-bold text-gray-900">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
          </p>
          
          <button 
            onClick={handleWhatsappClick}
            className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-sm hover:scale-105"
            title="Conversar no WhatsApp"
          >
             <MessageCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
