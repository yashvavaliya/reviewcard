import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url_here');
};

// Database types
export interface Database {
  public: {
    Tables: {
      review_cards: {
        Row: {
          id: string;
          business_name: string;
          category: string;
          type: string;
          description: string | null;
          location: string | null;
          slug: string;
          logo_url: string | null;
          google_maps_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          category: string;
          type: string;
          description?: string | null;
          location?: string | null;
          slug: string;
          logo_url?: string | null;
          google_maps_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string;
          category?: string;
          type?: string;
          description?: string | null;
          location?: string | null;
          slug?: string;
          logo_url?: string | null;
          google_maps_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}