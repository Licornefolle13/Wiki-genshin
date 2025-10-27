import { useState, useEffect } from 'react';
import { Artifact } from '../lib/supabase';
import { Shield, Filter } from 'lucide-react';

const PIECE_TYPES = ['Flower', 'Feather', 'Sands', 'Goblet', 'Circlet'];

export default function ArtifactWiki() {
  // artifacts list not needed once grouped; keep only groupedArtifacts
  const [loading, setLoading] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState<string>('');
  const [groupedArtifacts, setGroupedArtifacts] = useState<Record<string, Artifact[]>>({});
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    fetchArtifacts();
  }, [selectedPiece]);

  async function fetchArtifacts() {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedPiece) params.set('piece_type', selectedPiece);
    const res = await fetch(`/api/artifacts?${params.toString()}`);
    if (res.ok) {
      const data = await res.json() as Artifact[];
      const grouped = data.reduce((acc: Record<string, Artifact[]>, artifact: Artifact) => {
        if (!acc[artifact.set_name]) {
          acc[artifact.set_name] = [];
        }
        acc[artifact.set_name].push(artifact);
        return acc;
      }, {} as Record<string, Artifact[]>);
      setGroupedArtifacts(grouped);
    } else {
      console.error('Failed to fetch artifacts', await res.text());
    }
    setLoading(false);
  }

  const clearFilters = () => {
    setSelectedPiece('');
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Piece Type</label>
              <select
                value={selectedPiece}
                onChange={(e) => setSelectedPiece(e.target.value)}
                className="w-full md:w-1/3 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Pieces</option>
                {PIECE_TYPES.map((piece) => (
                  <option key={piece} value={piece}>
                    {piece}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-400 border-r-transparent"></div>
            <p className="mt-4 text-slate-300">Loading artifacts...</p>
          </div>
        ) : Object.keys(groupedArtifacts).length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-300 text-lg">No artifacts found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedArtifacts).map(([setName, pieces]) => {
              const firstPiece = pieces[0];
              return (
                <div
                  key={setName}
                  className="bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-amber-500 transition-all duration-300"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Shield size={24} className="text-white" />
                      <h3 className="text-2xl font-bold text-white">{setName}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <h4 className="text-amber-400 font-semibold mb-2 flex items-center space-x-2">
                          <span className="text-xl">2</span>
                          <span>Piece Bonus</span>
                        </h4>
                        <p className="text-slate-300 text-sm">
                          {firstPiece.two_piece_bonus || 'No bonus information available'}
                        </p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <h4 className="text-amber-400 font-semibold mb-2 flex items-center space-x-2">
                          <span className="text-xl">4</span>
                          <span>Piece Bonus</span>
                        </h4>
                        <p className="text-slate-300 text-sm">
                          {firstPiece.four_piece_bonus || 'No bonus information available'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-3">Artifact Pieces</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {pieces.map((piece) => (
                          <div
                            key={piece.id}
                            className="bg-slate-700/30 rounded-lg p-3 border border-slate-600 hover:border-amber-500 transition-colors text-center"
                          >
                            <div className="text-3xl mb-2">
                              {piece.piece_type === 'Flower' && '🌸'}
                              {piece.piece_type === 'Feather' && '🪶'}
                              {piece.piece_type === 'Sands' && '⏳'}
                              {piece.piece_type === 'Goblet' && '🏺'}
                              {piece.piece_type === 'Circlet' && '👑'}
                            </div>
                            <p className="text-slate-300 text-sm font-medium">{piece.piece_type}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
