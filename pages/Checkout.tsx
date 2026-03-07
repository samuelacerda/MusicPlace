
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, QrCode, Lock, Loader2, Copy, AlertTriangle, ImageOff, Smartphone } from 'lucide-react';
import { supabase } from '../services/supabase';

export const Checkout: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, systemSettings, markAsSold, currentUser } = useAppStore();
  const [processing, setProcessing] = useState(false);
  const [countdown, setCountdown] = useState(10);
  
  // Payment State
  const [pixCode, setPixCode] = useState('');
  const [pixQrImage, setPixQrImage] = useState(''); // Base64 or URL
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [isSimulation, setIsSimulation] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Polling Ref
  const pollInterval = useRef<any>(null);
  const countdownInterval = useRef<any>(null);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (!currentUser) {
        navigate(`/login?redirect=/checkout/${id}`);
    }
  }, [currentUser, navigate, id]);

  useEffect(() => {
      return () => {
          if (pollInterval.current) clearInterval(pollInterval.current);
          if (countdownInterval.current) clearInterval(countdownInterval.current);
      };
  }, []);

  if (!product) return <div className="p-8 text-center text-gray-500">Produto não encontrado</div>;

  const hasImages = Array.isArray(product.images) && product.images.length > 0;
  const displayImage = hasImages ? product.images[0] : null;

  // --- 1. GERAR PIX (INTEGRAÇÃO REAL VIA EDGE FUNCTION) ---
  const generateAbacatePix = async () => {
      if (pixCode) return; 
      setProcessing(true);
      setIsSimulation(false);
      setErrorMsg('');

      const apiKey = systemSettings.abacatePayApiKey;
      
      // Se não tiver chave ou não tiver Supabase configurado, vai para simulação
      if (!apiKey || !supabase) {
          console.warn("Modo Simulação: API Key ou Supabase não configurados.");
          generateSimulationPix();
          setProcessing(false);
          return;
      }

      try {
          // Chama a Edge Function 'create-abacate-payment'
          // Você precisa fazer o deploy desta função no seu projeto Supabase
          const { data, error } = await supabase.functions.invoke('create-abacate-payment', {
              body: {
                  amount: product.price, // Valor em reais (float)
                  description: `Pedido: ${product.title}`,
                  customer: {
                      name: currentUser?.name,
                      email: currentUser?.email,
                      taxId: currentUser?.cpf // CPF
                  },
                  returnUrl: `${window.location.origin}/#/sucesso`
              }
          });

          if (error) throw error;

          if (data && data.pix) {
              setPixCode(data.pix); // Código Copia e Cola
              setPixQrImage(data.qrCodeUrl || ''); // URL do QR Code se disponível
              
              // Iniciar monitoramento real do status
              if (data.billingId) {
                  startRealPolling(data.billingId);
              }
          } else {
              throw new Error("Resposta inválida do provedor de pagamento.");
          }

      } catch (err: any) {
          console.error("Erro na integração real:", err);
          // Fallback silencioso para simulação se a função não existir ou der erro
          generateSimulationPix(); 
      } finally {
          setProcessing(false);
      }
  };

  // --- 2. MODO SIMULAÇÃO (FALLBACK) ---
  const generateSimulationPix = () => {
      setIsSimulation(true);
      const amount = product ? product.price.toFixed(2) : '0.00';
      // Mock QR Code data
      const mockPix = `00020126580014BR.GOV.BCB.PIX0136${Math.random().toString(36).substring(7)}520400005303986540${amount.replace('.','')}5802BR5913MusicPlace6009SAO PAULO62070503***6304`;
      setPixCode(mockPix);
      
      setCountdown(10);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
      
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

  const handleApprove = () => {
      setPaymentStatus('approved');
      markAsSold(product.id);
      navigate('/sucesso');
  };

  // --- 3. POLLING REAL (Verifica status na API via Function) ---
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
          } catch (e) {
              console.error("Erro no polling:", e);
          }
      }, 5000); // Verifica a cada 5s
  };

  const copyPix = () => {
      navigator.clipboard.writeText(pixCode);
      alert('Código PIX copiado!');
  };

  useEffect(() => {
      generateAbacatePix();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
       <div className="max-w-4xl mx-auto px-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium">
             <ArrowLeft size={20} /> Cancelar e Voltar
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Main Content */}
             <div className="lg:col-span-2 space-y-6">
                
                {/* Product Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                   <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo do Pedido</h2>
                   <div className="flex gap-4">
                      {displayImage ? (
                        <img src={displayImage} alt={product.title} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                           <ImageOff size={24} />
                        </div>
                      )}
                      <div>
                         <h3 className="font-bold text-gray-900 line-clamp-2">{product.title}</h3>
                         <p className="text-gray-500 text-sm mt-1">Vendedor: {product.sellerName}</p>
                         <p className="text-brand-600 font-bold mt-1">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
                         </p>
                      </div>
                   </div>
                </div>

                {/* Payment Box */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                   <div className="flex flex-col items-center mb-6">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                          <Lock size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Pagamento via PIX</h2>
                      <p className="text-gray-500 text-sm">Abacate Pay: Seguro, instantâneo e sem taxas.</p>
                   </div>

                   {processing ? (
                       <div className="py-12">
                          <Loader2 className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" />
                          <p className="text-gray-500 font-bold">Gerando código PIX...</p>
                       </div>
                   ) : (
                       <div className="max-w-sm mx-auto space-y-6 animate-fadeIn">
                          
                          {/* QR Code Area */}
                          <div className="border-2 border-dashed border-green-200 p-4 rounded-xl w-64 h-64 mx-auto flex items-center justify-center bg-green-50 relative overflow-hidden">
                              {pixQrImage ? (
                                  <img src={pixQrImage} alt="QR Code PIX" className="w-full h-full object-contain" />
                              ) : (
                                  <QrCode size={150} className="text-green-800 opacity-80" />
                              )}
                          </div>
                          
                          {/* Copy Paste */}
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-left">Código PIX Copia e Cola</label>
                              <div className="flex gap-2">
                                <input type="text" readOnly value={pixCode} className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-600 truncate" />
                                <button onClick={copyPix} className="p-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition font-bold">
                                    <Copy size={18} />
                                </button>
                              </div>
                          </div>

                          {/* Instructions */}
                          <div className="bg-blue-50 p-4 rounded-xl text-left flex gap-3">
                              <div className="mt-1"><Smartphone size={20} className="text-blue-600"/></div>
                              <div className="text-sm text-blue-800">
                                  <p className="font-bold mb-1">Como pagar?</p>
                                  <ol className="list-decimal pl-4 space-y-1 text-blue-700">
                                      <li>Abra o app do seu banco</li>
                                      <li>Escolha a opção PIX {'>'} Copia e Cola</li>
                                      <li>Cole o código acima e confirme</li>
                                  </ol>
                              </div>
                          </div>

                          {isSimulation && (
                              <div className="bg-yellow-50 p-4 rounded-xl text-left border border-yellow-100 animate-pulse">
                                  <div className="flex justify-between items-center mb-2">
                                      <p className="font-bold text-yellow-800 text-sm flex items-center gap-2">
                                          <AlertTriangle size={16}/> Modo Simulação
                                      </p>
                                      <span className="text-xs font-mono bg-yellow-200 px-2 py-1 rounded text-yellow-900">{countdown}s</span>
                                  </div>
                                  <p className="text-xs text-yellow-700 mb-4">
                                      Backend não detectado. Simulando aprovação automática.
                                  </p>
                                  <button 
                                      onClick={handleApprove}
                                      className="w-full bg-yellow-600 text-white font-bold py-2 rounded-lg hover:bg-yellow-700 transition text-sm"
                                  >
                                      Simular Pagamento Agora
                                  </button>
                              </div>
                          )}
                       </div>
                   )}
                </div>
             </div>

             {/* Sidebar Summary */}
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
                   <h3 className="font-bold text-gray-900 mb-4">Valores</h3>
                   <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-gray-600">
                         <span>Produto</span>
                         <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                         <span>Frete</span>
                         <span className="text-green-600 font-medium">Grátis</span>
                      </div>
                      <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-900">
                         <span>Total</span>
                         <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}</span>
                      </div>
                   </div>
                   
                   <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                      <p className="text-xs text-gray-400">
                         Ao pagar, você concorda com os Termos de Uso do MusicPlace.
                      </p>
                   </div>
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};
