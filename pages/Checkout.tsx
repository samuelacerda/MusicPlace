
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, CreditCard, QrCode, Lock, ShieldCheck, Loader2, Copy, AlertTriangle, ImageOff, Check, RefreshCw } from 'lucide-react';
import { supabase } from '../services/supabase';

export const Checkout: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, systemSettings, markAsSold, currentUser } = useAppStore();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [processing, setProcessing] = useState(false);
  
  // Payment State
  const [pixCode, setPixCode] = useState('');
  const [pixQrImage, setPixQrImage] = useState('');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [backendError, setBackendError] = useState(false);
  
  // Polling Ref
  const pollInterval = useRef<any>(null);

  // Card Data State
  const [cardData, setCardData] = useState({
      number: '',
      name: '',
      expiry: '',
      cvv: ''
  });

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (!currentUser) {
        navigate(`/login?redirect=/checkout/${id}`);
    }
  }, [currentUser, navigate, id]);

  // Cleanup polling on unmount
  useEffect(() => {
      return () => {
          if (pollInterval.current) clearInterval(pollInterval.current);
      };
  }, []);

  if (!product) return <div className="p-8 text-center text-gray-500">Produto não encontrado</div>;

  // Safe Image Handling
  const hasImages = Array.isArray(product.images) && product.images.length > 0;
  const displayImage = hasImages ? product.images[0] : null;

  // --- CONFIGURAÇÃO ---
  const publicKey = systemSettings.mercadoPagoPublicKey || '';
  const isConfigured = publicKey.length > 0;
  const isTestMode = publicKey.startsWith('TEST-');
  
  const isTestCardInput = cardData.number.replace(/\s/g, '').startsWith('5031433215406351');

  // --- 1. GERAR PIX (INTEGRAÇÃO REAL) ---
  const generatePixPayment = async () => {
      setProcessing(true);
      setBackendError(false);

      try {
          if (!supabase) throw new Error("Supabase not initialized");

          // Tenta chamar a Edge Function (Backend)
          const { data, error } = await supabase.functions.invoke('create-payment', {
              body: {
                  amount: product.price,
                  description: product.title,
                  payerEmail: currentUser?.email,
                  paymentMethod: 'pix'
              }
          });

          if (error) throw error;

          if (data && data.qr_code) {
              // SUCESSO: Backend respondeu com dados do Mercado Pago
              setPixCode(data.qr_code);
              setPixQrImage(data.qr_code_base64);
              setPaymentId(data.payment_id);
              setPaymentStatus('pending');
              
              // Iniciar Polling para verificar status
              startPolling(data.payment_id);
          } else {
              throw new Error("Resposta inválida do servidor");
          }

      } catch (err) {
          console.warn("Edge Function falhou ou não existe. Usando modo Simulação.", err);
          setBackendError(true);
          generateSimulationPix();
      } finally {
          setProcessing(false);
      }
  };

  // --- 2. MODO SIMULAÇÃO (FALLBACK) ---
  const generateSimulationPix = () => {
      const key = systemSettings.mercadoPagoPixKey || 'chave-aleatoria-nao-configurada';
      const amount = product ? product.price.toFixed(2) : '0.00';
      const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
      const payload = `00020126330014BR.GOV.BCB.PIX0114${key}520400005303986540${amount.replace('.','')}5802BR5913MusicPlace6009SAO PAULO62070503${randomId}6304`;
      
      setPixCode(payload);
      setPixQrImage(''); // Sem imagem no modo estático
      setPaymentId('SIM-' + randomId);
      
      // Simula aprovação após 10 segundos
      setTimeout(() => {
          setPaymentStatus('approved');
          markAsSold(product.id);
          navigate('/sucesso');
      }, 10000);
  };

  // --- 3. VERIFICAR STATUS (POLLING) ---
  const startPolling = (id: string) => {
      if (pollInterval.current) clearInterval(pollInterval.current);

      pollInterval.current = setInterval(async () => {
          if (!supabase) return;
          
          // Chama endpoint de verificação
          const { data, error } = await supabase.functions.invoke('check-payment', {
              body: { paymentId: id }
          });

          if (!error && data?.status === 'approved') {
              clearInterval(pollInterval.current);
              setPaymentStatus('approved');
              markAsSold(product.id);
              navigate('/sucesso');
          }
      }, 5000); // Verifica a cada 5 segundos
  };

  const handleCardPayment = () => {
      setProcessing(true);
      
      // Simulação de Cartão (Frontend Only por enquanto, pois requer Tokenização segura)
      setTimeout(() => {
          if (isTestMode && isTestCardInput) {
              alert("✅ PAGAMENTO DE TESTE APROVADO (Sandbox)");
          } 
          markAsSold(product.id);
          navigate('/sucesso');
      }, 3000);
  };

  const copyPix = () => {
      navigator.clipboard.writeText(pixCode);
      alert('Código PIX copiado!');
  };

  // Trigger PIX generation when tab is selected
  useEffect(() => {
      if (paymentMethod === 'pix' && !pixCode) {
          generatePixPayment();
      }
  }, [paymentMethod]);

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
                         <p className="text-gray-500 text-sm mt-1">Vendido por: {product.sellerName}</p>
                         <p className="text-brand-600 font-bold mt-1">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                         </p>
                      </div>
                   </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                   <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Lock size={20} className="text-green-600"/> Pagamento Seguro
                   </h2>

                   {/* Tabs */}
                   <div className="flex gap-4 mb-8 border-b border-gray-100">
                      <button 
                        onClick={() => setPaymentMethod('pix')}
                        className={`flex-1 pb-4 font-bold flex items-center justify-center gap-2 border-b-2 transition ${paymentMethod === 'pix' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                      >
                         <QrCode size={20} /> PIX
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 pb-4 font-bold flex items-center justify-center gap-2 border-b-2 transition ${paymentMethod === 'card' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                      >
                         <CreditCard size={20} /> Cartão de Crédito
                      </button>
                   </div>

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
                                    <p className="text-green-800 font-bold text-sm">
                                        {backendError ? "Simulação Ativa (Backend Offline)" : "Integração Mercado Pago"}
                                    </p>
                                </div>
                                
                                <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl w-56 h-56 mx-auto flex items-center justify-center bg-white relative">
                                    {pixQrImage ? (
                                        <img src={`data:image/png;base64,${pixQrImage}`} alt="QR Code PIX" className="w-full h-full object-contain" />
                                    ) : (
                                        <QrCode size={120} className="text-gray-800 opacity-80" />
                                    )}
                                    {backendError && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[1px]">
                                            <p className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded shadow">QR Code Simulado</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="max-w-sm mx-auto">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-left">Copia e Cola</label>
                                    <div className="flex gap-2">
                                    <input type="text" readOnly value={pixCode} className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-600 truncate" />
                                    <button onClick={copyPix} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition">
                                        <Copy size={18} />
                                    </button>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-xl text-left flex gap-3">
                                    <Loader2 className="animate-spin text-blue-600 shrink-0" />
                                    <div>
                                    <p className="font-bold text-blue-900 text-sm">Aguardando pagamento...</p>
                                    <p className="text-xs text-blue-700">
                                        {backendError 
                                            ? "Modo Simulação: Redirecionando em 10 segundos..." 
                                            : "Assim que você pagar no app do banco, a tela atualizará automaticamente."}
                                    </p>
                                    </div>
                                </div>
                             </>
                         )}
                      </div>
                   )}

                   {/* Card Content */}
                   {paymentMethod === 'card' && (
                      <div className="space-y-6 animate-fadeIn">
                         {/* ... (Existing Card UI - keeping simulation for frontend safety) ... */}
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
                            {isTestCardInput && <p className="text-xs text-green-600 mt-1">Cartão de teste Mercado Pago reconhecido.</p>}
                         </div>

                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nome no Cartão</label>
                            <input 
                                type="text" 
                                placeholder="COMO ESTA NO CARTAO" 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none uppercase"
                                value={cardData.name}
                                onChange={e => setCardData({...cardData, name: e.target.value})}
                            />
                         </div>

                         <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Validade</label>
                                <input 
                                    type="text" 
                                    placeholder="MM/AA" 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                    maxLength={5}
                                    value={cardData.expiry}
                                    onChange={e => setCardData({...cardData, expiry: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">CVV</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="123" 
                                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                        maxLength={4}
                                        value={cardData.cvv}
                                        onChange={e => setCardData({...cardData, cvv: e.target.value})}
                                    />
                                </div>
                            </div>
                         </div>

                         <button 
                           onClick={handleCardPayment}
                           disabled={processing}
                           className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition shadow-lg flex items-center justify-center gap-2"
                         >
                            {processing ? <Loader2 className="animate-spin" /> : `Pagar ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}`}
                         </button>
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
                         <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                         <span>Frete</span>
                         <span className="text-green-600 font-medium">Grátis</span>
                      </div>
                      <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-900">
                         <span>Total</span>
                         <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</span>
                      </div>
                   </div>
                   
                   <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                      <p className="text-xs text-gray-400">
                         Ao finalizar a compra, você concorda com os Termos de Uso do MusicPlace.
                      </p>
                   </div>
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};
