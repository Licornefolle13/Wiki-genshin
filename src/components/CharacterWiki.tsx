import { useState, useEffect } from 'react';
import { supabase, Character } from '../lib/supabase';
import { Filter, Star } from 'lucide-react';

const ELEMENTS = ['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'];
const WEAPON_TYPES = ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];
const REGIONS = ['Mondstadt', 'Liyue', 'Inazuma', 'Sumeru', 'Fontaine', 'Natlan', 'Snezhnaya'];

const ELEMENT_COLORS: Record<string, string> = {
  Pyro: 'from-red-500 to-orange-500',
  Hydro: 'from-blue-500 to-cyan-500',
  Anemo: 'from-teal-400 to-emerald-400',
  Electro: 'from-purple-500 to-violet-500',
  Dendro: 'from-green-500 to-lime-500',
  Cryo: 'from-cyan-400 to-blue-400',
  Geo: 'from-yellow-600 to-amber-600',
};

export default function CharacterWiki() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [selectedWeapon, setSelectedWeapon] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedRarity, setSelectedRarity] = useState<number | null>(null);

  useEffect(() => {
    fetchCharacters();
  }, [selectedElement, selectedWeapon, selectedRegion, selectedRarity]);

  async function fetchCharacters() {
    setLoading(true);
    let query = supabase.from('characters').select('*').order('name');

    if (selectedElement) {
      query = query.eq('element', selectedElement);
    }
    if (selectedWeapon) {
      query = query.eq('weapon_type', selectedWeapon);
    }
    if (selectedRegion) {
      query = query.eq('region', selectedRegion);
    }
    if (selectedRarity) {
      query = query.eq('rarity', selectedRarity);
    }

    const { data, error } = await query;
    if (!error && data) {
      setCharacters(data);
    }
    setLoading(false);
  }

  const clearFilters = () => {
    setSelectedElement('');
    setSelectedWeapon('');
    setSelectedRegion('');
    setSelectedRarity(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-2xl border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="text-amber-400" size={24} />
              <h2 className="text-xl font-bold text-white">Filters</h2>
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Element</label>
              <select
                value={selectedElement}
                onChange={(e) => setSelectedElement(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Elements</option>
                {ELEMENTS.map((elem) => (
                  <option key={elem} value={elem}>
                    {elem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Weapon</label>
              <select
                value={selectedWeapon}
                onChange={(e) => setSelectedWeapon(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Weapons</option>
                {WEAPON_TYPES.map((weapon) => (
                  <option key={weapon} value={weapon}>
                    {weapon}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Regions</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Rarity</label>
              <select
                value={selectedRarity || ''}
                onChange={(e) => setSelectedRarity(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Rarities</option>
                <option value="4">4 Star</option>
                <option value="5">5 Star</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-400 border-r-transparent"></div>
            <p className="mt-4 text-slate-300">Loading characters...</p>
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-300 text-lg">No characters found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((character) => (
              <div
                key={character.id}
                className="group bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
              >
                <div className={`h-48 bg-gradient-to-br ${ELEMENT_COLORS[character.element] || 'from-slate-600 to-slate-700'} flex items-center justify-center relative overflow-hidden`}>
                  {character.image_url ? (
                    <img src={character.image_url} alt={character.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-6xl font-bold text-white/20">{character.name[0]}</div>
                  )}
                  <div className="absolute top-2 right-2 flex">
                    {Array.from({ length: character.rarity }).map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{character.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-300">
                      <span className="font-medium text-amber-400">Element:</span> {character.element}
                    </p>
                    <p className="text-slate-300">
                      <span className="font-medium text-amber-400">Weapon:</span> {character.weapon_type}
                    </p>
                    <p className="text-slate-300">
                      <span className="font-medium text-amber-400">Region:</span> {character.region}
                    </p>
                  </div>
                  {character.description && (
                    <p className="mt-3 text-slate-400 text-sm line-clamp-3">{character.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
