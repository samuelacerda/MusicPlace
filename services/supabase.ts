import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DO SUPABASE ---
// COLE SUAS CHAVES AQUI
const supabaseUrl = 'https://eswiqcppobcnmqfqltui.supabase.co' as string;
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzd2lxY3Bwb2Jjbm1xZnFsdHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NjU5NTEsImV4cCI6MjA3OTM0MTk1MX0.2JitUmjdzZDFSS8bql55YXs-imUuP4m3igIhkr8V4ao' as string;

// Verifica se as chaves foram preenchidas
const isConfigured = supabaseUrl && supabaseUrl !== '' && supabaseKey && supabaseKey !== '';

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true, // Mantém o usuário logado
        autoRefreshToken: true, // Atualiza o token automaticamente
        detectSessionInUrl: true // Detecta links mágicos de email
      }
    }) 
  : null;

export const isSupabaseConfigured = () => {
  return !!supabase;
};