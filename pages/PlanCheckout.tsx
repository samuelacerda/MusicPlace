
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, QrCode, Lock, Loader2, Copy, AlertTriangle, CheckCircle, Smartphone } from 'lucide-react';
import { supabase } from '../services/supabase';

export const PlanCheckout: React.FC = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { plans, systemSettings, currentUser, updateProfile } = useAppStore();
  const [processing, setProcessing] = useState(false);
  const [isSimulation, setIsSimulation] = useState(false);
  const [countdown, setCountdown] = useState(10);
  
  // Payment State
  const [pixCode, setPixCode] = useState('');
  const [pixQrImage, setPixQrImage] = useState('');
  
  const pollInterval = useRef<any>(null);
  const countdownInterval = useRef<any>(null);

  const selectedPlan = plans.find(p => p.id === planId);

  useEffect(() => {
    if (!currentUser) {
        navigate(`/login?redirect=/checkout-plano/${planId}`);
    }
  }, [currentUser, navigate, planId]);

  useEffect(() => {
      return () => {
          if (pollInterval.current) clearInterval(pollInterval.current);
          if (countdownInterval.current) clearInterval(countdownInterval.current);
      };
  }, []);

  if (!selectedPlan) return <div className="p-8 text-center text-gray-500">Plano não encontrado</div>;

  // --- 1. GERAR PIX PLANO (REAL) ---
  const generatePixPayment = async () => {
      if (pixCode) return;
      setProcessing(true);
      setIsSimulation(false);

      const apiKey = systemSettings.abacatePayApiKey;

      if (!apiKey || !supabase) {
          console.warn("Chave Abacate Pay ausente. Simulando.");
          generateSimulationPix();
          setProcessing(false);
          return;
      }

      try {
          const { data, error } = await supabase.functions.invoke('create-abacate-payment', {
              body: {
                  amount: selectedPlan.price,
                  description: `Assinatura: Plano ${selectedPlan.name}`,
                  customer: {
                      name: currentUser?.name,
                      email: currentUser?.email,
                      taxId: currentUser?.cpf
                  },
                  returnUrl: `${window.location.origin}/#/minha-conta/assinatura`
              }
          });

          if (error) throw error;

          if (data && data.pix) {
              setPixCode(data.pix);
              setPixQrImage(data.qrCodeUrl || '');
              
              if (data.billingId) {
                  startRealPolling(data.billingId);
              }
          } else {
              throw new Error("Erro na resposta do pagamento.");
          }

      } catch (err) {
          console.error(err);
          generateSimulationPix();
      } finally {
          setProcessing(false);
      }
  };

  // --- 2. SIMULAÇÃO ---
  const generateSimulationPix = () => {
      setIsSimulation(true);
      const amount = selectedPlan ? selectedPlan.price.toFixed(2) : '0.00';
      const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
      const mockPix = `00020126330014BR.GOV.BCB.PIX0114ABACATEPAY520400005303986540${amount.replace('.','')}5802BR5913MusicPlacePlan6009SAO PAULO62070503${randomStr}6304`;
      setPixCode(mockPix);
      
      setCountdown(10);
      if(countdownInterval.current) clearInterval(countdownInterval.current);
      countdownInterval.current = setInterval(() => {
          setCountdown(prev => {
              if (prev <= 1) {
                  clearInterval(countdownInterval.current);
                  handleApprove();
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
  };

  const handleApprove = async () => {
      if (currentUser && selectedPlan) {
          await updateProfile(currentUser.id, { plan: selectedPlan.id });
          useAppStore.getState().fetchData();
          alert(`✅ Assinatura do plano ${selectedPlan.name} ativada!`);
          navigate('/minha-conta/assinatura');
      }
  };

  // --- 3. POLLING REAL ---
  const startRealPolling = (billingId: string) => {
      if (pollInterval.current) clearInterval(pollInterval.current);
      pollInterval.current = setInterval(async () => {
          try {
              const { data } = await supabase!.functions.invoke('check-abacate-status', {
                  body: { billingId }
              });
              if (data && data.status === 'PAID') {
                  clearInterval(pollInterval.current);
                  handleApprove();
              }
          } catch (e) { console.error(e); }
      }, 5000);
  };

  useEffect(() => {
      generatePixPayment();
  }, []);

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
                         <CheckCircle size={32} />
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

                {/* Payment Box */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                   <div className="flex flex-col items-center mb-6">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                          <Lock size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Pagamento via PIX</h2>
                      <p className="text-gray-500 text-sm">Ativação automática via Abacate Pay.</p>
                   </div>

                   {processing ? (
                       <div className="py-12">
                          <Loader2 className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" />
                          <p className="text-gray-500 font-bold">Gerando cobrança...</p>
                       </div>
                   ) : (
                       <div className="max-w-sm mx-auto space-y-6 animate-fadeIn">
                          
                          <div className="border-2 border-dashed border-green-200 p-4 rounded-xl w-64 h-64 mx-auto flex items-center justify-center bg-green-50 overflow-hidden">
                              {pixQrImage ? (
                                  <img src={pixQrImage} alt="QR Code" className="w-full h-full object-contain" />
                              ) : (
                                  <QrCode size={150} className="text-green-800 opacity-80" />
                              )}
                          </div>
                          
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-left">Código PIX Copia e Cola</label>
                              <div className="flex gap-2">
                                <input type="text" readOnly value={pixCode} className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-600 truncate" />
                                <button onClick={copyPix} className="p-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition font-bold">
                                    <Copy size={18} />
                                </button>
                              </div>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-xl text-left flex gap-3">
                              <div className="mt-1"><Smartphone size={20} className="text-blue-600"/></div>
                              <div className="text-sm text-blue-800">
                                  <p className="font-bold mb-1">Instruções:</p>
                                  <p>Copie o código acima, abra seu banco na área PIX e escolha "Copia e Cola".</p>
                              </div>
                          </div>

                          {isSimulation && (
                              <div className="bg-yellow-50 p-4 rounded-xl text-left border border-yellow-100 animate-pulse">
                                  <div className="flex justify-between items-center mb-2">
                                      <p className="font-bold text-yellow-800 text-sm flex items-center gap-2">
                                          <AlertTriangle size={16}/> Simulação
                                      </p>
                                      <span className="text-xs font-mono bg-yellow-200 px-2 py-1 rounded text-yellow-900">{countdown}s</span>
                                  </div>
                                  <button 
                                      onClick={handleApprove}
                                      className="w-full bg-yellow-600 text-white font-bold py-2 rounded-lg hover:bg-yellow-700 transition text-sm"
                                  >
                                      Aprovar Agora
                                  </button>
                              </div>
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
                      <div className="flex justify-between text-gray-600"><span>Assinatura</span><span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedPlan.price)}</span></div>
                      <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-900"><span>Total</span><span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedPlan.price)}</span></div>
                   </div>
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};
