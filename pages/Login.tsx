
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../services/supabase';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        if (result.error?.includes("Email not confirmed")) {
             setError("Conta criada, mas pendente de confirmação. Verifique seu e-mail ou desative 'Confirm email' no painel do Supabase.");
        } else {
             setError(result.error || 'E-mail ou senha inválidos.');
        }
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar fazer login.');
    } finally {
      setLoading(false);
    }
  };

  const handleForceCreateAdmin = async () => {
    if (!supabase) {
        setError("Erro: Conexão com banco de dados não configurada.");
        return;
    }

    setAdminLoading(true);
    setError('');
    
    // Novo e-mail para contornar o problema de e-mail não confirmado
    const adminEmail = 'admin.root@musicplace.com';
    const adminPass = 'Samuka4338';

    try {
        console.log("Tentando criar admin diretamente no Supabase...");

        // 1. Tenta Criar o Usuário (Auth)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: adminEmail,
            password: adminPass,
            options: {
                data: {
                    name: 'Admin Root',
                    role: 'admin', // Trigger do banco vai pegar isso
                    accountType: 'professional',
                    phone: '11999999999',
                    state: 'SP',
                    city: 'São Paulo'
                }
            }
        });

        // Optimization: Se o signUp retornar sessão, usa direto (evita login duplo)
        if (authData.session) {
             console.log("Usuário criado e logado com sucesso.");
             await login(adminEmail, adminPass);
             alert(`Sucesso! Admin criado/logado.\nE-mail: ${adminEmail}\nSenha: ${adminPass}`);
             navigate('/');
             return;
        }

        if (authError) {
            // Se o usuário já existe, tentamos apenas logar
            if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
                console.log("Usuário já existe. Tentando logar...");
            } else {
                throw new Error(authError.message);
            }
        }

        // 2. Tenta Logar (Fallback)
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: adminPass
        });

        if (loginError) throw loginError;

        // 3. Garante que o Perfil existe e é Admin (Força Bruta via Upsert)
        if (loginData.user) {
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: loginData.user.id,
                email: adminEmail,
                name: 'Admin Root',
                role: 'admin',
                account_type: 'professional',
                phone: '11999999999',
                state: 'SP',
                city: 'São Paulo',
                is_banned: false
            });
            
            if (profileError) {
                console.error("Erro ao atualizar perfil:", profileError);
                // Não interrompe o fluxo, pois o trigger pode ter funcionado
            }
        }

        // 4. Atualiza estado local através do login da store
        await login(adminEmail, adminPass);
        alert(`Sucesso! Admin criado/logado.\nE-mail: ${adminEmail}\nSenha: ${adminPass}`);
        navigate('/');

    } catch (e: any) {
        console.error(e);
        setError('Erro crítico ao criar Admin: ' + e.message);
    } finally {
        setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h1>
          <p className="text-gray-500 mt-2">Entre na sua conta MusicPlace</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-start gap-2 whitespace-pre-line">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
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
            <div className="flex justify-end mt-2">
              <Link to="/esqueci-senha" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 text-white font-bold py-3.5 rounded-xl hover:bg-brand-600 transition shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <>
                Entrar
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600">
            Ainda não tem uma conta?{' '}
            <Link to="/cadastro" className="text-brand-600 font-bold hover:text-brand-700">
              Criar conta grátis
            </Link>
          </p>
        </div>

        {/* Botão de Resgate para Configuração Inicial (Pode ser removido em produção) */}
        <div className="mt-8 pt-6 border-t border-gray-100">
            <button 
                onClick={handleForceCreateAdmin}
                disabled={adminLoading}
                className="w-full bg-gray-100 text-gray-600 text-xs font-bold py-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 border border-gray-200"
            >
                {adminLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <ShieldAlert size={14} />}
                🔧 RESGATE: Criar Admin Master
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2">
                Use este botão se estiver travado no login.<br/>
                Cria usuário: <strong>admin.root@musicplace.com</strong>
            </p>
        </div>
      </div>
    </div>
  );
};
