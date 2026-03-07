
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
  };

  if (submitted) {
      return (
          <div className="min-h-[60vh] flex items-center justify-center px-4">
              <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Mensagem Enviada!</h2>
                  <p className="text-gray-500 mt-2">Obrigado pelo contato. Retornaremos em breve.</p>
                  <button onClick={() => window.location.reload()} className="mt-6 text-brand-600 font-bold hover:underline">Voltar</button>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Fale Conosco</h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Tem alguma dúvida, sugestão ou parceria? Estamos prontos para te ouvir. 
                    Preencha o formulário ou utilize nossos canais diretos.
                </p>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center">
                            <Mail size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">E-mail</p>
                            <p className="text-gray-600">contato@musicplace.com.br</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center">
                            <Phone size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Telefone / WhatsApp</p>
                            <p className="text-gray-600">(11) 99999-9999</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Escritório</p>
                            <p className="text-gray-600">Av. Paulista, 1000 - São Paulo, SP</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                        <input required type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Seu nome" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
                        <input required type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="seu@email.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Assunto</label>
                        <input required type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Motivo do contato" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Mensagem</label>
                        <textarea required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none h-32" placeholder="Escreva sua mensagem..." />
                    </div>
                    <button type="submit" className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 shadow-lg transition">
                        Enviar Mensagem
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};
