/**
 * Supabase client configuration for Amapati Marketplace
 * 
 * Works seamlessly whether deployed to Vercel with live Supabase credentials
 * or running with local persistent state.
 */

export interface SupabaseConfig {
  url: string | null;
  anonKey: string | null;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = import.meta.env.VITE_SUPABASE_URL || null;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || null;

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('http')),
  };
};

export const isSupabaseLive = (): boolean => {
  return getSupabaseConfig().isConfigured;
};
