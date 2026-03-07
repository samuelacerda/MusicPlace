


import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CreditCard, CheckCircle, AlertCircle, Star, Shield, ArrowRight, XCircle, AlertTriangle, RefreshCcw, X, Lock, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Subscription: React.FC = () => {
  const { currentUser, plans, cancelSubscription } = useAppStore();
  const navigate = useNavigate();
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [savingCard, setSavingCard] = useState(false);

  if (!currentUser) return null;

  // Determine active plan
  const currentPlanId = currentUser.plan || 'plan-basic';
  const currentPlan = plans.find(p => p.id === currentPlanId) || plans.find(p => p.id === 'plan-basic');
  
  const isPaidPlan = currentPlan && currentPlan.price > 0;

  // Mock renewal date logic
  const renewalDate = new Date();
  renewalDate.setDate(renewalDate.getDate() + 30);

  const handleCancel = async () => {
      if (window.confirm("Tem certeza que deseja cancelar sua assinatura Premium? Sua conta voltará para o plano gratuito.")) {
          setLoadingCancel(true);
          await cancelSubscription(); // Now truly reverts to plan-basic in Store and DB
          
          setTimeout(() => {
              setLoadingCancel(false);
              alert("Assinatura cancelada com sucesso.");
              // Ensure UI updates
              useAppStore.getState().fetchData();
          }, 1500);
      }
  };

  const handleSaveNewCard = (e: React.FormEvent) => {
      e.preventDefault();
      setSavingCard(true);
      // Simula request API
      setTimeout(() => {
          setSavingCard(false);
          setIsCardModalOpen(false);
          alert("Novo cartão salvo com sucesso para próximas cobranças.");
      }, 2000);
  };

  return (
    <div>
      <div className="mb-8">
         <h1 className="text-2xl font-bold text-gray-900">Minha Assinatura</h1>
         <p className="text-gray-500">Gerencie seu plano e método de pagamento.</p>
      </div>

      {/* --- CURRENT PLAN STATUS --- */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-12">
         <div className={`p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4 ${isPaidPlan ? 'bg-brand-50' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-4">
               <div className={`p-3 rounded-lg ${isPaidPlan ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' : 'bg-gray-200 text-gray-600'}`}>
                  <Star size={24} fill={isPaidPlan ? "currentColor" : "none"} />
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Plano Atual</p>
                  <h2 className="text-2xl font-bold text-gray-900">{currentPlan?.name}</h2>
               </div>
            </div>
            <div className="text-right">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 w-fit md:ml-auto ${isPaidPlan ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                    {isPaidPlan ? <CheckCircle size={14} /> : null}
                    {isPaidPlan ? 'Assinatura Ativa' : 'Versão Gratuita'}
                </span>
            </div>
         </div>
         
         <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Benefits List */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-brand-600"/> Benefícios Inclusos
                    </h3>
                    <ul className="space-y-3">
                        {currentPlan?.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <div className="bg-white p-1 rounded-full shadow-sm text-green-500"><CheckCircle size={14} /></div>
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Payment & Actions */}
                <div className="flex flex-col h-full">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CreditCard size={18} className="text-brand-600"/> Financeiro
                    </h3>
                    
                    {isPaidPlan ? (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-full flex flex-col">
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm border-b border-gray-200 pb-3">
                                    <span className="text-gray-500">Valor Mensal</span>
                                    <span className="font-bold text-gray-900">$ {currentPlan?.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-gray-200 pb-3">
                                    <span className="text-gray-500">Próxima Renovação</span>
                                    <span className="font-bold text-green-600">{renewalDate.toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Método</span>
                                    <span className="font-bold text-gray-900 flex items-center gap-1"><CreditCard size={14}/> •••• 4242</span>
                                </div>
                            </div>
                            
                            <div className="mt-auto grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => setIsCardModalOpen(true)}
                                    className="flex items-center justify-center gap-2 text-sm bg-white border border-gray-300 text-gray-700 font-bold py-2.5 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <RefreshCcw size={16} /> Alterar Cartão
                                </button>
                                <button 
                                    onClick={handleCancel}
                                    disabled={loadingCancel}
                                    className="flex items-center justify-center gap-2 text-sm bg-white border border-red-200 text-red-600 font-bold py-2.5 rounded-lg hover:bg-red-50 transition"
                                >
                                    {loadingCancel ? <Loader2 size={16} className="animate-spin"/> : <><XCircle size={16} /> Cancelar</>}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 h-full flex flex-col justify-center items-center text-center">
                            <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                <AlertTriangle className="text-blue-500" size={24} />
                            </div>
                            <h4 className="font-bold text-blue-900 mb-1">Faça um Upgrade</h4>
                            <p className="text-xs text-blue-700 mb-4 max-w-xs">
                                Desbloqueie vendas ilimitadas e destaque seus produtos para vender 3x mais rápido.
                            </p>
                            <a href="#planos" className="text-xs font-bold text-blue-600 hover:text-blue-800 underline">Ver opções abaixo</a>
                        </div>
                    )}
                </div>
            </div>
         </div>
      </div>

      {/* CHANGE CARD MODAL */}
      {isCardModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-gray-900">Atualizar Cartão de Crédito</h3>
                      <button onClick={() => setIsCardModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleSaveNewCard} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Novo Número</label>
                          <div className="relative">
                              <CreditCard className="absolute left-3 top-3 text-gray-400" size={18} />
                              <input required type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Validade</label>
                              <input required type="text" placeholder="MM/AA" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">CVV</label>
                              <div className="relative">
                                  <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                                  <input required type="text" placeholder="123" className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                              </div>
                          </div>
                      </div>
                      <div className="pt-2">
                          <button type="submit" disabled={savingCard} className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition flex items-center justify-center gap-2">
                              {savingCard ? <Loader2 className="animate-spin"/> : 'Salvar Novo Cartão'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* --- AVAILABLE PLANS GRID --- */}
      <div id="planos">
          <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Escolha o Plano Ideal</h2>
              <p className="text-gray-500 mt-2">Evolua sua conta conforme suas vendas crescem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.filter(p => p.active).map(plan => {
                  const isCurrent = plan.id === currentPlan?.id;
                  const isPro = plan.id.includes('pro') || plan.price > 20;
                  const isStore = plan.id.includes('store') || plan.price > 50;

                  let borderColor = 'border-gray-200';
                  let headerColor = 'bg-gray-50';
                  let btnColor = 'bg-gray-900 text-white hover:bg-black';
                  let icon = <Star size={20} />;

                  if (isPro) {
                      borderColor = 'border-purple-200 ring-1 ring-purple-100';
                      headerColor = 'bg-purple-50 text-purple-900';
                      btnColor = 'bg-purple-600 text-white hover:bg-purple-700';
                      icon = <Shield size={20} />;
                  }
                  if (isStore) {
                      borderColor = 'border-orange-200 ring-1 ring-orange-100';
                      headerColor = 'bg-orange-50 text-orange-900';
                      btnColor = 'bg-orange-600 text-white hover:bg-orange-700';
                      icon = <CheckCircle size={20} />;
                  }
                  if (isCurrent) {
                      btnColor = 'bg-gray-200 text-gray-500 cursor-not-allowed';
                  }

                  return (
                      <div key={plan.id} className={`bg-white rounded-xl border ${borderColor} shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 relative`}>
                          {plan.id === 'plan-pro' && !isCurrent && (
                              <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10">
                                  MAIS POPULAR
                              </div>
                          )}
                          
                          <div className={`p-6 ${headerColor} border-b border-gray-100`}>
                              <div className="flex items-center justify-between mb-2">
                                  <div className="p-2 bg-white rounded-lg shadow-sm text-gray-700">
                                      {icon}
                                  </div>
                                  {isCurrent && <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">SEU PLANO</span>}
                              </div>
                              <h3 className="text-lg font-bold">{plan.name}</h3>
                              <p className="text-xs opacity-80 mt-1 min-h-[2.5em]">{plan.description}</p>
                          </div>

                          <div className="p-6 flex-1 flex flex-col">
                              <div className="mb-6">
                                  <span className="text-3xl font-bold text-gray-900">
                                      {plan.price === 0 ? 'Grátis' : `$ ${plan.price.toFixed(2)}`}
                                  </span>
                                  {plan.price > 0 && <span className="text-gray-500 text-sm font-medium">/mês</span>}
                              </div>

                              <ul className="space-y-3 mb-8 flex-1">
                                  {plan.benefits.slice(0, 5).map((ben, idx) => (
                                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                          <CheckCircle size={16} className={`shrink-0 mt-0.5 ${isStore ? 'text-orange-500' : isPro ? 'text-purple-500' : 'text-gray-400'}`} />
                                          <span className="leading-tight">{ben}</span>
                                      </li>
                                  ))}
                              </ul>

                              {isCurrent ? (
                                  <button disabled className="w-full py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-400 border border-gray-200 cursor-default">
                                      Plano Atual
                                  </button>
                              ) : (
                                  <Link 
                                    to={plan.price > 0 ? `/checkout-plano/${plan.id}` : '#'}
                                    onClick={(e) => {
                                        if(plan.price === 0) {
                                            e.preventDefault();
                                            handleCancel(); // Downgrade logic called here too
                                        }
                                    }}
                                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md ${btnColor}`}
                                  >
                                      {plan.price === 0 ? 'Mudar para Grátis' : 'Assinar Agora'} <ArrowRight size={16} />
                                  </Link>
                              )}
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
    </div>
  );
};