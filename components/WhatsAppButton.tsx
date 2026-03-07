
import React, { useState } from 'react';
import { MessageCircle, X, User, Bot, Headphones } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const WhatsAppButton: React.FC = () => {
  const { systemSettings } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const config = systemSettings.whatsappConfig;
  
  if (!config?.enabled) return null;

  const handleOptionClick = (type: 'support' | 'contact' | 'robot') => {
    let message = "";
    let number = config.humanAgentNumber;

    if (type === 'robot') {
        // Mock robot interaction
        alert(`Iniciando chat com o Robô: ${config.welcomeMessage}`);
        return;
    } else if (type === 'support') {
        message = "Olá, preciso de suporte técnico.";
    } else {
        message = "Olá, gostaria de entrar em contato.";
    }

    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
       {isOpen && (
         <div className="bg-white rounded-xl shadow-2xl border border-gray-100 mb-4 overflow-hidden w-64 animate-fadeIn">
            <div className="bg-green-600 p-4 text-white">
               <h3 className="font-bold">Atendimento WhatsApp</h3>
               <p className="text-xs text-green-100">Escolha uma opção:</p>
            </div>
            <div className="p-2">
               <button onClick={() => handleOptionClick('robot')} className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Bot size={18} /></div>
                  <div>
                     <p className="text-sm font-bold text-gray-900">Assistente Virtual</p>
                     <p className="text-xs text-gray-500">Resposta imediata</p>
                  </div>
               </button>
               <button onClick={() => handleOptionClick('support')} className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition">
                  <div className="bg-purple-100 p-2 rounded-full text-purple-600"><Headphones size={18} /></div>
                  <div>
                     <p className="text-sm font-bold text-gray-900">Suporte Técnico</p>
                     <p className="text-xs text-gray-500">Falar com atendente</p>
                  </div>
               </button>
               <button onClick={() => handleOptionClick('contact')} className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition">
                  <div className="bg-green-100 p-2 rounded-full text-green-600"><User size={18} /></div>
                  <div>
                     <p className="text-sm font-bold text-gray-900">Contato Geral</p>
                     <p className="text-xs text-gray-500">Falar com vendas</p>
                  </div>
               </button>
            </div>
         </div>
       )}

       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center relative"
       >
          {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
          {!isOpen && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
       </button>
    </div>
  );
};
