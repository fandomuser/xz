'use client';

import { useState, useEffect, useRef } from 'react';
import PixelCursor from './pixel-cursor';

interface GameScreenProps {
  text: string;
  choices: Array<{ id: string; text: string }>;
  onChoiceSelect: (choiceId: string) => void;
  onQuit: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  backgroundTheme?: string;
}

const backgroundImages: Record<string, string> = {
  default: '/backgrounds/void.jpg',
  hospital: '/backgrounds/hospital.jpg',
  digital: '/backgrounds/digital.jpg',
  glitch: '/backgrounds/glitch.jpg',
  laboratory: '/backgrounds/laboratory.jpg',
  void: '/backgrounds/void.jpg',
  'cyberpunk-city': '/backgrounds/cyberpunk-city.jpg',
  'ancient-ruins': '/backgrounds/ancient-ruins.jpg',
  'space-station': '/backgrounds/space-station.jpg',
};

export default function GameScreen({
  text,
  choices,
  onChoiceSelect,
  onQuit,
  soundEnabled,
  musicEnabled,
  backgroundTheme = 'default',
}: GameScreenProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [selectedChoice, setSelectedChoice] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const playBeep = () => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const frequencies = [750, 850, 950];
      oscillator.frequency.value = frequencies[Math.floor(Math.random() * frequencies.length)];
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {
      // Audio context error silently
    }
  };

  useEffect(() => {
    if (textIndex < text.length) {
      timerRef.current = setTimeout(() => {
        const newChar = text[textIndex];
        setDisplayedText((prev) => prev + newChar);
        
        // Проигрываем звук только для букв и символов (не пробелы и переводы строк)
        if (soundEnabled && newChar !== '\n' && newChar !== ' ') {
          playBeep();
        }
        
        setTextIndex((prev) => prev + 1);
      }, 40);
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else if (textIndex === text.length && textIndex > 0) {
      setShowChoices(true);
    }
  }, [textIndex, text, soundEnabled]);

  useEffect(() => {
    setDisplayedText('');
    setTextIndex(0);
    setShowChoices(false);
    setSelectedChoice(0);
  }, [text]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!showChoices) {
        if (e.key === ' ' || e.key === 'Enter') {
          if (textIndex < text.length) {
            setTextIndex(text.length);
          }
        }
      } else {
        if (e.key === 'ArrowUp') {
          setSelectedChoice((prev) => (prev - 1 + choices.length) % choices.length);
        } else if (e.key === 'ArrowDown') {
          setSelectedChoice((prev) => (prev + 1) % choices.length);
        } else if (e.key === 'Enter') {
          onChoiceSelect(choices[selectedChoice].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showChoices, selectedChoice, choices, textIndex, text.length, onChoiceSelect]);

  return (
    <div 
      className="w-full h-screen text-gray-400 p-8 flex flex-col overflow-hidden relative"
      style={{
        fontFamily: 'monospace',
        backgroundColor: '#000000',
        backgroundImage: `url('${backgroundImages[backgroundTheme] || backgroundImages.default}')`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          pointerEvents: 'none',
        }}
      />
      
      <div className="relative z-10 w-full h-full flex flex-col">
        <PixelCursor />

        {/* Заголовок */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-800">
          <h2 className="text-2xl font-bold" style={{ textShadow: '0 0 10px #1a1a1a', color: '#8b0000' }}>
            {'>'} СОЗНАНИЕ
          </h2>
          <button
            onClick={onQuit}
            className="px-4 py-2 bg-gray-950 text-gray-600 border border-gray-800 hover:bg-gray-900 transition-all text-sm"
            style={{ fontFamily: 'monospace' }}
          >
            ВЫХОД
          </button>
        </div>

        {/* Основной текст */}
        <div className="flex-1 mb-6 bg-black border-2 border-gray-800 p-6 overflow-y-auto" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          boxShadow: 'inset 0 0 20px rgba(26, 26, 26, 0.5)'
        }}>
          <p className="text-lg leading-relaxed whitespace-pre-wrap" style={{
            minHeight: '200px',
            color: '#999999',
            textShadow: '0 0 5px #0a0a0a'
          }}>
            {displayedText}
            {textIndex < text.length && <span className="animate-pulse" style={{ color: '#2a2a2a' }}>█</span>}
          </p>
        </div>

        {/* Варианты ответов */}
        {showChoices && choices.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-gray-700 text-sm mb-3" style={{ textShadow: '0 0 3px #0a0a0a' }}>
              [ВЫБЕРИ ПУТЬ]
            </p>
            {choices.map((choice, index) => (
              <button
                key={choice.id}
                onClick={() => onChoiceSelect(choice.id)}
                onMouseEnter={() => setSelectedChoice(index)}
                className={`w-full text-left p-3 border-2 transition-all ${
                  index === selectedChoice
                    ? 'bg-gray-900 border-gray-600 text-gray-200'
                    : 'bg-transparent border-gray-800 text-gray-700 hover:border-gray-700'
                }`}
                style={{
                  fontFamily: 'monospace',
                  boxShadow: index === selectedChoice ? '0 0 15px #0f0f0f, inset 0 0 10px rgba(26, 26, 26, 0.5)' : 'none'
                }}
              >
                <span className="text-gray-600 mr-2">[{String.fromCharCode(65 + index)}]</span>
                {choice.text}
              </button>
            ))}
          </div>
        )}

        {/* Подсказки */}
        <div className="text-gray-800 text-xs text-center">
          {!showChoices && textIndex < text.length && <p>SPACE/ENTER для пропуска текста</p>}
          {showChoices && <p>↑↓ навигация • ENTER выбор</p>}
        </div>
      </div>
    </div>
  );
}
