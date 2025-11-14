export type View = 'characters' | 'weapons' | 'artifacts' | 'map';

export interface FilterState {
  element?: string;
  weaponType?: string;
  region?: string;
  rarity?: number;
}

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
  weapon_type: string;
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
  lat: number;
  lng: number;
  description: string;
  icon_type: string;
  created_at: string;
}
