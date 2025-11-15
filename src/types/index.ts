

export type View = 'characters' | 'weapons' | 'artifacts' | 'map';

export interface FilterState {
  element?: string;
  weaponType?: string;
  region?: string;
  rarity?: number;
}

export interface Character {
  id: number;
  name: string;
  rarity: number;
  element: string;
  weapon_type: string;
  region?: string | null;
  description?: string | null;
  image_url?: string | null;
  created_at?: string | null;
}

export interface Weapon {
  id: number;
  name: string;
  weapon_type: string;
  rarity: number;
  base_attack?: number | null;
  secondary_stat?: string | null;
  description?: string | null;
  image_url?: string | null;
  created_at?: string | null;
}

export interface Artifact {
  id: number;
  set_name: string;
  piece_type: string;
  piece_name?: string | null;
  set_id?: number | null;
  rarity?: string | number | null;
  two_piece_bonus?: string | null;
  four_piece_bonus?: string | null;
  description?: string | null;
  image_url?: string | null;
  created_at?: string | null;
}
