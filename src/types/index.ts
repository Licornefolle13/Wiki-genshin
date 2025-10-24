export type View = 'characters' | 'weapons' | 'artifacts' | 'map';

export interface FilterState {
  element?: string;
  weaponType?: string;
  region?: string;
  rarity?: number;
}
