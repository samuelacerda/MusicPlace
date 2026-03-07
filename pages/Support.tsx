
import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Ticket } from '../types';
import { CheckCircle, AlertTriangle, Upload } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { addTicket } = useAppStore();
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      type: 'Outro',
      subject: '',
      message: '',
      attachment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newId = `SUP-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const ticket: Ticket = {
          id: newId,
          name: formData.name,
          email: formData.email,
          type: formData.type as any,
          subject: formData.subject,
          message: formData.message,
          status: 'open',
          createdAt: new Date().toISOString()
      };

      addTicket(ticket);
      setTicketId(newId);
      setSuccess(true);
  };

  if (success) {
      return (
          <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
              <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Solicitação Recebida!</h1>
                  <p className="text-gray-500 mb-6">Recebemos seu pedido de suporte. Nossa equipe responderá em breve.</p>
                  
                  <div className="bg-gray-100 p-4 rounded-lg mb-6">
                      <p className="text-xs uppercase font-bold text-gray-500">ID do Ticket</p>
                      <p className="text-xl font-mono font-bold text-gray-900">{ticketId}</p>
                  </div>

                  <p className="text-sm text-gray-400">Uma confirmação foi enviada para {formData.email}</p>
                  <button onClick={() => window.location.reload()} className="mt-8 text-brand-600 font-bold hover:underline">Nova Solicitação</button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gray-900 p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Central de Suporte</h1>
                <p className="text-gray-400">Está com problemas? Abra um ticket e vamos te ajudar.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                        <input required type="text" className="w-full p-3 border border-gray-300 rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
                        <input required type="email" className="w-full p-3 border border-gray-300 rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Solicitação</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                        <option value="Tecnico">Problema Técnico</option>
                        <option value="Pagamento">Pagamentos e Cobrança</option>
                        <option value="Conta">Minha Conta</option>
                        <option value="Outro">Outro Assunto</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Assunto</label>
                    <input required type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Resumo do problema" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Mensagem Detalhada</label>
                    <textarea required className="w-full p-3 border border-gray-300 rounded-lg h-32" placeholder="Descreva o que aconteceu..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Anexo (Opcional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Clique para enviar imagem ou print</span>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 shadow-lg">
                        Enviar Solicitação
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};
