


import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Save, Globe, CreditCard, Shield, Server, RotateCcw, Mail, MessageSquare, Send, CheckCircle, AlertCircle, Bot, Eye, EyeOff, Lock, QrCode } from 'lucide-react';
import { EmailConfig, WhatsappConfig } from '../../types';

export const AdminSettings: React.FC = () => {
  const { systemSettings, updateSystemSettings, logs, sendAdminEmail, users } = useAppStore();
  const [activeTab, setActiveTab] = useState<'general' | 'communication' | 'payment' | 'system'>('general');
  const [formData, setFormData] = useState(systemSettings);
  const [showToken, setShowToken] = useState(false);

  // Email Sending Tool State
  const [emailTool, setEmailTool] = useState({
      target: 'all', // all, buyers, sellers, specific
      specificEmail: '',
      subject: '',
      message: ''
  });

  const handleSave = () => {
    updateSystemSettings(formData);
    alert('Configurações salvas com sucesso!');
  };

  const handleSendEmail = (e: React.FormEvent) => {
      e.preventDefault();
      let recipients: string[] = [];
      
      if (emailTool.target === 'all') recipients = users.map(u => u.email);
      else if (emailTool.target === 'specific') recipients = [emailTool.specificEmail];
      // Mock filters for buyers/sellers based on role/type
      else if (emailTool.target === 'sellers') recipients = users.filter(u => u.accountType !== 'individual').map(u => u.email);

      sendAdminEmail(recipients, emailTool.subject, emailTool.message);
      alert(`E-mail enviado para ${recipients.length} destinatários.`);
      setEmailTool({ ...emailTool, subject: '', message: '' });
  };

  const updateEmailConfig = (key: keyof EmailConfig, value: any) => {
      setFormData({
          ...formData,
          emailConfig: { ...formData.emailConfig, [key]: value }
      });
  };

  const updateWhatsappConfig = (key: keyof WhatsappConfig, value: any) => {
      setFormData({
          ...formData,
          whatsappConfig: { ...formData.whatsappConfig, [key]: value }
      });
  };

  // Helper to check if MP keys look like production
  const getKeyStatus = (key: string) => {
      if (!key) return 'empty';
      if (key.startsWith('TEST-')) return 'test';
      return 'production';
  };

  const mpStatus = getKeyStatus(formData.mercadoPagoPublicKey || '');

  return (
    <div className="max-w-6xl pb-20">
       <div className="mb-8 flex justify-between items-center sticky top-0 bg-gray-100 py-4 z-10 border-b border-gray-200">
         <div>
           <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
           <p className="text-gray-500">Controle total sobre comunicações e integrações.</p>
         </div>
         <button onClick={handleSave} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700 shadow-md">
            <Save size={18} /> Salvar Alterações
         </button>
       </div>

       {/* Tabs */}
       <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('general')} className={`pb-4 px-4 font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${activeTab === 'general' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
             <Globe size={18} /> Geral
          </button>
          <button onClick={() => setActiveTab('communication')} className={`pb-4 px-4 font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${activeTab === 'communication' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
             <Mail size={18} /> E-mail & WhatsApp
          </button>
          <button onClick={() => setActiveTab('payment')} className={`pb-4 px-4 font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${activeTab === 'payment' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
             <CreditCard size={18} /> Pagamentos
          </button>
          <button onClick={() => setActiveTab('system')} className={`pb-4 px-4 font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${activeTab === 'system' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
             <Server size={18} /> Sistema
          </button>
       </div>

       <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          
          {/* 1. GENERAL TAB */}
          {activeTab === 'general' && (
             <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Identidade Visual</h3>
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

          {/* 2. COMMUNICATION TAB (EMAIL & WHATSAPP) */}
          {activeTab === 'communication' && (
             <div className="space-y-12">
                
                {/* SMTP Config */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Mail size={20} /></div>
                        <h3 className="text-xl font-bold text-gray-900">Configurações de E-mail (SMTP)</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail de Suporte (Recebe Tickets)</label>
                            <input type="email" value={formData.emailConfig.supportEmail} onChange={e => updateEmailConfig('supportEmail', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail de Contato Geral</label>
                            <input type="email" value={formData.emailConfig.contactEmail} onChange={e => updateEmailConfig('contactEmail', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Remetente Padrão</label>
                            <input type="text" value={formData.emailConfig.senderName} onChange={e => updateEmailConfig('senderName', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reply-To (Responder Para)</label>
                            <input type="email" value={formData.emailConfig.replyTo} onChange={e => updateEmailConfig('replyTo', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" />
                        </div>

                        <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                             <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Server size={16}/> Servidor SMTP (Gmail / Workspace)</h4>
                             
                             <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-4 text-sm text-yellow-800">
                                <p className="font-bold flex items-center gap-2"><AlertCircle size={14}/> Atenção para usuários Gmail:</p>
                                <p className="mt-1">Não use sua senha normal de login! Você deve gerar uma <strong>"Senha de App"</strong> nas configurações de segurança da sua conta Google.</p>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Host SMTP</label>
                                    <input type="text" value={formData.emailConfig.smtpHost} onChange={e => updateEmailConfig('smtpHost', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="smtp.gmail.com" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Porta</label>
                                    <input type="number" value={formData.emailConfig.smtpPort} onChange={e => updateEmailConfig('smtpPort', parseInt(e.target.value))} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="465" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Criptografia</label>
                                    <select value={formData.emailConfig.encryption} onChange={e => updateEmailConfig('encryption', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900">
                                        <option value="ssl">SSL</option>
                                        <option value="tls">TLS</option>
                                        <option value="none">Nenhuma</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Usuário SMTP (Seu E-mail)</label>
                                    <input type="text" value={formData.emailConfig.smtpUser} onChange={e => updateEmailConfig('smtpUser', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="seu.email@gmail.com" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha de App (App Password)</label>
                                    <input type="password" value={formData.emailConfig.smtpPass} onChange={e => updateEmailConfig('smtpPass', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="xxxx xxxx xxxx xxxx" />
                                </div>
                             </div>
                        </div>
                        
                        <div className="md:col-span-2">
                            <button className="text-brand-600 text-sm font-bold flex items-center gap-1 hover:underline">
                                <CheckCircle size={14} /> Testar Conexão SMTP
                            </button>
                        </div>
                    </div>
                </section>

                {/* WhatsApp & Bot Config */}
                <section className="border-t border-gray-200 pt-8">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><MessageSquare size={20} /></div>
                        <h3 className="text-xl font-bold text-gray-900">WhatsApp & Atendimento</h3>
                    </div>

                     <div className="bg-green-50 p-6 rounded-xl border border-green-200 space-y-6">
                        
                        {/* Enable Toggle */}
                        <div className="flex items-center justify-between border-b border-green-200 pb-4">
                            <div>
                                <h4 className="font-bold text-green-900">Botão Flutuante</h4>
                                <p className="text-xs text-green-700">Exibe o ícone do WhatsApp no canto do site.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={formData.whatsappConfig.enabled} onChange={(e) => updateWhatsappConfig('enabled', e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>

                        {/* Human Support */}
                        <div>
                            <h4 className="font-bold text-green-900 mb-3">Atendimento Humano (Teste)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Número Oficial / Teste</label>
                                    <input type="text" value={formData.whatsappConfig.humanAgentNumber} onChange={e => updateWhatsappConfig('humanAgentNumber', e.target.value)} className="w-full p-2 border border-green-200 rounded bg-white text-gray-900" placeholder="5511999999999" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tempo de Espera p/ Humano (min)</label>
                                    <input type="number" value={formData.whatsappConfig.humanTimeoutMinutes} onChange={e => updateWhatsappConfig('humanTimeoutMinutes', parseInt(e.target.value))} className="w-full p-2 border border-green-200 rounded bg-white text-gray-900" />
                                </div>
                            </div>
                        </div>

                        {/* Virtual Assistant Bot */}
                        <div className="bg-white p-4 rounded-lg border border-green-100">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Bot size={18} className="text-brand-600"/> 
                                Configuração do Assistente Virtual
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Provedor do Robô</label>
                                    <select value={formData.whatsappConfig.botProvider || 'Typebot'} onChange={e => updateWhatsappConfig('botProvider', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900">
                                        <option value="Typebot">Typebot.io</option>
                                        <option value="Dialogflow">Google Dialogflow</option>
                                        <option value="Custom">API Própria</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ID do Robô / API Token</label>
                                    <input type="text" value={formData.whatsappConfig.botId} onChange={e => updateWhatsappConfig('botId', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" placeholder="Cole o ID aqui..." />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mensagem de Boas-vindas</label>
                                    <input type="text" value={formData.whatsappConfig.welcomeMessage} onChange={e => updateWhatsappConfig('welcomeMessage', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" />
                                </div>
                            </div>
                        </div>

                     </div>
                </section>

                {/* Email Sending Tool */}
                <section className="border-t border-gray-200 pt-8">
                     <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Send size={20} /></div>
                        <h3 className="text-xl font-bold text-gray-900">Ferramenta de Envio de E-mail</h3>
                    </div>
                    
                    <form onSubmit={handleSendEmail} className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Destinatário(s)</label>
                                <select value={emailTool.target} onChange={e => setEmailTool({...emailTool, target: e.target.value})} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900">
                                    <option value="all">Todos os Usuários</option>
                                    <option value="specific">E-mail Específico</option>
                                    <option value="sellers">Vendedores / Lojistas</option>
                                </select>
                            </div>
                             {emailTool.target === 'specific' && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">E-mail do Usuário</label>
                                    <input type="email" required value={emailTool.specificEmail} onChange={e => setEmailTool({...emailTool, specificEmail: e.target.value})} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" />
                                </div>
                             )}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Assunto</label>
                            <input type="text" required value={emailTool.subject} onChange={e => setEmailTool({...emailTool, subject: e.target.value})} className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900" />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Mensagem (HTML)</label>
                            <textarea required value={emailTool.message} onChange={e => setEmailTool({...emailTool, message: e.target.value})} className="w-full p-2 border border-gray-300 rounded h-32 font-mono text-sm bg-white text-gray-900" />
                        </div>
                        <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition flex items-center gap-2">
                            <Send size={16} /> Enviar Disparo
                        </button>
                    </form>
                </section>
             </div>
          )}

          {/* 3. PAYMENT TAB */}
          {activeTab === 'payment' && (
             <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Gateway de Pagamento</h3>
                
                {mpStatus === 'production' && (
                    <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 flex items-center gap-2 mb-4">
                        <CheckCircle size={20} /> 
                        <span className="font-bold">Modo Produção Ativo:</span> O sistema está processando pagamentos reais.
                    </div>
                )}
                
                {mpStatus === 'test' && (
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200 flex items-center gap-2 mb-4">
                        <Shield size={20} /> 
                        <span className="font-bold">Modo Sandbox (Teste):</span> Use cartões de teste para validar o fluxo.
                    </div>
                )}

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
                         <input type="text" className="w-full p-2 border border-blue-200 rounded bg-white text-gray-900 font-mono" value={formData.mercadoPagoPublicKey || ''} onChange={(e) => setFormData({...formData, mercadoPagoPublicKey: e.target.value})} placeholder="APP_USR-..." />
                         <p className="text-[10px] text-blue-600 mt-1">Para produção, use a chave que começa com APP_USR-. Para teste, use TEST-.</p>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-blue-800 mb-1">Access Token</label>
                         <div className="relative">
                            <input 
                                type={showToken ? "text" : "password"} 
                                className="w-full p-2 pr-10 border border-blue-200 rounded bg-white text-gray-900 font-mono" 
                                value={formData.mercadoPagoAccessToken || ''} 
                                onChange={(e) => setFormData({...formData, mercadoPagoAccessToken: e.target.value})} 
                                placeholder="APP_USR-..."
                            />
                            <button 
                                type="button"
                                onClick={() => setShowToken(!showToken)}
                                className="absolute right-2 top-2.5 text-blue-400 hover:text-blue-600"
                            >
                                {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                         </div>
                      </div>
                      
                      {/* PIX Key Input */}
                      <div className="pt-4 border-t border-blue-200 mt-4">
                         <label className="block text-xs font-bold text-blue-800 mb-1 flex items-center gap-1">
                            <QrCode size={14} /> Chave PIX (Para Recebimento)
                         </label>
                         <input 
                            type="text" 
                            className="w-full p-2 border border-blue-200 rounded bg-white text-gray-900 font-mono" 
                            value={formData.mercadoPagoPixKey || ''} 
                            onChange={(e) => setFormData({...formData, mercadoPagoPixKey: e.target.value})} 
                            placeholder="CPF, CNPJ, E-mail ou Chave Aleatória" 
                         />
                         <p className="text-[10px] text-blue-600 mt-1">
                            Insira sua chave PIX cadastrada no Mercado Pago. O sistema gerará QR Codes apontando para esta chave.
                         </p>
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

          {/* 4. SYSTEM TAB */}
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
                   <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex items-start gap-2">
                      <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                      <p className="text-sm text-yellow-800">
                          <strong>Nota de Segurança:</strong> As senhas de SMTP são armazenadas com criptografia simulada no banco de dados local. Em produção, utilize variáveis de ambiente.
                      </p>
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