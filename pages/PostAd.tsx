
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, AlertTriangle, User, Phone, X, Star } from 'lucide-react';
import { STATES } from '../constants';
import { Condition, DeliveryMethod, ProductStatus } from '../types';
import { useAppStore } from '../store/useAppStore';

export const PostAd: React.FC = () => {
  const navigate = useNavigate();
  const { addProduct, currentUser, categories, brands } = useAppStore();
  
  // Filter active
  const activeCategories = categories.filter(c => c.active);
  const activeBrands = brands.filter(b => b.active);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const [formData, setFormData] = useState({
    brand: '',
    category: '',
    subcategory: '',
    model: '',
    year: '',
    title: '',
    price: '', // Will store the formatted string "1.000,00"
    condition: Condition.USADO,
    state: currentUser?.state || '',
    city: currentUser?.city || '',
    description: '',
    delivery: DeliveryMethod.AMBOS,
    acceptsNegotiation: false,
    acceptsTrade: false,
  });

  const [customBrand, setCustomBrand] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // --- INTELLIGENT CATEGORY FILTERING ---
  const filteredCategories = useMemo(() => {
    // If "Outros", allow all categories or if no brand selected
    if (!formData.brand || formData.brand === 'Outros') return activeCategories;

    // Find the selected brand object to get its description/instruments
    const selectedBrandObj = activeBrands.find(b => b.name.toLowerCase() === formData.brand.toLowerCase());
    
    // If brand not found or has no description, show all categories
    if (!selectedBrandObj || !selectedBrandObj.description) return activeCategories;

    const desc = selectedBrandObj.description.toLowerCase();

    // Filter categories based on keywords found in brand description
    const relevant = activeCategories.filter(cat => {
      const catName = cat.name.toLowerCase();
      
      // Map complex category names to simple keywords present in brand descriptions
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

      // Fallback: check if category name is directly in description
      return desc.includes(catName.split(' ')[0]); 
    });

    return relevant.length > 0 ? relevant : activeCategories;
  }, [formData.brand, activeCategories, activeBrands]);

  // Dynamic subcategories based on selected category
  const selectedCategoryObj = activeCategories.find(c => c.name === formData.category);
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
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Price Formatting Logic
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove everything that is not a digit
    value = value.replace(/\D/g, "");

    if (value === "") {
      setFormData({ ...formData, price: "" });
      return;
    }

    // Convert to float (divide by 100 for cents)
    const amount = parseFloat(value) / 100;

    // Format to PT-BR currency string
    const formatted = amount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    setFormData({ ...formData, price: formatted });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (previewImages.length < 3) {
      alert("Por favor, adicione pelo menos 3 fotos do seu produto para aumentar a confiança dos compradores.");
      return;
    }

    const finalBrand = formData.brand === 'Outros' ? customBrand : formData.brand;

    if (!finalBrand) {
        alert("Por favor, informe a marca do produto.");
        return;
    }

    // Parse price string "1.234,56" back to float 1234.56
    const priceFloat = parseFloat(formData.price.replace(/\./g, '').replace(',', '.'));

    const newProduct = {
      id: Date.now().toString(),
      userId: currentUser.id,
      title: formData.title,
      price: priceFloat || 0,
      images: previewImages,
      category: formData.category,
      subcategory: formData.subcategory || 'Geral',
      condition: formData.condition,
      locationState: formData.state,
      locationCity: formData.city,
      description: formData.description,
      delivery: formData.delivery,
      sellerName: currentUser.name,
      sellerRating: 0,
      createdAt: new Date().toISOString(),
      status: 'pending' as ProductStatus,
      whatsapp: currentUser.phone,
      brand: finalBrand,
      model: formData.model,
      year: formData.year ? parseInt(formData.year) : undefined,
      acceptsNegotiation: formData.acceptsNegotiation,
      acceptsTrade: formData.acceptsTrade
    };
    addProduct(newProduct);
    alert("Anúncio enviado para análise! Você será notificado quando for aprovado.");
    navigate('/minha-conta/anuncios');
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">O que você vai vender hoje?</h1>
        <p className="text-gray-500 mb-8">Preencha os dados na ordem abaixo para criar seu anúncio.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. MARCA */}
          <div>
             <label className="block text-sm font-bold text-gray-900 mb-1">1. Marca</label>
             <select
              className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none mb-2"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value, category: ''})} // Reset category when brand changes
              required
             >
                 <option value="">Selecione a Marca</option>
                 {activeBrands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
             </select>

             {formData.brand === 'Outros' && (
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2 animate-fadeIn">
                     <label className="block text-xs font-bold text-gray-700 mb-1">Nome da Marca (Personalizado)</label>
                     <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                        placeholder="Digite o nome da marca..."
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        required
                     />
                     <p className="text-xs text-gray-500 mt-1">Informe o nome correto e completo da marca.</p>
                 </div>
             )}
             
             <p className="text-xs text-gray-500 mt-1">Ao selecionar a marca, as categorias sugeridas serão atualizadas.</p>
          </div>

          {/* 2. CATEGORIA & SUBCATEGORIA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-bold text-gray-900 mb-1">2. Categoria</label>
               <select 
                className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value, subcategory: ''})}
                required
               >
                 <option value="">Selecione a Categoria</option>
                 {filteredCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-900 mb-1">3. Subcategoria</label>
               <select 
                 className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none disabled:bg-gray-100"
                 value={formData.subcategory}
                 onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                 disabled={!formData.category}
               >
                  <option value="">Selecione ou Digite (na busca)</option>
                  {availableSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
               </select>
            </div>
          </div>

          {/* 3. MODELO & ANO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-bold text-gray-900 mb-1">4. Modelo</label>
                 <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="Ex: Stratocaster Standard, DX7, SM58..."
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  required
                 />
              </div>
               <div>
                 <label className="block text-sm font-bold text-gray-900 mb-1">5. Ano (Opcional)</label>
                 <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="Ex: 2010"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                 />
              </div>
          </div>

          {/* 4. TÍTULO */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">6. Título do Anúncio</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Ex: Guitarra Fender Stratocaster Mexicana Sunburst 2010"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Seja específico! Marca + Modelo + Cor + Ano geralmente funciona bem.</p>
          </div>

          {/* 5. FOTOS */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
               <label className="block text-sm font-bold text-gray-900">7. Fotos do Produto (Min: 3 | Max: 10)</label>
               <span className={`text-xs font-medium ${previewImages.length < 3 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                   {previewImages.length}/10 fotos
               </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {/* Botão de Adicionar */}
               {previewImages.length < 10 && (
                 <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-brand-500 hover:bg-brand-50 transition cursor-pointer overflow-hidden group bg-white">
                    <Camera className="h-8 w-8 text-gray-400 group-hover:text-brand-500" />
                    <span className="text-xs text-gray-400 mt-1 text-center px-2">Adicionar Fotos</span>
                    <input 
                      type="file" 
                      multiple 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleImageChange} 
                      accept="image/*" 
                    />
                 </div>
               )}

               {/* Lista de Fotos */}
               {previewImages.map((img, index) => (
                 <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={img} className="w-full h-full object-cover" alt={`Foto ${index + 1}`} />
                    
                    {/* Botão Remover */}
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-full shadow-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition"
                    >
                       <X size={14} />
                    </button>

                    {/* Badge Capa */}
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-brand-500/90 text-white text-[10px] font-bold text-center py-1 uppercase">
                        Foto de Capa
                      </div>
                    )}
                 </div>
               ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Dica: A primeira foto será a capa do seu anúncio. Capriche na iluminação!
            </p>
            {previewImages.length > 0 && previewImages.length < 3 && (
               <p className="text-sm text-red-600 flex items-center gap-1 font-medium animate-pulse">
                 <AlertTriangle size={14} /> Adicione mais {3 - previewImages.length} foto(s) para continuar.
               </p>
            )}
          </div>

          {/* 6. CONDIÇÃO */}
          <div>
             <label className="block text-sm font-bold text-gray-900 mb-1">8. Condição</label>
             <select 
              className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value as Condition})}
             >
               {Object.values(Condition).map(c => <option key={c} value={c}>{c}</option>)}
             </select>
          </div>

          {/* 7. DESCRIÇÃO */}
          <div>
             <div className="flex justify-between items-center mb-1">
               <label className="block text-sm font-bold text-gray-900">9. Descrição</label>
             </div>
             <textarea 
              className="w-full border border-gray-300 rounded-lg p-3 h-40 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Conte a história do instrumento, modificações, estado dos trastes, elétrica, etc..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
             ></textarea>
          </div>

          {/* 8. PREÇO E OPÇÕES */}
          <div>
             <label className="block text-sm font-bold text-gray-900 mb-1">10. Preço (R$)</label>
             <div className="relative">
               <input 
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 pl-3 bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none text-lg font-semibold"
                placeholder="0,00"
                value={formData.price}
                onChange={handlePriceChange}
                required
              />
             </div>
             {/* Negotiation Toggles */}
             <div className="flex gap-6 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
               <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                 <input 
                  type="checkbox" 
                  className="rounded text-brand-600 focus:ring-brand-500 bg-white h-5 w-5"
                  checked={formData.acceptsNegotiation}
                  onChange={(e) => setFormData({...formData, acceptsNegotiation: e.target.checked})}
                 />
                 <span className="font-medium">Aceito Ofertas</span>
               </label>
               <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                 <input 
                  type="checkbox" 
                  className="rounded text-brand-600 focus:ring-brand-500 bg-white h-5 w-5"
                  checked={formData.acceptsTrade}
                  onChange={(e) => setFormData({...formData, acceptsTrade: e.target.checked})}
                 />
                 <span className="font-medium">Aceito Trocas</span>
               </label>
             </div>
          </div>

          {/* 9. LOCALIZAÇÃO */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-100">
             <div>
                 <label className="block text-sm font-bold text-gray-900 mb-1">11. Estado</label>
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
                 <label className="block text-sm font-bold text-gray-900 mb-1">12. Cidade</label>
                 <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 outline-none"
                  placeholder="Ex: São Paulo"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                 />
             </div>
          </div>

          {/* UNIFIED CONTACT FIELDS (READ ONLY) */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
             <div className="flex items-start gap-3 mb-4">
               <AlertTriangle className="text-blue-600 shrink-0 mt-1" size={20} />
               <div>
                 <h3 className="font-bold text-blue-900">Dados de Contato</h3>
                 <p className="text-sm text-blue-700">
                   Estes dados serão exibidos no anúncio.
                   Para alterar, <Link to="/minha-conta/perfil" className="underline font-bold">edite seu perfil</Link>.
                 </p>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="relative">
                 <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Vendedor</label>
                 <div className="flex items-center w-full border border-blue-200 bg-white/50 rounded-lg p-3 text-gray-600 cursor-not-allowed">
                    <User size={18} className="mr-2 text-blue-400" />
                    {currentUser.name}
                 </div>
               </div>
               <div className="relative">
                 <label className="block text-xs font-bold text-blue-800 uppercase mb-1">WhatsApp</label>
                 <div className="flex items-center w-full border border-blue-200 bg-white/50 rounded-lg p-3 text-gray-600 cursor-not-allowed">
                    <Phone size={18} className="mr-2 text-blue-400" />
                    {currentUser.phone}
                 </div>
               </div>
             </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={previewImages.length < 3}
              className={`w-full text-white text-lg font-bold py-4 rounded-xl transition shadow-lg ${previewImages.length < 3 ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/20'}`}
            >
              {previewImages.length < 3 ? `Adicione mais ${3 - previewImages.length} foto(s)` : 'Publicar Anúncio'}
            </button>
             <p className="text-center text-sm text-gray-500 mt-4">
              Ao publicar, você concorda com os Termos de Uso do MusicPlace.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};
