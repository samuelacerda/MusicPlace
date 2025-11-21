
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Save, Globe, CreditCard, Shield, Server, RotateCcw } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { systemSettings, updateSystemSettings, logs } = useAppStore();
  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'system'>('general');
  const [formData, setFormData] = useState(systemSettings);

  const handleSave = () => {
    updateSystemSettings(formData);
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="max-w-5xl">
       <div className="mb-8 flex justify-between items-center">
         <div>
           <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
           <p className="text-gray-500">Ajustes globais, pagamentos e segurança.</p>
         </div>
         <button onClick={handleSave} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700">
            <Save size={18} /> Salvar Alterações
         </button>
       </div>

       {/* Tabs */}
       <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('general')} 
            className={`pb-4 px-4 font-bold flex items-center gap-2 border-b-2 transition ${activeTab === 'general' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
             <Globe size={18} /> Geral
          </button>
          <button 
            onClick={() => setActiveTab('payment')} 
            className={`pb-4 px-4 font-bold flex items-center gap-2 border-b-2 transition ${activeTab === 'payment' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
             <CreditCard size={18} /> Pagamentos
          </button>
          <button 
            onClick={() => setActiveTab('system')} 
            className={`pb-4 px-4 font-bold flex items-center gap-2 border-b-2 transition ${activeTab === 'system' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
             <Server size={18} /> Sistema & Logs
          </button>
       </div>

       <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          {/* General Tab */}
          {activeTab === 'general' && (
             <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Identidade do Site</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Site</label>
                      <input type="text" value={formData.siteName} onChange={(e) => setFormData({...formData, siteName: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL Base</label>
                      <input type="text" value={formData.baseUrl} onChange={(e) => setFormData({...formData, baseUrl: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL do Logo</label>
                      <input type="text" value={formData.logoUrl} onChange={(e) => setFormData({...formData, logoUrl: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL do Favicon</label>
                      <input type="text" value={formData.faviconUrl} onChange={(e) => setFormData({...formData, faviconUrl: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" />
                   </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                   <h3 className="text-lg font-bold text-gray-900 mb-4">Manutenção</h3>
                   <div className="flex items-center gap-4 mb-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={formData.maintenanceMode} onChange={(e) => setFormData({...formData, maintenanceMode: e.target.checked})} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">Ativar Modo Manutenção</span>
                      </label>
                   </div>
                   <textarea 
                     value={formData.maintenanceMessage} 
                     onChange={(e) => setFormData({...formData, maintenanceMessage: e.target.value})}
                     className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" 
                     placeholder="Mensagem para os usuários..."
                   />
                </div>
             </div>
          )}

          {/* Payment Tab */}
          {activeTab === 'payment' && (
             <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Gateway de Pagamento</h3>
                <div>
                   <label className="block font-medium text-gray-900 mb-2">Provedor Principal</label>
                   <select 
                     className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                     value={formData.paymentGateway}
                     onChange={(e) => setFormData({...formData, paymentGateway: e.target.value as any})}
                   >
                      <option value="mercadopago">Mercado Pago (Brasil)</option>
                      <option value="stripe">Stripe (Global)</option>
                      <option value="pix_manual">Pix Manual</option>
                   </select>
                </div>

                {formData.paymentGateway === 'mercadopago' && (
                   <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 space-y-4">
                      <h4 className="font-bold text-blue-900">Credenciais Mercado Pago</h4>
                      <div>
                         <label className="block text-xs font-bold text-blue-800 mb-1">Public Key</label>
                         <input type="text" className="w-full p-2 border border-blue-200 rounded bg-white text-gray-900" value={formData.mercadoPagoPublicKey || ''} onChange={(e) => setFormData({...formData, mercadoPagoPublicKey: e.target.value})} />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-blue-800 mb-1">Access Token</label>
                         <input type="password" className="w-full p-2 border border-blue-200 rounded bg-white text-gray-900" value={formData.mercadoPagoAccessToken || ''} onChange={(e) => setFormData({...formData, mercadoPagoAccessToken: e.target.value})} />
                      </div>
                   </div>
                )}

                <div className="pt-6 border-t border-gray-100">
                   <h3 className="text-lg font-bold text-gray-900 mb-4">Configurações Financeiras</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Taxa Extra (%)</label>
                         <input type="number" value={formData.extraFeesPercentage} onChange={(e) => setFormData({...formData, extraFeesPercentage: parseFloat(e.target.value)})} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" />
                      </div>
                      <div className="flex items-center pt-6">
                         <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.recurringPayments} onChange={(e) => setFormData({...formData, recurringPayments: e.target.checked})} className="h-5 w-5 text-brand-600 rounded" />
                            <span className="font-medium text-gray-700">Habilitar Assinaturas Recorrentes</span>
                         </label>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
             <div className="space-y-8">
                <div>
                   <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Shield size={20} /> Segurança</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Upload (MB)</label>
                         <input type="number" value={formData.uploadLimitMB} onChange={(e) => setFormData({...formData, uploadLimitMB: parseInt(e.target.value)})} className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">IPs Permitidos (Admin)</label>
                         <input type="text" placeholder="Separar por vírgula" className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900" />
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Logs de Atividade</h3>
                      <button className="text-sm text-brand-600 hover:underline flex items-center gap-1"><RotateCcw size={14}/> Atualizar</button>
                   </div>
                   <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs h-64 overflow-y-auto">
                      {logs.length === 0 ? (
                        <div>Nenhum log registrado ainda.</div>
                      ) : (
                        logs.map(log => (
                          <div key={log.id} className="mb-1">
                            <span className="text-gray-500">[{new Date(log.date).toLocaleString()}]</span> <span className="text-yellow-400">{log.action}:</span> {log.details}
                          </div>
                        ))
                      )}
                   </div>
                </div>
             </div>
          )}
       </div>
    </div>
  );
};
