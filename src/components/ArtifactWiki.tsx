import { useState, useEffect } from 'react';
import type { Artifact } from '../types';
import useApiList from '../hooks/useApiList';
import { Shield, Filter } from 'lucide-react';

const PIECE_TYPES = ['Flower', 'Feather', 'Sands', 'Goblet', 'Circlet'];

export default function ArtifactWiki() {
  // artifacts list not needed once grouped; keep only groupedArtifacts

  const [selectedPiece, setSelectedPiece] = useState<string>('');
  const [groupedArtifacts, setGroupedArtifacts] = useState<Record<string, Artifact[]>>({});
  const [showFilters, setShowFilters] = useState(true);
  const [openPiece, setOpenPiece] = useState<Artifact | null>(null);

  const { data, loading } = useApiList<Artifact>(
    '/api/artifacts',
    [selectedPiece],
    () => ({ piece_type: selectedPiece || undefined })
  );

  useEffect(() => {
    const grouped: Record<string, Artifact[]> = {};
    (data ?? []).forEach((artifact) => {
      if (!grouped[artifact.set_name]) grouped[artifact.set_name] = [];
      grouped[artifact.set_name].push(artifact);
    });
    setGroupedArtifacts(grouped);
  }, [data]);

  // close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenPiece(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
                            role="button"
                            tabIndex={0}
                            onClick={() => setOpenPiece(piece)}
                            onKeyDown={(e) => { if (e.key === 'Enter') setOpenPiece(piece); }}
                            className="bg-slate-700/30 rounded-lg p-3 border border-slate-600 hover:border-amber-500 transition-colors text-center flex flex-col items-center cursor-pointer"
                          >
                            <div className="w-full h-28 mb-2 flex items-center justify-center bg-slate-800 rounded-md overflow-hidden">
                              {piece.image_url ? (
                                // show image (object-contain to preserve aspect)
                                <img
                                  src={piece.image_url}
                                  alt={piece.piece_name || piece.piece_type}
                                  className="max-h-full w-auto object-contain"
                                  loading="lazy"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                              ) : (
                                <div className="text-3xl">
                                  {piece.piece_type === 'Flower' && '🌸'}
                                  {piece.piece_type === 'Feather' && '🪶'}
                                  {piece.piece_type === 'Sands' && '⏳'}
                                  {piece.piece_type === 'Goblet' && '🏺'}
                                  {piece.piece_type === 'Circlet' && '👑'}
                                </div>
                              )}
                            </div>
                            <p className="text-slate-300 text-sm font-medium">{piece.piece_name || piece.piece_type}</p>
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
        {/* Piece details modal */}
        {openPiece && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpenPiece(null)}
          >
            <div
              className="max-w-3xl w-full mx-4 bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex items-start gap-6">
                <div className="w-1/3">
                  {openPiece.image_url ? (
                    <img
                      src={openPiece.image_url}
                      alt={openPiece.piece_name || openPiece.piece_type}
                      className="w-full h-auto object-contain rounded-md bg-slate-800"
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-slate-800 rounded-md text-4xl">{openPiece.piece_type === 'Flower' ? '🌸' : openPiece.piece_type === 'Feather' ? '🪶' : openPiece.piece_type === 'Sands' ? '⏳' : openPiece.piece_type === 'Goblet' ? '🏺' : '👑'}</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{openPiece.piece_name || openPiece.piece_type}</h3>
                      <p className="text-slate-300 text-sm">{openPiece.piece_type} • {openPiece.set_name}</p>
                    </div>
                    <button
                      onClick={() => setOpenPiece(null)}
                      className="ml-4 text-slate-400 hover:text-white bg-slate-800 rounded-md px-3 py-1"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-4 text-slate-300">
                    <p className="mb-3">{openPiece.description || 'No description available.'}</p>
                    <div className="mt-4">
                      <h4 className="text-amber-400 font-semibold">Set Bonuses</h4>
                      <p className="text-slate-300 text-sm">2-piece: {openPiece.two_piece_bonus || '—'}</p>
                      <p className="text-slate-300 text-sm">4-piece: {openPiece.four_piece_bonus || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
