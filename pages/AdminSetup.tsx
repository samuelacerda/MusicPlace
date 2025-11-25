
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAppStore } from '../store/useAppStore';

export const AdminSetup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
        setError('As senhas não conferem.');
        setLoading(false);
        return;
    }

    if (formData.password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        setLoading(false);
        return;
    }

    if (!supabase) {
        setError('Erro de configuração: Supabase não conectado.');
        setLoading(false);
        return;
    }

    try {
        // 1. Create User with explicit metadata
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    name: formData.name,
                    role: 'admin', // Trigger uses this
                    accountType: 'professional'
                }
            }
        });

        if (authError) throw authError;

        // 2. Handle Login Flow
        if (authData.user) {
            // If email confirmation is OFF, we get a session immediately
            if (authData.session) {
                await login(formData.email, formData.password);
                setSuccess(true);
                setTimeout(() => navigate('/admin'), 2000);
            } else {
                // If email confirmation is ON, we don't get a session
                setError("Conta criada, mas o Supabase exige confirmação de e-mail.\nSiga as instruções abaixo para desativar essa exigência.");
                setLoading(false);
            }
        }

    } catch (err: any) {
        console.error("Admin Setup Error:", err);
        setError(err.message || 'Erro ao criar administrador.');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-gray-800">
                    <Shield size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Configuração de Admin</h1>
                <p className="text-gray-500 text-sm mt-2">
                    Crie um novo usuário com acesso total.
                </p>
            </div>

            {success ? (
                <div className="text-center p-4 bg-green-50 rounded-xl text-green-700 animate-fadeIn">
                    <CheckCircle size={40} className="mx-auto mb-2" />
                    <p className="font-bold">Administrador Criado!</p>
                    <p className="text-sm">Redirecionando para o painel...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 whitespace-pre-line">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nome Completo</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                required 
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                                placeholder="Seu Nome"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">E-mail de Acesso</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="email" 
                                required 
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="password" 
                                required 
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                                placeholder="Mínimo 6 caracteres"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirmar Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="password" 
                                required 
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                                placeholder="Repita a senha"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition shadow-lg flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Criar Administrador'}
                    </button>
                </form>
            )}

            {/* TROUBLESHOOTING GUIDE */}
            <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                    <h3 className="font-bold text-yellow-800 text-sm flex items-center gap-2 mb-2">
                        <AlertCircle size={16} /> 
                        Dica: Desativar Confirmação de E-mail
                    </h3>
                    <p className="text-xs text-yellow-700 mb-2">
                        Para conseguir entrar direto sem validar e-mail, altere essa configuração no Supabase:
                    </p>
                    <ol className="list-decimal pl-4 text-xs text-yellow-800 space-y-1 font-medium">
                        <li>Acesse <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline">Supabase Dashboard</a>.</li>
                        <li>Vá em <strong>Authentication</strong> {'>'} <strong>Providers</strong>.</li>
                        <li>Clique em <strong>Email</strong>.</li>
                        <li>Desative a opção <strong>Confirm email</strong>.</li>
                        <li>Clique em <strong>Save</strong> e tente criar o usuário novamente.</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
  );
};
