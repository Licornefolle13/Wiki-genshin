// Minimal placeholder component: the interactive map has been replaced by
// an external map. Update `EXTERNAL_MAP_URL` to point to your map provider.
const EXTERNAL_MAP_URL = 'https://genshin-impact-map.appsample.com/';

export default function InteractiveMap() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-slate-800/60 rounded-xl p-8 shadow-lg border border-slate-700 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Interactive Map</h2>
        <p className="text-slate-300 mb-6">The interactive map has been moved to an external site.</p>
        <a
          href={EXTERNAL_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-600 transition-colors"
        >
          Open Map
        </a>
        <p className="text-xs text-slate-400 mt-4">Edit this file to change the external URL.</p>
      </div>
    </div>
  );
}
