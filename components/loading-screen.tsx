'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [opacity, setOpacity] = useState(1);
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    // Fade out at 3.5 seconds
    const timer = setTimeout(() => {
      setOpacity(0);
    }, 3500);

    const hideTimer = setTimeout(() => {
      setShouldHide(true);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (shouldHide) return null;

  return (
    <div
      className="fixed inset-0 bg-red-950 flex items-center justify-center transition-opacity duration-500"
      style={{ 
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23330000' fillOpacity='0.2'%3E%3Crect x='0' y='0' width='2' height='2'/%3E%3Crect x='5' y='5' width='2' height='2'/%3E%3Crect x='10' y='10' width='2' height='2'/%3E%3Crect x='15' y='15' width='2' height='2'/%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      <div className="text-center">
        <div className="mb-8 pixel-font text-4xl md:text-6xl font-bold tracking-wider">
          <div className="text-red-700 drop-shadow-lg animate-pulse" style={{
            textShadow: '0 0 15px #6b1f1f'
          }}>
            Я НЕ
          </div>
          <div className="text-red-900 drop-shadow-lg mt-2 animate-pulse" style={{ 
            animationDelay: '0.1s',
            textShadow: '0 0 15px #4a0000'
          }}>
            СУБХАН
          </div>
        </div>

        <div className="mt-12 w-64 h-4 bg-red-950 border-2 border-red-800">
          <div
            className="h-full bg-gradient-to-r from-red-700 to-red-900 animate-pulse"
            style={{
              width: '100%',
              animation: 'pulse 1s ease-in-out infinite'
            }}
          />
        </div>

        <div className="mt-6 text-red-700 text-sm font-mono pixel-font" style={{
          textShadow: '0 0 5px #6b1f1f'
        }}>
          <span className="animate-pulse">█</span> ЗАГРУЗКА СОЗНАНИЯ...
        </div>
      </div>

      <style>{`
        @keyframes glitch {
          0% { text-shadow: 0 0 0 red; }
          50% { text-shadow: -2px 0 0 #8b3a3a, 2px 0 0 #6b1f1f; }
          100% { text-shadow: 0 0 0 red; }
        }
      `}</style>
    </div>
  );
}
