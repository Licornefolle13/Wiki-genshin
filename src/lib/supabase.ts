// Re-export types from `src/types` to preserve compatibility for any
// existing imports of `../lib/supabase` while keeping the frontend
// bundle runtime-free.

export type { Character, Weapon, Artifact, MapMarker } from '../types';
