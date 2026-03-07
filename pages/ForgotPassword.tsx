
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const ForgotPassword: React.FC = () => {
  const { requestPasswordReset } = useAppStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await requestPasswordReset(email);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Ocorreu um erro ao solicitar a recuperação.');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">E-mail Enviado!</h1>
                <p className="text-gray-500 mb-6">
                    Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá um link de recuperação em instantes.
                </p>
                <div className="bg-blue-50 text-blue-700 text-sm p-4 rounded-lg mb-6">
                    Não esqueça de verificar sua caixa de <strong>Spam</strong> ou Lixo Eletrônico.
                </div>
                <Link to="/login" className="text-brand-600 font-bold hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft size={16} /> Voltar para o Login
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recuperar Senha</h1>
          <p className="text-gray-500 mt-2">Informe seu e-mail para receber um link de redefinição.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail cadastrado</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 text-white font-bold py-3.5 rounded-xl hover:bg-brand-600 transition shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <>
                Enviar Link
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium text-sm flex items-center justify-center gap-1">
             <ArrowLeft size={16} /> Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
};
