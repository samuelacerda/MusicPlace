
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

export const AuthListener: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!supabase) return;

    // 1. Listener de Eventos do Supabase
    // Este é o método mais confiável. Quando o usuário clica no link de e-mail,
    // o Supabase detecta o token e dispara este evento.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        console.log("Evento Supabase: PASSWORD_RECOVERY detectado.");
        // Força a navegação para a tela de redefinição
        navigate('/redefinir-senha', { replace: true });
      }
    });

    // 2. Verificação Manual de Hash (Fallback para HashRouter)
    // Às vezes o HashRouter sobrescreve a URL antes do evento disparar.
    // Se detectarmos os parâmetros de recuperação na URL bruta, forçamos o redirecionamento.
    const hash = window.location.hash;
    if (hash && (hash.includes('type=recovery') || hash.includes('access_token'))) {
        console.log("Hash de recuperação detectado na URL. Redirecionando...");
        // Pequeno delay para garantir que o cliente Supabase processe o token internamente
        setTimeout(() => {
            navigate('/redefinir-senha', { replace: true });
        }, 100);
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location]);

  return null;
};
