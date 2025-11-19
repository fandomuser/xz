'use client';

import { useState, useEffect } from 'react';
import GameScreen from './game-screen';
import { getStoryData, saveGameProgress, loadGameProgress } from '@/lib/story-engine';

interface GameProps {
  soundEnabled: boolean;
  musicEnabled: boolean;
  onQuit: () => void;
}

export default function Game({ soundEnabled, musicEnabled, onQuit }: GameProps) {
  const [currentSceneId, setCurrentSceneId] = useState('intro');
  const [choices, setChoices] = useState<Array<{ id: string; text: string }>>([]);
  const [text, setText] = useState('');
  const [gameLoaded, setGameLoaded] = useState(false);
  const [gameStats, setGameStats] = useState({ totalScenesSeen: 0, currentEnding: null as string | null });
  const [backgroundTheme, setBackgroundTheme] = useState('default');

  useEffect(() => {
    // Try to load saved game
    const saved = loadGameProgress();
    const initialScene = saved?.currentScene || 'intro';
    setCurrentSceneId(initialScene);
    
    const storyData = getStoryData(initialScene);
    setText(storyData.text);
    setChoices(storyData.choices);
    setBackgroundTheme(storyData.background || 'default');
    setGameLoaded(true);
    
    // Track if this is an ending
    if (storyData.ending) {
      setGameStats(prev => ({ ...prev, currentEnding: initialScene }));
    }
  }, []);

  useEffect(() => {
    const storyData = getStoryData(currentSceneId);
    setText(storyData.text);
    setChoices(storyData.choices);
    setBackgroundTheme(storyData.background || 'default');
    saveGameProgress(currentSceneId);
    
    if (storyData.ending) {
      setGameStats(prev => ({ ...prev, currentEnding: currentSceneId }));
    }
    
    setGameStats(prev => ({ ...prev, totalScenesSeen: prev.totalScenesSeen + 1 }));
  }, [currentSceneId]);

  const handleChoice = (choiceId: string) => {
    setCurrentSceneId(choiceId);
  };

  if (!gameLoaded) {
    return <div className="w-full h-screen bg-black" />;
  }

  return (
    <GameScreen
      text={text}
      choices={choices}
      onChoiceSelect={handleChoice}
      onQuit={onQuit}
      soundEnabled={soundEnabled}
      musicEnabled={musicEnabled}
      backgroundTheme={backgroundTheme}
    />
  );
}
