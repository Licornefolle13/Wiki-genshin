import { useState } from 'react';
import Navigation from './components/Navigation';
import CharacterWiki from './components/CharacterWiki';
import WeaponWiki from './components/WeaponWiki';
import ArtifactWiki from './components/ArtifactWiki';
import InteractiveMap from './components/InteractiveMap';
import { View } from './types';

function App() {
  const [currentView, setCurrentView] = useState<View>('characters');

  const renderView = () => {
    switch (currentView) {
      case 'characters':
        return <CharacterWiki />;
      case 'weapons':
        return <WeaponWiki />;
      case 'artifacts':
        return <ArtifactWiki />;
      case 'map':
        return <InteractiveMap />;
      default:
        return <CharacterWiki />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main>{renderView()}</main>
    </div>
  );
}

export default App;
