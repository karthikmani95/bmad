import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser Supabase client that stores the session in cookies.
 * Must use createBrowserClient (not createClient from supabase-js) so the
 * server and middleware can read the session via cookies.
 */
export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey);

/**
 * Singleton for components that need a shared client instance.
 */
export const supabase = createClient();
