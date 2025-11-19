'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/loading-screen';
import MainMenu from '@/components/main-menu';
import Game from '@/components/game';
import CreditsScreen from '@/components/credits-screen';
import SettingsScreen from '@/components/settings-screen';

export default function Home() {
  const [gameState, setGameState] = useState<'loading' | 'menu' | 'game' | 'credits' | 'settings'>('loading');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState('menu');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayGame = () => {
    localStorage.removeItem('subhan_game_progress');
    setGameState('game');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      {gameState === 'loading' && <LoadingScreen />}
      {gameState === 'menu' && (
        <MainMenu
          onPlay={handlePlayGame}
          onCredits={() => setGameState('credits')}
          onSettings={() => setGameState('settings')}
        />
      )}
      {gameState === 'game' && (
        <Game
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onQuit={handleBackToMenu}
        />
      )}
      {gameState === 'credits' && <CreditsScreen onBack={handleBackToMenu} />}
      {gameState === 'settings' && (
        <SettingsScreen
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          musicEnabled={musicEnabled}
          setMusicEnabled={setMusicEnabled}
          onBack={handleBackToMenu}
        />
      )}
    </div>
  );
}
