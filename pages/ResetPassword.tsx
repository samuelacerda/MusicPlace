
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../services/supabase';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAppStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Check if user is authenticated via the link
  useEffect(() => {
    const checkSession = async () => {
        if (supabase) {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                // Redirect if no session (invalid link or expired)
                // Note: In hash router, we might be on the page but not yet processed the hash.
                // Supabase client handles hash automatically, so we wait a bit or check url.
                const hash = window.location.hash;
                if (!hash || (!hash.includes('access_token') && !hash.includes('type=recovery'))) {
                     setError('Link inválido ou expirado. Por favor, solicite uma nova recuperação.');
                }
            }
        }
        setSessionLoading(false);
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
        setError('As senhas não conferem.');
        setLoading(false);
        return;
    }

    if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        setLoading(false);
        return;
    }
    
    try {
      // Since user is logged in via the recovery link, we can just update the password
      const result = await updatePassword(password);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('/'), 3000);
      } else {
        setError(result.error || 'Ocorreu um erro ao redefinir a senha.');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
      return (
          <div className="min-h-[80vh] flex items-center justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-brand-600" />
          </div>
      );
  }

  if (success) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Senha Redefinida!</h1>
                <p className="text-gray-500 mb-6">
                    Sua senha foi alterada com sucesso. Você será redirecionado para a página inicial em instantes.
                </p>
                <button onClick={() => navigate('/')} className="text-brand-600 font-bold hover:underline">
                    Ir para o Início agora
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nova Senha</h1>
          <p className="text-gray-500 mt-2">Crie uma nova senha segura para sua conta.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!error}
            className="w-full bg-brand-500 text-white font-bold py-3.5 rounded-xl hover:bg-brand-600 transition shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <>
                Redefinir Senha
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
