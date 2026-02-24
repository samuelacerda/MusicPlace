
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Check, X, ExternalLink, Plus, Camera, Trash2, AlertCircle, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, Condition, DeliveryMethod } from '../../types';
import { STATES } from '../../constants';

export const AdminListings: React.FC = () => {
  const { products, users, approveProduct, rejectProduct, addProduct, categories, brands } = useAppStore();
  const pendingProducts = products.filter(p => p.status === 'pending');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create Ad Form State
  const initialFormState = {
    userId: '',
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
    acceptsTrade: false
  };

  const [newAd, setNewAd] = useState(initialFormState);
  const [customBrand, setCustomBrand] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // --- INTELLIGENT CATEGORY FILTERING ---
  const activeCategories = categories.filter(c => c.active);
  const activeBrands = brands.filter(b => b.active);

  const filteredCategories = useMemo(() => {
    if (!newAd.brand || newAd.brand === 'Outros') return activeCategories;

    const selectedBrandObj = activeBrands.find(b => (b.name || '').toLowerCase() === (newAd.brand || '').toLowerCase());
    if (!selectedBrandObj || !selectedBrandObj.description) return activeCategories;

    const desc = (selectedBrandObj.description || '').toLowerCase();

    const relevant = activeCategories.filter(cat => {
      const catName = (cat.name || '').toLowerCase();
      if (cat.id === 'guitarras' && (desc.includes('guitarra') || desc.includes('violão'))) return true;
      if (cat.id === 'baixos' && desc.includes('baixo')) return true;
      if (cat.id === 'violoes' && (desc.includes('violão') || desc.includes('violao'))) return true;
      if (cat.id === 'amplificadores' && (desc.includes('amplificador') || desc.includes('gabinete'))) return true;
      if (cat.id === 'pedais-efeitos' && (desc.includes('pedal') || desc.includes('efeito') || desc.includes('pedaleira'))) return true;
      if (cat.id === 'bateria-percussao' && (desc.includes('bateria') || desc.includes('percussão') || desc.includes('prato'))) return true;
      if (cat.id === 'teclados-pianos' && (desc.includes('teclado') || desc.includes('piano') || desc.includes('sintetizador'))) return true;
      if (cat.id === 'audio-pro' && (desc.includes('audio') || desc.includes('microfone') || desc.includes('interface') || desc.includes('monitor'))) return true;
      if (cat.id === 'sopro-orquestra' && (desc.includes('sax') || desc.includes('flauta') || desc.includes('violino'))) return true;
      if (cat.id === 'acessorios' && (desc.includes('corda') || desc.includes('capa') || desc.includes('acessório'))) return true;
      return desc.includes(catName.split(' ')[0]); 
    });

    return relevant.length > 0 ? relevant : activeCategories;
  }, [newAd.brand, activeCategories, activeBrands]);

  const selectedCategoryObj = activeCategories.find(c => c.name === newAd.category);
  const availableSubcategories = selectedCategoryObj ? selectedCategoryObj.subcategories : [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 10 - previewImages.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setPreviewImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateAd = (e: React.FormEvent) => {
     e.preventDefault();
     const seller = users.find(u => u.id === newAd.userId);
     if (!seller) return;

     if (previewImages.length < 3) {
         alert("É necessário enviar pelo menos 3 fotos.");
         return;
     }

     const finalBrand = newAd.brand === 'Outros' ? customBrand : newAd.brand;

     if (!finalBrand) {
        alert("Por favor, informe a marca do produto.");
        return;
     }

     const product: Product = {
        id: Date.now().toString(),
        userId: seller.id,
        title: newAd.title,
        price: parseFloat(newAd.price),
        images: previewImages,
        category: newAd.category,
        subcategory: newAd.subcategory || 'Geral',
        condition: newAd.condition,
        brand: finalBrand,
        model: newAd.model,
        year: newAd.year ? parseInt(newAd.year) : undefined,
        locationState: newAd.state,
        locationCity: newAd.city,
        description: newAd.description,
        delivery: newAd.delivery,
        sellerName: seller.name,
        whatsapp: seller.phone,
        sellerRating: 0,
        createdAt: new Date().toISOString(),
        status: 'active',
        acceptsNegotiation: newAd.acceptsNegotiation,
        acceptsTrade: newAd.acceptsTrade,
     };

     addProduct(product);
     setIsModalOpen(false);
     setNewAd(initialFormState);
     setPreviewImages([]);
     setCustomBrand('');
     alert('Anúncio criado e publicado com sucesso!');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold text-gray-900">Moderação de Anúncios</h1>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700 shadow-sm"
         >
           <Plus size={18} /> Criar Anúncio
         </button>
      </div>

      {/* Create Ad Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 flex flex-col max-h-[90vh]">
               <div className="flex justify-between items-center p-6 border-b border-gray-100">
                  <h3 className="font-bold text-xl text-gray-900">Criar Anúncio para Usuário</h3>
                  <button onClick={() => setIsModalOpen(false)}><X /></button>
               </div>
               
               <div className="overflow-y-auto p-8">
                <form onSubmit={handleCreateAd} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Selecione o Vendedor (Usuário)</label>
                        <select required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={newAd.userId} onChange={e => setNewAd({...newAd, userId: e.target.value})}>
                            <option value="">Selecione...</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                        </select>
                    </div>

                    {/* IMAGES SECTION */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-bold text-gray-900">Fotos do Produto (Min: 3 | Max: 10)</label>
                            <span className={`text-xs font-medium ${previewImages.length < 3 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                                {previewImages.length}/10 fotos
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {previewImages.length < 10 && (
                                <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-brand-500 hover:bg-brand-50 transition cursor-pointer overflow-hidden group bg-white">
                                    <Camera className="h-8 w-8 text-gray-400 group-hover:text-brand-500" />
                                    <span className="text-xs text-gray-400 mt-1 text-center px-1">Adicionar</span>
                                    <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
                                </div>
                            )}

                            {previewImages.map((img, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                                    <img src={img} className="w-full h-full object-cover" alt={`Preview ${index}`} />
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    {index === 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-brand-500/90 text-white text-[10px] font-bold text-center py-1 uppercase">Capa</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {previewImages.length < 3 && (
                             <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                                <AlertCircle size={12} /> Faltam {3 - previewImages.length} fotos.
                             </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                            <select 
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" 
                                value={newAd.brand} 
                                onChange={e => setNewAd({...newAd, brand: e.target.value, category: ''})} 
                            >
                                <option value="">Selecione a Marca</option>
                                {activeBrands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                            </select>
                            
                            {newAd.brand === 'Outros' && (
                                <input 
                                    type="text" 
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg bg-white text-gray-900" 
                                    placeholder="Digite o nome da marca..."
                                    value={customBrand}
                                    onChange={e => setCustomBrand(e.target.value)}
                                    required
                                />
                            )}
                        </div>
                        <div className="col-span-2">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <select required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={newAd.category} onChange={e => setNewAd({...newAd, category: e.target.value, subcategory: ''})}>
                                <option value="">Selecione</option>
                                {filteredCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoria</label>
                            <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 disabled:bg-gray-100" value={newAd.subcategory} onChange={e => setNewAd({...newAd, subcategory: e.target.value})} disabled={!newAd.category}>
                                <option value="">Selecione ou Digite</option>
                                {availableSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Condição</label>
                            <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={newAd.condition} onChange={e => setNewAd({...newAd, condition: e.target.value as any})}>
                            {Object.values(Condition).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                            <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={newAd.title} onChange={e => setNewAd({...newAd, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <input type="number" required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={newAd.price} onChange={e => setNewAd({...newAd, price: e.target.value})} />
                        </div>
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={newAd.model} onChange={e => setNewAd({...newAd, model: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                            <input type="number" className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={newAd.year} onChange={e => setNewAd({...newAd, year: e.target.value})} />
                        </div>
                     </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                            <div className="flex gap-2">
                                <select className="w-20 p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={newAd.state} onChange={e => setNewAd({...newAd, state: e.target.value})}>
                                <option value="">UF</option>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <input type="text" placeholder="Cidade" className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={newAd.city} onChange={e => setNewAd({...newAd, city: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Entrega</label>
                            <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={newAd.delivery} onChange={e => setNewAd({...newAd, delivery: e.target.value as any})}>
                                {Object.values(DeliveryMethod).map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea required className="w-full p-3 border border-gray-300 rounded-lg h-32 bg-white text-gray-900" value={newAd.description} onChange={e => setNewAd({...newAd, description: e.target.value})}></textarea>
                    </div>

                    <div className="flex gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input 
                            type="checkbox" 
                            className="rounded text-brand-600 focus:ring-brand-500 bg-white h-5 w-5"
                            checked={newAd.acceptsNegotiation}
                            onChange={(e) => setNewAd({...newAd, acceptsNegotiation: e.target.checked})}
                            />
                            <span className="font-medium">Aceito Ofertas</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input 
                            type="checkbox" 
                            className="rounded text-brand-600 focus:ring-brand-500 bg-white h-5 w-5"
                            checked={newAd.acceptsTrade}
                            onChange={(e) => setNewAd({...newAd, acceptsTrade: e.target.checked})}
                            />
                            <span className="font-medium">Aceito Trocas</span>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={previewImages.length < 3}
                        className={`w-full text-white font-bold py-4 rounded-lg transition ${previewImages.length < 3 ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}
                    >
                        {previewImages.length < 3 ? `Adicione mais ${3 - previewImages.length} fotos` : 'Publicar Anúncio'}
                    </button>
                </form>
               </div>
            </div>
         </div>
      )}

      {pendingProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
           <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <Check size={32} />
           </div>
           <h3 className="text-xl font-bold text-gray-900">Tudo Limpo!</h3>
           <p className="text-gray-500 mt-2">Não há anúncios pendentes de aprovação no momento.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingProducts.map(product => {
            const hasImages = Array.isArray(product.images) && product.images.length > 0;
            const displayImage = hasImages ? product.images[0] : null;

            return (
              <div key={product.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6">
                 {displayImage ? (
                   <img src={displayImage} alt={product.title} className="w-full md:w-48 h-32 object-cover rounded-lg" />
                 ) : (
                   <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <ImageOff size={32} />
                   </div>
                 )}
                 
                 <div className="flex-1">
                    <div className="flex justify-between items-start">
                       <div>
                         <h3 className="font-bold text-lg text-gray-900">{product.title}</h3>
                         <p className="text-gray-500 text-sm mb-2">Vendedor: {product.sellerName}</p>
                         <p className="text-brand-600 font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}</p>
                       </div>
                       <Link to={`/produto/${product.id}`} target="_blank" className="text-gray-400 hover:text-brand-600">
                         <ExternalLink size={20} />
                       </Link>
                    </div>
                    <p className="text-gray-600 text-sm mt-3 line-clamp-2">{product.description}</p>
                    <div className="mt-4 flex gap-4">
                       <button 
                         onClick={() => approveProduct(product.id)}
                         className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition"
                       >
                         <Check size={16} /> Aprovar
                       </button>
                       <button 
                         onClick={() => rejectProduct(product.id)}
                         className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold text-sm hover:bg-red-200 transition"
                       >
                         <X size={16} /> Rejeitar
                       </button>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
