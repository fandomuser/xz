'use client';

import { useEffect, useState } from 'react';

interface MainMenuProps {
  onPlay: () => void;
  onCredits: () => void;
  onSettings: () => void;
}

export default function MainMenu({ onPlay, onCredits, onSettings }: MainMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const menuItems = [
    { label: 'ИГРАТЬ', action: onPlay },
    { label: 'НАСТРОЙКИ', action: onSettings },
    { label: 'ТИТРЫ', action: onCredits },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev + 1) % menuItems.length);
      } else if (e.key === 'Enter') {
        menuItems[selectedIndex].action();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedIndex, menuItems]);

  return (
    <div
      className={`w-full h-screen bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundColor: '#000000',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0V0zm2 2h1v1H2V2z' fill='%23111111' fillOpacity='0.5'/%3E%3C/svg%3E")`
      }}
    >
      <div className="mb-16 text-center">
        <h1 className="text-6xl md:text-8xl font-bold tracking-widest mb-6" style={{
          color: '#8b0000',
          textShadow: '0 0 30px #6b0000, 0 0 60px #3b0000, -4px -4px 0 #1a0000, 2px 2px 0 #2a0000',
          fontFamily: 'monospace',
          letterSpacing: '6px',
          fontWeight: '900'
        }}>
          I AM NOT
        </h1>
        <h2 className="text-7xl md:text-9xl font-bold tracking-widest" style={{
          color: '#a00000',
          textShadow: '0 0 40px #8b0000, 0 0 80px #6b0000, 4px 4px 0 #2a0000, -2px -2px 0 #1a0000',
          fontFamily: 'monospace',
          letterSpacing: '8px',
          fontWeight: '900'
        }}>
          SUBHAN
        </h2>
      </div>

      {/* Пункты меню */}
      <div className="space-y-4 text-center">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            onMouseEnter={() => setSelectedIndex(index)}
            className={`block w-56 py-4 px-6 text-xl font-bold transition-all duration-200 border-2 cursor-pointer ${
              index === selectedIndex
                ? 'bg-red-950 text-red-300 border-red-700 scale-105'
                : 'bg-transparent text-red-900 border-red-950'
            }`}
            style={{
              fontFamily: 'monospace',
              textShadow: index === selectedIndex ? '0 0 15px #6b0000' : '0 0 5px #2a0000',
              boxShadow: index === selectedIndex ? '0 0 25px #6b0000, inset 0 0 10px #3b0000' : '0 0 5px #1a0000'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Нижний текст */}
      <div className="fixed bottom-16 text-center text-red-900 text-sm font-mono" style={{
        textShadow: '0 0 3px #2a0000'
      }}>
        <p>v1.0 | Abdullayev's Greeting Studio</p>
      </div>
    </div>
  );
}
