
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

export const AuthListener: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!supabase) return;

    // 1. Verificação Manual de Hash (Correção para HashRouter)
    // O Supabase envia: domain.com/#access_token=...&type=recovery
    // O HashRouter acha que a rota é "/access_token=..." e falha, indo para Home.
    // Aqui interceptamos isso manualmente.
    const hash = window.location.hash;
    if (hash && (hash.includes('type=recovery') || hash.includes('access_token'))) {
        console.log("Token de recuperação detectado na URL. Redirecionando para redefinição...");
        // Pequeno delay para garantir que o Supabase Client processe o token da URL
        setTimeout(() => {
            navigate('/redefinir-senha');
        }, 500);
    }

    // 2. Listener Padrão do Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        console.log("Evento Supabase: PASSWORD_RECOVERY");
        navigate('/redefinir-senha');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location]);

  return null;
};
