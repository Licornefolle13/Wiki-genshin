import { useState, useEffect } from 'react';
import type { Character } from '../types';
import useApiList from '../hooks/useApiList';
import { Filter, Star } from 'lucide-react';
import SearchBar from './SearchBar';

const ELEMENTS = ['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'];
const WEAPON_TYPES = ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];
const REGIONS = ['Mondstadt', 'Liyue', 'Inazuma', 'Sumeru', 'Fontaine', 'Natlan', 'Snezhnaya', 'Nod-Krai', 'Unknown'];

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
  // data hook will be initialized after filter state declarations below
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [selectedWeapon, setSelectedWeapon] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedRarity, setSelectedRarity] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const { data, loading } = useApiList<Character>(
    '/api/characters',
    [selectedElement, selectedWeapon, selectedRegion, selectedRarity],
    () => ({
      element: selectedElement || undefined,
      weapon_type: selectedWeapon || undefined,
      region: selectedRegion || undefined,
      rarity: selectedRarity != null ? String(selectedRarity) : undefined,
    })
  );
  const characters = data ?? [];
  const [search, setSearch] = useState('');

  const filteredCharacters = characters.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(s) ||
      (c.element || '').toLowerCase().includes(s) ||
      (c.weapon_type || '').toLowerCase().includes(s) ||
      (c.region || '').toString().toLowerCase().includes(s)
    );
  });



  const clearFilters = () => {
    setSelectedElement('');
    setSelectedWeapon('');
    setSelectedRegion('');
    setSelectedRarity(null);
  };

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCharacter(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);




  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Filter className="text-amber-400" size={24} />
              <h2 className="text-xl font-bold text-white">Filters</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters((s) => !s)}
                className="md:hidden px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-slate-700`}>
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
        </div>

        <div>
          <SearchBar value={search} onChange={setSearch} placeholder="Search characters by name, element or weapon..." />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-400 border-r-transparent"></div>
            <p className="mt-4 text-slate-300">Loading characters...</p>
          </div>
        ) : filteredCharacters.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-300 text-lg">No characters found. Try adjusting your filters or search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map((character) => (
              <div
                key={character.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedCharacter(character)}
                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedCharacter(character); }}
                className="group bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
              >
                <div className={`h-90 md:h-80 bg-gradient-to-br ${ELEMENT_COLORS[character.element] || 'from-slate-600 to-slate-700'} flex items-center justify-center relative overflow-hidden`}>
                  {character.image_url ? (
                    <img
                      src={character.image_url}
                      alt={character.name}
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      className="w-full h-full object-contain object-center border-0 bg-transparent"
                    />
                  ) : (
                    <div className="text-6xl font-bold text-white/20">{character.name[0]}</div>
                  )}
                  <div className="absolute top-2 right-2 flex">
                    {Array.from({ length: character.rarity }).map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
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
                    <p className="mt-auto text-slate-400 text-sm line-clamp-3">{character.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Detail modal for selected character - responsive two-column: details left, image right on md+ */}
        {selectedCharacter && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            role="dialog"
            aria-modal="true"
            aria-label={`Character details for ${selectedCharacter.name}`}
            onClick={() => setSelectedCharacter(null)}
          >
            <div
              className="max-w-4xl w-full mx-4 bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCharacter(null)}
                className="absolute top-4 right-4 bg-slate-800/60 hover:bg-slate-700 text-white rounded-full p-2 z-20"
                aria-label="Close details"
              >
                ✕
              </button>

              <div className="md:flex md:items-stretch">
                {/* Left: details */}
                <div className="md:w-1/2 p-6 flex flex-col justify-start">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedCharacter.name}</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-slate-300">{selectedCharacter.element}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-300">{selectedCharacter.weapon_type}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-300">{selectedCharacter.region}</span>
                    <div className="ml-auto flex items-center">
                      {Array.from({ length: selectedCharacter.rarity }).map((_, i) => (
                        <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  {selectedCharacter.description ? (
                    <p className="text-slate-300 leading-relaxed">{selectedCharacter.description}</p>
                  ) : (
                    <p className="text-slate-400">No description available.</p>
                  )}
                </div>

                {/* Right: image */}
                <div className={`md:w-1/2 bg-gradient-to-br ${ELEMENT_COLORS[selectedCharacter.element] || 'from-slate-600 to-slate-700'} flex items-center justify-center p-6`}>
                  {selectedCharacter.image_url ? (
                    <img
                      src={selectedCharacter.image_url}
                      alt={selectedCharacter.name}
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      // fill the panel width while preserving aspect ratio
                      className="w-full h-auto max-h-[80vh] object-contain object-center"
                    />
                  ) : (
                    <div className="text-8xl font-bold text-white/20">{selectedCharacter.name[0]}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
