
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Megaphone, Save, MessageCircle, Bell } from 'lucide-react';

export const AdminMarketing: React.FC = () => {
  const { marketing, updateMarketing } = useAppStore();
  const [formData, setFormData] = useState(marketing);

  const handleSave = () => {
    updateMarketing(formData);
    alert('Configurações de marketing salvas!');
  };

  return (
    <div className="max-w-4xl">
       <div className="mb-8 flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">Ferramentas de Marketing</h1>
            <p className="text-gray-500">Pop-ups, Pixels e Notificações.</p>
         </div>
         <button onClick={handleSave} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700">
            <Save size={18} /> Salvar Tudo
         </button>
       </div>

       <div className="space-y-8">
          {/* Pop-up Manager */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Megaphone size={24} /></div>
                <h2 className="text-xl font-bold text-gray-900">Pop-up Promocional</h2>
             </div>
             
             <div className="flex items-center gap-4 mb-6">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.popupEnabled} onChange={(e) => setFormData({...formData, popupEnabled: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">Habilitar Pop-up na Home</span>
                </label>
             </div>

             <div className={`space-y-4 ${!formData.popupEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Texto do Pop-up</label>
                   <input type="text" value={formData.popupContent} onChange={(e) => setFormData({...formData, popupContent: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" placeholder="Ex: 10% OFF na primeira compra!" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Link do Botão (Opcional)</label>
                   <input type="text" value={formData.popupLink} onChange={(e) => setFormData({...formData, popupLink: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" placeholder="/cadastro" />
                </div>
             </div>
          </section>

          {/* Tracking */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><MessageCircle size={24} /></div>
                <h2 className="text-xl font-bold text-gray-900">Rastreamento e Analytics</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Meta Pixel ID (Facebook)</label>
                   <input type="text" value={formData.pixelId || ''} onChange={(e) => setFormData({...formData, pixelId: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" placeholder="1234567890" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Google Tag Manager ID</label>
                   <input type="text" value={formData.googleTagId || ''} onChange={(e) => setFormData({...formData, googleTagId: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" placeholder="GTM-XXXXXX" />
                </div>
             </div>
          </section>

          {/* Notifications */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Bell size={24} /></div>
                <h2 className="text-xl font-bold text-gray-900">Notificações</h2>
             </div>
             
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Número WhatsApp Oficial (Envio)</label>
                   <input type="text" value={formData.whatsappNumber || ''} onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" placeholder="5511999999999" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" checked={formData.pushEnabled} onChange={(e) => setFormData({...formData, pushEnabled: e.target.checked})} className="h-5 w-5 text-brand-600 rounded" />
                   <span className="text-sm font-medium text-gray-700">Habilitar Web Push Notifications (OneSignal)</span>
                </label>
             </div>
          </section>
       </div>
    </div>
  );
};
