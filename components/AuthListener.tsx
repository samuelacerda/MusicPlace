
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export const AuthListener: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) return;

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Se o usuário clicar no link de recuperação de senha do e-mail
      if (event === 'PASSWORD_RECOVERY') {
        console.log("Evento de Recuperação de Senha detectado. Redirecionando...");
        navigate('/redefinir-senha');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return null; // Este componente não renderiza nada visualmente
};
