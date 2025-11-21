
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Trash2, Edit2, CheckCircle, XCircle, Upload, AlertCircle, Clock } from 'lucide-react';
import { Banner } from '../../types';

export const AdminBanners: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner, systemSettings, updateSystemSettings } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: Banner = {
    id: '',
    title: '',
    description: '',
    desktopImage: '',
    mobileImage: '',
    buttonText: '',
    buttonLink: '',
    startDate: '',
    endDate: '',
    active: true,
    order: 0,
    isPrincipal: false
  };

  const [formData, setFormData] = useState<Banner>(initialFormState);

  const handleEdit = (banner: Banner) => {
    setFormData(banner);
    setEditingId(banner.id);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setFormData({ ...initialFormState, id: Date.now().toString(), order: banners.length + 1 });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateBanner(editingId, formData);
    } else {
      addBanner({ ...formData, id: Date.now().toString() });
    }
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      deleteBanner(id);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'desktopImage' | 'mobileImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isEditing) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{editingId ? 'Editar Banner' : 'Novo Banner'}</h1>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Cancelar</button>
        </div>
        <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-3xl">
          <div className="space-y-6">
            
            {/* Title & Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-brand-500 focus:border-brand-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea required className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-brand-500 focus:border-brand-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            {/* REQUIRED DIMENSIONS INFO */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <div className="flex items-start gap-3">
                 <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                 <div>
                    <h4 className="font-bold text-blue-900 text-sm uppercase mb-1">Dimensões Recomendadas</h4>
                    <p className="text-sm text-blue-800">Para garantir a qualidade do banner, utilize as seguintes medidas:</p>
                    <ul className="mt-2 space-y-1 text-sm font-mono text-blue-900 font-medium">
                      <li>• Desktop: 1920×600 px</li>
                      <li>• Tablet: 1200×500 px</li>
                      <li>• Mobile: 720×400 px</li>
                    </ul>
                 </div>
              </div>
            </div>

            {/* Image Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem Desktop (Upload)</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition text-center cursor-pointer group">
                   <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'desktopImage')} />
                   <div className="flex flex-col items-center">
                      {formData.desktopImage ? (
                        <img src={formData.desktopImage} alt="Preview" className="h-24 object-cover rounded mb-2" />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400 group-hover:text-brand-500 mb-2" />
                      )}
                      <span className="text-sm text-gray-500">Clique para enviar</span>
                   </div>
                </div>
                <input type="text" placeholder="Ou cole a URL da imagem" className="w-full mt-2 p-2 text-xs border border-gray-200 rounded bg-white text-gray-900" value={formData.desktopImage} onChange={e => setFormData({...formData, desktopImage: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem Mobile (Upload)</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition text-center cursor-pointer group">
                   <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'mobileImage')} />
                   <div className="flex flex-col items-center">
                      {formData.mobileImage ? (
                        <img src={formData.mobileImage} alt="Preview" className="h-24 object-cover rounded mb-2" />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400 group-hover:text-brand-500 mb-2" />
                      )}
                      <span className="text-sm text-gray-500">Clique para enviar</span>
                   </div>
                </div>
                <input type="text" placeholder="Ou cole a URL da imagem" className="w-full mt-2 p-2 text-xs border border-gray-200 rounded bg-white text-gray-900" value={formData.mobileImage} onChange={e => setFormData({...formData, mobileImage: e.target.value})} />
              </div>
            </div>

            {/* Buttons & Options */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto Botão</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.buttonText} onChange={e => setFormData({...formData, buttonText: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Botão</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.buttonLink} onChange={e => setFormData({...formData, buttonLink: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
                 <input type="number" className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
              </div>
              <div className="flex items-center mt-6">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isPrincipal} onChange={(e) => setFormData({...formData, isPrincipal: e.target.checked})} className="h-5 w-5 text-brand-600 rounded" />
                    <span className="font-medium text-gray-700">Definir como Principal?</span>
                 </label>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
              <div>
                 <label htmlFor="active-toggle" className="block text-sm font-bold text-gray-900">Status do Banner</label>
                 <p className="text-xs text-gray-500">Banners "Pausados" não aparecem na home.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, active: !formData.active})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${formData.active ? 'bg-brand-600' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.active ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
                <span className={`text-sm font-bold ${formData.active ? 'text-green-600' : 'text-red-500'}`}>{formData.active ? 'Ativo' : 'Pausado'}</span>
              </div>
            </div>

            <button type="submit" className="w-full bg-brand-600 text-white py-4 rounded-lg font-bold hover:bg-brand-700 shadow-lg">
              {editingId ? 'Atualizar Banner' : 'Criar Banner'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Gerenciar Banners</h1>
           <p className="text-gray-500">Controle o carrossel da página inicial.</p>
        </div>
        <button onClick={handleCreate} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700">
          <Plus size={18} /> Novo Banner
        </button>
      </div>
      
      {/* TIMER CONTROL */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
              <Clock size={20} />
            </div>
            <div>
               <h3 className="font-bold text-gray-900">Timer do Carrossel</h3>
               <p className="text-xs text-gray-500">Segundos entre cada slide.</p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <input 
              type="number" 
              min="2"
              max="60"
              value={systemSettings.bannerRotationInterval || 5} 
              onChange={(e) => updateSystemSettings({ bannerRotationInterval: parseInt(e.target.value) })}
              className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold bg-white text-gray-900"
            />
            <span className="text-sm font-medium text-gray-600">seg</span>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {banners.sort((a, b) => a.order - b.order).map(banner => (
          <div key={banner.id} className={`bg-white rounded-xl border ${banner.active ? 'border-gray-200' : 'border-red-100 bg-red-50'} shadow-sm overflow-hidden flex flex-col md:flex-row`}>
             <div className="w-full md:w-64 h-40 bg-gray-100 relative group">
               <img src={banner.desktopImage} alt={banner.title} className="w-full h-full object-cover" />
               {!banner.active && (
                 <div className="absolute inset-0 flex items-center justify-center font-bold backdrop-blur-sm bg-white/60 text-red-600">
                   PAUSADO
                 </div>
               )}
             </div>
             <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-gray-900">{banner.title}</h3>
                      {banner.isPrincipal && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-bold">Principal</span>}
                   </div>
                   <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">Ordem: {banner.order}</span>
                </div>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">{banner.description}</p>
                
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
                   <button onClick={() => handleEdit(banner)} className="text-brand-600 font-bold text-sm flex items-center gap-1 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition">
                     <Edit2 size={16} /> Editar
                   </button>
                   <button onClick={() => updateBanner(banner.id, { active: !banner.active })} className={`font-bold text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${banner.active ? 'text-gray-500 hover:text-gray-900' : 'text-green-600'}`}>
                     {banner.active ? 'Pausar' : 'Ativar'}
                   </button>
                   <button onClick={() => handleDelete(banner.id)} className="text-red-600 font-bold text-sm flex items-center gap-1 ml-auto hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
                     <Trash2 size={16} /> Excluir
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
