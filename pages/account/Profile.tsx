
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Save, AlertTriangle, Lock } from 'lucide-react';
import { STATES } from '../../constants';

export const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useAppStore();
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    state: currentUser?.state || '',
    city: currentUser?.city || '',
  });

  const [passData, setPassData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(currentUser.id, formData);
    setSuccessMsg('Perfil atualizado com sucesso! Seus anúncios foram sincronizados.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleChangePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      alert('As senhas não coincidem.');
      return;
    }
    alert('Senha alterada com sucesso! (Simulação)');
    setPassData({ current: '', new: '', confirm: '' });
  };

  return (
    <div>
      <div className="mb-8">
         <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
         <p className="text-gray-500">Gerencie suas informações pessoais e de contato.</p>
      </div>

      {successMsg && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200 flex items-center gap-2">
           <Save size={18} />
           {successMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
         {/* Contact Info */}
         <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3 mb-4">
               <AlertTriangle className="text-blue-600 shrink-0 mt-1" size={20} />
               <div>
                 <h3 className="font-bold text-blue-900">Dados de Contato Unificados</h3>
                 <p className="text-sm text-blue-700 mt-1">
                   O nome e WhatsApp definidos aqui serão usados automaticamente em <strong>todos os seus anúncios</strong>. 
                   Isso garante que compradores sempre tenham seu contato atualizado.
                 </p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Exibição</label>
                 <input 
                   type="text" 
                   value={formData.name} 
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                 <input 
                   type="text" 
                   value={formData.phone} 
                   onChange={e => setFormData({...formData, phone: e.target.value})}
                   className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                 />
               </div>
            </div>
         </div>

         {/* General Info */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
               <input 
                 type="email" 
                 value={formData.email} 
                 onChange={e => setFormData({...formData, email: e.target.value})}
                 className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                 readOnly
                 title="Para alterar o e-mail, entre em contato com o suporte."
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                 <select 
                   value={formData.state}
                   onChange={e => setFormData({...formData, state: e.target.value})}
                   className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                 >
                   {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                 <input 
                   type="text" 
                   value={formData.city} 
                   onChange={e => setFormData({...formData, city: e.target.value})}
                   className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                 />
               </div>
            </div>
         </div>

         <div className="pt-4">
           <button type="submit" className="bg-brand-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-700 transition shadow-md">
             Salvar Alterações
           </button>
         </div>
      </form>

      <hr className="my-10 border-gray-200" />

      {/* Password Change */}
      <div className="max-w-2xl">
         <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
           <Lock size={20} className="text-gray-400" /> 
           Alterar Senha
         </h2>
         <form onSubmit={handleChangePass} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
              <input 
                type="password" 
                value={passData.current} 
                onChange={e => setPassData({...passData, current: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
              <input 
                type="password" 
                value={passData.new} 
                onChange={e => setPassData({...passData, new: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition">
                Atualizar Senha
              </button>
            </div>
         </form>
      </div>

    </div>
  );
};
