import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Factory function for creating a Supabase client.
 * Used by existing starter components.
 */
export const createClient = () => createSupabaseClient(supabaseUrl, supabaseAnonKey);

/**
 * Singleton Supabase client for use in Server Actions and Middleware.
 * Note: In a real production environment, we would use more robust 
 * session management, but for the BMAD prototype, this establishes 
 * the core data connection.
 */
export const supabase = createClient();
