
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Edit2, Trash2, Eye, CheckCircle, AlertCircle, Clock, ImageOff } from 'lucide-react';

export const MyAds: React.FC = () => {
  const { currentUser, products, deleteProduct, markAsSold } = useAppStore();
  
  if (!currentUser) return null;

  const myProducts = products.filter(p => p.userId === currentUser.id);

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este anúncio?')) {
      deleteProduct(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
         <div>
           <h1 className="text-2xl font-bold text-gray-900">Meus Anúncios</h1>
           <p className="text-gray-500">Gerencie suas vendas e listagens.</p>
         </div>
         <Link to="/anunciar" className="bg-brand-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-700 transition shadow-md text-sm">
            + Novo Anúncio
         </Link>
      </div>

      {myProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-500 mb-4">Você ainda não tem anúncios cadastrados.</p>
          <Link to="/anunciar" className="text-brand-600 font-bold hover:underline">Começar a vender agora</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myProducts.map(product => {
            const hasImages = Array.isArray(product.images) && product.images.length > 0;
            const displayImage = hasImages ? product.images[0] : null;

            return (
              <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center shadow-sm hover:shadow-md transition">
                 {displayImage ? (
                   <img 
                     src={displayImage} 
                     alt={product.title} 
                     className="w-full md:w-32 h-24 object-cover rounded-lg bg-gray-100" 
                   />
                 ) : (
                   <div className="w-full md:w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <ImageOff size={24} />
                   </div>
                 )}
                 
                 <div className="flex-1 w-full">
                    <div className="flex items-start justify-between mb-2">
                       <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{product.title}</h3>
                       <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1
                         ${product.status === 'active' ? 'bg-green-100 text-green-700' : 
                           product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                           product.status === 'sold' ? 'bg-gray-100 text-gray-600' :
                           'bg-red-100 text-red-700'}`}>
                          {product.status === 'active' && <CheckCircle size={12} />}
                          {product.status === 'pending' && <Clock size={12} />}
                          {product.status === 'rejected' && <AlertCircle size={12} />}
                          {product.status === 'active' ? 'Ativo' : product.status === 'pending' ? 'Em Análise' : product.status === 'sold' ? 'Vendido' : 'Rejeitado'}
                       </div>
                    </div>
                    <p className="text-brand-600 font-bold mb-1">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> Publicado em {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                 </div>

                 <div className="flex md:flex-col gap-2 w-full md:w-auto">
                    <Link to={`/produto/${product.id}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                       <Eye size={16} /> Ver
                    </Link>
                    
                    {product.status !== 'sold' && (
                      <>
                        <Link to={`/minha-conta/editar/${product.id}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-brand-700 hover:bg-brand-50 hover:border-brand-200">
                           <Edit2 size={16} /> Editar
                        </Link>
                        <button onClick={() => markAsSold(product.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-green-700 hover:bg-green-50 hover:border-green-200">
                           <CheckCircle size={16} /> Vendi!
                        </button>
                      </>
                    )}
                    
                    <button onClick={() => handleDelete(product.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-100 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                       <Trash2 size={16} /> Excluir
                    </button>
                 </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
