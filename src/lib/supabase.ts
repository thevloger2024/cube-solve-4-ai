import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface SolveRecord {
  id: string;
  userId?: string;
  timestamp: number;
  durationMs: number;
  moveCount: number;
  moves: string[];
  scramble?: string;
  method: 'kociemba' | 'beginner' | 'timer';
  isVerified: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  tier: 'free' | 'premium';
  createdAt: string;
}

// Local Storage Fallback for Guest and Offline Sessions
const SOLVE_HISTORY_KEY = 'cs4a_solve_history';

export function getLocalSolveHistory(): SolveRecord[] {
  try {
    const raw = localStorage.getItem(SOLVE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalSolveRecord(record: SolveRecord): void {
  try {
    const history = getLocalSolveHistory();
    history.unshift(record);
    // Keep last 100 solves in local storage
    localStorage.setItem(SOLVE_HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
  } catch (e) {}
}

export async function syncSolveRecord(record: SolveRecord): Promise<void> {
  // Always save locally
  saveLocalSolveRecord(record);

  // If Supabase configured and logged in, sync to cloud
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('solves').insert([
          {
            user_id: user.id,
            duration_ms: record.durationMs,
            move_count: record.moveCount,
            moves: record.moves,
            scramble: record.scramble,
            method: record.method,
            is_verified: record.isVerified,
            created_at: new Date(record.timestamp).toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.warn('Could not sync solve to Supabase:', err);
    }
  }
}
