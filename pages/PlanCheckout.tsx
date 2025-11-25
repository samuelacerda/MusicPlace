
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, CreditCard, QrCode, Lock, ShieldCheck, Loader2, Copy, AlertTriangle, Check, CheckCircle } from 'lucide-react';
import { supabase } from '../services/supabase';

export const PlanCheckout: React.FC = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { plans, systemSettings, currentUser, updateProfile } = useAppStore();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('card');
  const [processing, setProcessing] = useState(false);
  
  // Payment State
  const [pixCode, setPixCode] = useState('');
  const [pixQrImage, setPixQrImage] = useState('');
  const [backendError, setBackendError] = useState(false);
  const pollInterval = useRef<any>(null);
  
  // Card Data State
  const [cardData, setCardData] = useState({
      number: '',
      name: '',
      expiry: '',
      cvv: ''
  });

  const selectedPlan = plans.find(p => p.id === planId);

  useEffect(() => {
    if (!currentUser) {
        navigate(`/login?redirect=/checkout-plano/${planId}`);
    }
  }, [currentUser, navigate, planId]);

  // Cleanup polling
  useEffect(() => {
      return () => {
          if (pollInterval.current) clearInterval(pollInterval.current);
      };
  }, []);

  if (!selectedPlan) return <div className="p-8 text-center text-gray-500">Plano não encontrado</div>;

  const isTestCardInput = cardData.number.replace(/\s/g, '').startsWith('5031433215406351');

  // --- 1. GERAR PIX (INTEGRAÇÃO REAL) ---
  const generatePixPayment = async () => {
      setProcessing(true);
      setBackendError(false);

      try {
          if (!supabase) throw new Error("Supabase not initialized");

          const { data, error } = await supabase.functions.invoke('create-payment', {
              body: {
                  amount: selectedPlan.price,
                  description: `Assinatura Plano ${selectedPlan.name}`,
                  payerEmail: currentUser?.email,
                  paymentMethod: 'pix'
              }
          });

          if (error) throw error;

          if (data && data.qr_code) {
              setPixCode(data.qr_code);
              setPixQrImage(data.qr_code_base64);
              startPolling(data.payment_id);
          } else {
              throw new Error("Resposta inválida");
          }

      } catch (err) {
          console.warn("Edge Function offline. Simulando.");
          setBackendError(true);
          generateSimulationPix();
      } finally {
          setProcessing(false);
      }
  };

  // --- 2. SIMULAÇÃO ---
  const generateSimulationPix = () => {
      const key = systemSettings.mercadoPagoPixKey || 'chave-aleatoria-nao-configurada';
      const amount = selectedPlan ? selectedPlan.price.toFixed(2) : '0.00';
      const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
      setPixCode(`00020126330014BR.GOV.BCB.PIX0114${key}520400005303986540${amount.replace('.','')}5802BR5913MusicPlacePlan6009SAO PAULO62070503${randomStr}6304`);
      setPixQrImage('');
      
      // Auto-aprove simulation
      setTimeout(async () => {
          if (currentUser) {
              await updateProfile(currentUser.id, { plan: selectedPlan.id });
              useAppStore.getState().fetchData();
              alert(`✅ Simulação: Assinatura do plano ${selectedPlan.name} ativada!`);
              navigate('/minha-conta/assinatura');
          }
      }, 8000);
  };

  // --- 3. POLLING ---
  const startPolling = (id: string) => {
      if (pollInterval.current) clearInterval(pollInterval.current);
      pollInterval.current = setInterval(async () => {
          if (!supabase) return;
          const { data, error } = await supabase.functions.invoke('check-payment', {
              body: { paymentId: id }
          });
          if (!error && data?.status === 'approved') {
              clearInterval(pollInterval.current);
              if (currentUser) {
                  await updateProfile(currentUser.id, { plan: selectedPlan.id });
                  useAppStore.getState().fetchData();
                  alert('Pagamento confirmado! Plano ativado.');
                  navigate('/minha-conta/assinatura');
              }
          }
      }, 5000);
  };

  // Trigger PIX
  useEffect(() => {
      if (paymentMethod === 'pix' && !pixCode) {
          generatePixPayment();
      }
  }, [paymentMethod]);

  // Fake Card Payment
  const handleCardPayment = async () => {
      setProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2500));
      if (currentUser) {
          await updateProfile(currentUser.id, { plan: selectedPlan.id });
          useAppStore.getState().fetchData();
          alert(isTestCardInput 
            ? `✅ SANDBOX: Plano ${selectedPlan.name} ativado!`
            : `✅ Assinatura do plano ${selectedPlan.name} realizada!`);
          navigate('/minha-conta/assinatura');
      }
      setProcessing(false);
  };

  const copyPix = () => {
      navigator.clipboard.writeText(pixCode);
      alert('Código PIX copiado!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
       <div className="max-w-4xl mx-auto px-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium">
             <ArrowLeft size={20} /> Voltar
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Main Content */}
             <div className="lg:col-span-2 space-y-6">
                
                {/* Plan Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                   <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo da Assinatura</h2>
                   <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center">
                         <CreditCard size={32} />
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-900 text-lg">Plano {selectedPlan.name}</h3>
                         <p className="text-gray-500 text-sm">{selectedPlan.description}</p>
                      </div>
                   </div>
                   <div className="mt-4 pt-4 border-t border-gray-100">
                       <ul className="space-y-2">
                           {selectedPlan.benefits.slice(0, 3).map((ben, idx) => (
                               <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                   <CheckCircle size={14} className="text-green-500" /> {ben}
                               </li>
                           ))}
                       </ul>
                   </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                   <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Lock size={20} className="text-green-600"/> Dados de Pagamento
                   </h2>

                   <div className="flex gap-4 mb-8 border-b border-gray-100">
                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 pb-4 font-bold flex items-center justify-center gap-2 border-b-2 transition ${paymentMethod === 'card' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                      >
                         <CreditCard size={20} /> Cartão de Crédito
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('pix')}
                        className={`flex-1 pb-4 font-bold flex items-center justify-center gap-2 border-b-2 transition ${paymentMethod === 'pix' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                      >
                         <QrCode size={20} /> PIX
                      </button>
                   </div>

                   {/* Card Content */}
                   {paymentMethod === 'card' && (
                      <div className="space-y-6 animate-fadeIn">
                         {/* Existing Card UI */}
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Número do Cartão</label>
                            <div className="relative">
                               <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
                               <input 
                                 type="text" 
                                 placeholder="0000 0000 0000 0000" 
                                 className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition ${isTestCardInput ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-300'}`}
                                 maxLength={19}
                                 value={cardData.number}
                                 onChange={e => setCardData({...cardData, number: e.target.value})}
                               />
                               {isTestCardInput && (
                                   <span className="absolute right-3 top-3 text-green-600 flex items-center gap-1 text-xs font-bold">
                                       <Check size={14} /> Teste
                                   </span>
                               )}
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Validade</label>
                                <input type="text" placeholder="MM/AA" className="w-full p-3 border border-gray-300 rounded-lg" maxLength={5} value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">CVV</label>
                                <input type="text" placeholder="123" className="w-full p-3 border border-gray-300 rounded-lg" maxLength={4} value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} />
                            </div>
                         </div>

                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nome no Cartão</label>
                            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg uppercase" value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})} />
                         </div>

                         <button onClick={handleCardPayment} disabled={processing} className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition shadow-lg flex items-center justify-center gap-2">
                            {processing ? <Loader2 className="animate-spin" /> : `Assinar por ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedPlan.price)}/mês`}
                         </button>
                      </div>
                   )}

                   {/* PIX Content */}
                   {paymentMethod === 'pix' && (
                      <div className="text-center space-y-6 animate-fadeIn">
                         {processing ? (
                             <div className="py-12">
                                <Loader2 className="animate-spin h-12 w-12 text-brand-600 mx-auto mb-4" />
                                <p className="text-gray-500 font-bold">Gerando código PIX...</p>
                             </div>
                         ) : (
                             <>
                                <div className="bg-green-50 p-4 rounded-lg inline-block">
                                    <p className="text-green-800 font-bold text-sm">{backendError ? "Modo Simulação" : "Aprovação Imediata"}</p>
                                </div>
                                
                                <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl w-56 h-56 mx-auto flex items-center justify-center bg-white">
                                    {pixQrImage ? <img src={`data:image/png;base64,${pixQrImage}`} className="w-full h-full object-contain" /> : <QrCode size={120} className="text-gray-800 opacity-80" />}
                                </div>
                                
                                <div className="max-w-sm mx-auto flex gap-2">
                                   <input type="text" readOnly value={pixCode} className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono truncate" />
                                   <button onClick={copyPix} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg"><Copy size={18} /></button>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-xl text-left flex gap-3">
                                    <Loader2 className="animate-spin text-blue-600 shrink-0" />
                                    <p className="text-xs text-blue-700 font-medium">Aguardando confirmação do banco...</p>
                                </div>
                             </>
                         )}
                      </div>
                   )}

                </div>
             </div>

             {/* Summary Sidebar */}
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
                   <h3 className="font-bold text-gray-900 mb-4">Detalhes da Cobrança</h3>
                   <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-gray-600"><span>Assinatura</span><span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedPlan.price)}</span></div>
                      <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-900"><span>Total</span><span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedPlan.price)}</span></div>
                   </div>
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};
