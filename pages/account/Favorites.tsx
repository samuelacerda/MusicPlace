
import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ProductCard } from '../../components/ProductCard';
import { Link } from 'react-router-dom';

export const Favorites: React.FC = () => {
  const { favorites, products } = useAppStore();
  
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div>
       <div className="mb-8">
         <h1 className="text-2xl font-bold text-gray-900">Meus Favoritos</h1>
         <p className="text-gray-500">Itens que você está de olho.</p>
      </div>

      {favoriteProducts.length === 0 ? (
         <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Sua lista de favoritos está vazia.</p>
            <Link to="/busca" className="text-brand-600 font-bold hover:underline">Explorar catálogo</Link>
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {favoriteProducts.map(product => (
             <ProductCard key={product.id} product={product} />
           ))}
        </div>
      )}
    </div>
  );
};
