import { useState } from 'react';
import type { Weapon } from '../types';
import useApiList from '../hooks/useApiList';
import { Sword, Filter, Star } from 'lucide-react';

const WEAPON_TYPES = ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];

const TYPE_COLORS: Record<string, string> = {
  Sword: 'from-blue-500 to-cyan-500',
  Claymore: 'from-orange-500 to-red-500',
  Polearm: 'from-purple-500 to-pink-500',
  Bow: 'from-green-500 to-emerald-500',
  Catalyst: 'from-violet-500 to-purple-500',
};

export default function WeaponWiki() {

  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedRarity, setSelectedRarity] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const { data, loading } = useApiList<Weapon>(
    '/api/weapons',
    [selectedType, selectedRarity],
    () => ({
      weapon_type: selectedType || undefined,
      rarity: selectedRarity != null ? String(selectedRarity) : undefined,
    })
  );
  const weapons = data ?? [];

  const clearFilters = () => {
    setSelectedType('');
    setSelectedRarity(null);
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Weapon Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Types</option>
                  {WEAPON_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
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
                  <option value="3">3 Star</option>
                  <option value="4">4 Star</option>
                  <option value="5">5 Star</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-400 border-r-transparent"></div>
            <p className="mt-4 text-slate-300">Loading weapons...</p>
          </div>
        ) : weapons.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-300 text-lg">No weapons found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {weapons.map((weapon) => (
              <div
                key={weapon.id}
                className="group bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1"
              >
                <div className={`h-48 bg-gradient-to-br ${TYPE_COLORS[weapon.weapon_type] || 'from-slate-600 to-slate-700'} flex items-center justify-center relative overflow-hidden`}>
                  {weapon.image_url ? (
                    <img src={weapon.image_url} alt={weapon.name} className="h-full w-full object-cover" />
                  ) : (
                    <Sword size={64} className="text-white/30" />
                  )}
                  <div className="absolute top-2 right-2 flex">
                    {Array.from({ length: weapon.rarity }).map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{weapon.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-300">
                      <span className="font-medium text-amber-400">Type:</span> {weapon.weapon_type}
                    </p>
                    <p className="text-slate-300">
                      <span className="font-medium text-amber-400">Base ATK:</span> {weapon.base_attack}
                    </p>
                    {weapon.secondary_stat && (
                      <p className="text-slate-300">
                        <span className="font-medium text-amber-400">Stat:</span> {weapon.secondary_stat}
                      </p>
                    )}
                  </div>
                  {weapon.description && (
                    <p className="mt-3 text-slate-400 text-sm line-clamp-3">{weapon.description}</p>
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
