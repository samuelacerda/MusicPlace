
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { CATEGORIES, STATES } from '../../constants';
import { Condition, DeliveryMethod } from '../../types';
import { Save, ArrowLeft } from 'lucide-react';

export const EditAd: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, products, updateProduct } = useAppStore();
  
  const product = products.find(p => p.id === id);
  
  // Ensure user owns this product
  useEffect(() => {
    if (!currentUser || !product || product.userId !== currentUser.id) {
       navigate('/minha-conta/anuncios');
    }
  }, [currentUser, product, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    subcategory: '',
    condition: Condition.USADO,
    brand: '',
    model: '',
    year: '',
    state: '',
    city: '',
    description: '',
    delivery: DeliveryMethod.AMBOS,
    acceptsNegotiation: false,
    acceptsTrade: false,
  });

  useEffect(() => {
     if (product) {
        setFormData({
          title: product.title,
          price: product.price.toString(),
          category: product.category,
          subcategory: product.subcategory,
          condition: product.condition,
          brand: product.brand,
          model: product.model,
          year: product.year?.toString() || '',
          state: product.locationState,
          city: product.locationCity,
          description: product.description,
          delivery: product.delivery,
          acceptsNegotiation: product.acceptsNegotiation,
          acceptsTrade: product.acceptsTrade,
        });
     }
  }, [product]);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(product.id, {
       title: formData.title,
       price: parseFloat(formData.price),
       category: formData.category,
       subcategory: formData.subcategory,
       condition: formData.condition,
       brand: formData.brand,
       model: formData.model,
       year: formData.year ? parseInt(formData.year) : undefined,
       locationState: formData.state,
       locationCity: formData.city,
       description: formData.description,
       delivery: formData.delivery,
       acceptsNegotiation: formData.acceptsNegotiation,
       acceptsTrade: formData.acceptsTrade,
       status: 'pending' // Re-trigger approval if edited? Let's say yes for safety.
    });
    alert('Anúncio atualizado! Ele voltará para análise da moderação.');
    navigate('/minha-conta/anuncios');
  };

  return (
    <div className="max-w-3xl mx-auto">
       <button onClick={() => navigate('/minha-conta/anuncios')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft size={18} /> Voltar aos meus anúncios
       </button>

       <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Anúncio</h1>

       <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           {/* Basic Info */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                 <input 
                    type="number" 
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
               </div>
                <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Condição</label>
                 <select 
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value as Condition})}
                 >
                   {Object.values(Condition).map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
               <textarea 
                className="w-full border border-gray-300 rounded-lg p-3 h-32 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
               ></textarea>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                 <select 
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  required
                 >
                   <option value="">UF</option>
                   {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
             </div>
             <div className="col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                 <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                 />
             </div>
          </div>
          </div>

          <button type="submit" className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition flex items-center justify-center gap-2">
             <Save size={20} /> Salvar Alterações
          </button>
       </form>
    </div>
  );
}
