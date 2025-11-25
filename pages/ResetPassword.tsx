
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, CheckCircle, Loader2, KeyRound } from 'lucide-react';
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
  const [verifying, setVerifying] = useState(true);

  // Verifica se o usuário chegou aqui autenticado pelo link mágico
  useEffect(() => {
    const checkSession = async () => {
        if (supabase) {
            // O link de e-mail autentica o usuário automaticamente.
            // Verificamos se existe uma sessão ativa.
            const { data } = await supabase.auth.getSession();
            
            if (!data.session) {
                // Se não tem sessão, verifica se o hash ainda está na URL (caso o AuthListener tenha falhado ou delay)
                const hash = window.location.hash;
                if (!hash.includes('access_token') && !hash.includes('type=recovery')) {
                     setError('Link inválido ou expirado. Por favor, solicite uma nova recuperação de senha.');
                }
            }
        }
        setVerifying(false);
    };
    
    // Delay curto para dar tempo ao Supabase processar o token da URL
    setTimeout(checkSession, 500);
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
      // Como o usuário está logado (via link de recuperação), podemos apenas atualizar a senha.
      const result = await updatePassword(password);
      
      if (result.success) {
        setSuccess(true);
        // Redireciona após 3 segundos
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(result.error || 'Ocorreu um erro ao redefinir a senha.');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
      return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50">
              <Loader2 className="animate-spin h-10 w-10 text-brand-600 mb-4" />
              <p className="text-gray-500 font-medium">Validando link de segurança...</p>
          </div>
      );
  }

  if (success) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <CheckCircle size={40} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Senha Alterada!</h1>
                <p className="text-gray-500 mb-8">
                    Sua senha foi atualizada com sucesso. Agora você pode acessar sua conta com a nova credencial.
                </p>
                <button onClick={() => navigate('/login')} className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition">
                    Ir para o Login
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <KeyRound size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Criar Nova Senha</h1>
          <p className="text-gray-500 mt-2">Digite sua nova senha abaixo.</p>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl mb-6 text-center border border-red-100">
            <AlertCircle size={32} className="mx-auto mb-2" />
            <p className="font-bold mb-1">Link Inválido</p>
            <p className="text-sm mb-4">{error}</p>
            <button onClick={() => navigate('/esqueci-senha')} className="text-brand-600 font-bold hover:underline text-sm">
                Solicitar novo link
            </button>
          </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Salvar Nova Senha
                    <ArrowRight className="h-5 w-5" />
                </>
                )}
            </button>
            </form>
        )}
      </div>
    </div>
  );
};
