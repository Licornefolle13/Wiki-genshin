import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Character {
  id: string;
  name: string;
  rarity: number;
  element: string;
  weapon_type: string;
  region: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface Weapon {
  id: string;
  name: string;
  type: string;
  rarity: number;
  base_attack: number;
  secondary_stat: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface Artifact {
  id: string;
  set_name: string;
  piece_type: string;
  two_piece_bonus: string;
  four_piece_bonus: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface MapMarker {
  id: string;
  name: string;
  category: string;
  region: string;
  latitude: number;
  longitude: number;
  description: string;
  icon_type: string;
  created_at: string;
}
