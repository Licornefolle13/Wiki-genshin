import { useState, useEffect } from 'react';
import { supabase, MapMarker } from '../lib/supabase';
import { MapPin, Filter, Eye, EyeOff } from 'lucide-react';

const CATEGORIES = [
  { id: 'oculus', label: 'Oculus', color: 'bg-cyan-500' },
  { id: 'chest', label: 'Chests', color: 'bg-amber-500' },
  { id: 'boss', label: 'Bosses', color: 'bg-red-500' },
  { id: 'resource', label: 'Resources', color: 'bg-green-500' },
  { id: 'teleport', label: 'Teleports', color: 'bg-blue-500' },
  { id: 'domain', label: 'Domains', color: 'bg-purple-500' },
];

const REGIONS = ['Mondstadt', 'Liyue', 'Inazuma', 'Sumeru', 'Fontaine', 'Natlan'];

export default function InteractiveMap() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map((c) => c.id))
  );
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  useEffect(() => {
    fetchMarkers();
  }, [selectedCategory, selectedRegion]);

  async function fetchMarkers() {
    setLoading(true);
    let query = supabase.from('map_markers').select('*');

    if (selectedCategory) {
      query = query.eq('category', selectedCategory);
    }
    if (selectedRegion) {
      query = query.eq('region', selectedRegion);
    }

    const { data, error } = await query;
    if (!error && data) {
      setMarkers(data);
    }
    setLoading(false);
  }

  const toggleCategory = (categoryId: string) => {
    const newVisible = new Set(visibleCategories);
    if (newVisible.has(categoryId)) {
      newVisible.delete(categoryId);
    } else {
      newVisible.add(categoryId);
    }
    setVisibleCategories(newVisible);
  };

  const filteredMarkers = markers.filter((marker) => visibleCategories.has(marker.category));

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedRegion('');
    setVisibleCategories(new Set(CATEGORIES.map((c) => c.id)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Filter className="text-amber-400" size={20} />
                  <h2 className="text-lg font-bold text-white">Filters</h2>
                </div>
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Region</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  <label className="block text-sm font-medium text-slate-300 mb-3">Categories</label>
                  <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                          visibleCategories.has(category.id)
                            ? 'bg-slate-700 border border-slate-600'
                            : 'bg-slate-800 border border-slate-700 opacity-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                          <span className="text-white text-sm">{category.label}</span>
                        </div>
                        {visibleCategories.has(category.id) ? (
                          <Eye size={16} className="text-amber-400" />
                        ) : (
                          <EyeOff size={16} className="text-slate-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-3">Legend</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p>Click markers to view details</p>
                <p>Use filters to find specific locations</p>
                <p>Toggle categories to show/hide markers</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
              <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Teyvat Interactive Map</h2>
                <p className="text-slate-400 text-sm mt-1">
                  {filteredMarkers.length} marker{filteredMarkers.length !== 1 ? 's' : ''} visible
                </p>
              </div>

              <div className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 aspect-[16/10]">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-400 border-r-transparent"></div>
                      <p className="mt-4 text-slate-300">Loading map...</p>
                    </div>
                  </div>
                ) : filteredMarkers.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No markers found</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 p-8">
                    <div className="relative w-full h-full bg-slate-800/30 rounded-lg border-2 border-slate-600 overflow-hidden">
                      {filteredMarkers.map((marker) => {
                        const category = CATEGORIES.find((c) => c.id === marker.category);
                        const x = (marker.longitude + 180) / 360;
                        const y = (90 - marker.latitude) / 180;

                        return (
                          <div
                            key={marker.id}
                            onMouseEnter={() => setHoveredMarker(marker.id)}
                            onMouseLeave={() => setHoveredMarker(null)}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125"
                            style={{
                              left: `${x * 100}%`,
                              top: `${y * 100}%`,
                            }}
                          >
                            <div className={`w-4 h-4 rounded-full ${category?.color || 'bg-gray-500'} border-2 border-white shadow-lg`}></div>
                            {hoveredMarker === marker.id && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-10">
                                <p className="font-bold">{marker.name}</p>
                                <p className="text-slate-400 text-xs">{marker.region}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute top-4 right-4 bg-slate-900/90 px-4 py-3 rounded-lg border border-slate-700">
                      <p className="text-white text-sm font-medium">Map Grid</p>
                      <p className="text-slate-400 text-xs mt-1">Teyvat World</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {CATEGORIES.filter((c) => visibleCategories.has(c.id)).map((category) => {
                    const count = filteredMarkers.filter((m) => m.category === category.id).length;
                    return (
                      <div
                        key={category.id}
                        className="bg-slate-700/50 rounded-lg p-3 border border-slate-600"
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                          <span className="text-white font-medium text-sm">{category.label}</span>
                        </div>
                        <p className="text-slate-400 text-xs">{count} locations</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
