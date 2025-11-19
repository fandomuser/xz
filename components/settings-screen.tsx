'use client';

import { useState } from 'react';

interface SettingsScreenProps {
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  musicEnabled: boolean;
  setMusicEnabled: (value: boolean) => void;
  onBack: () => void;
}

export default function SettingsScreen({
  soundEnabled,
  setSoundEnabled,
  musicEnabled,
  setMusicEnabled,
  onBack,
}: SettingsScreenProps) {
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');

  return (
    <div 
      className="w-full h-screen bg-gradient-to-b from-red-950 via-slate-900 to-black flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23660000' fillOpacity='0.1'%3E%3Crect x='0' y='0' width='1' height='40'/%3E%3Crect x='10' y='0' width='1' height='40'/%3E%3Crect x='20' y='0' width='1' height='40'/%3E%3Crect x='30' y='0' width='1' height='40'/%3E%3Crect x='0' y='0' width='40' height='1'/%3E%3Crect x='0' y='10' width='40' height='1'/%3E%3Crect x='0' y='20' width='40' height='1'/%3E%3Crect x='0' y='30' width='40' height='1'/%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      <h1 className="text-4xl font-bold mb-16 text-red-800" style={{
        fontFamily: 'monospace',
        textShadow: '0 0 10px #6b1f1f'
      }}>
        {language === 'ru' ? 'НАСТРОЙКИ' : 'SETTINGS'}
      </h1>

      <div className="space-y-6 max-w-md w-full">
        <div className="flex items-center justify-between bg-red-950 p-6 border-2 border-red-800">
          <span className="text-red-700 font-bold font-mono">{language === 'ru' ? 'ЯЗЫК' : 'LANGUAGE'}</span>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage('ru')}
              className={`px-4 py-2 border-2 transition-all ${
                language === 'ru'
                  ? 'bg-red-800 text-red-100 border-red-600'
                  : 'bg-transparent text-red-700 border-red-800'
              }`}
              style={{ fontFamily: 'monospace' }}
            >
              РУС
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 border-2 transition-all ${
                language === 'en'
                  ? 'bg-red-800 text-red-100 border-red-600'
                  : 'bg-transparent text-red-700 border-red-800'
              }`}
              style={{ fontFamily: 'monospace' }}
            >
              ENG
            </button>
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center justify-between bg-red-950 p-6 border-2 border-red-800">
          <span className="text-red-700 font-bold font-mono">
            {language === 'ru' ? 'ЗВУКОВЫЕ ЭФФЕКТЫ' : 'SOUND EFFECTS'}
          </span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-16 h-8 rounded-full border-2 transition-all ${
              soundEnabled
                ? 'bg-red-700 border-red-600'
                : 'bg-gray-700 border-gray-500'
            }`}
          >
            <span className={`block w-6 h-6 rounded-full bg-red-100 transition-transform ${
              soundEnabled ? 'translate-x-9' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Music Toggle */}
        <div className="flex items-center justify-between bg-red-950 p-6 border-2 border-red-800">
          <span className="text-red-700 font-bold font-mono">
            {language === 'ru' ? 'ФОНОВАЯ МУЗЫКА' : 'BACKGROUND MUSIC'}
          </span>
          <button
            onClick={() => setMusicEnabled(!musicEnabled)}
            className={`w-16 h-8 rounded-full border-2 transition-all ${
              musicEnabled
                ? 'bg-red-700 border-red-600'
                : 'bg-gray-700 border-gray-500'
            }`}
          >
            <span className={`block w-6 h-6 rounded-full bg-red-100 transition-transform ${
              musicEnabled ? 'translate-x-9' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      <div className="fixed bottom-8">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-red-900 text-red-100 font-bold border-2 border-red-700 hover:bg-red-800 transition-all"
          style={{
            fontFamily: 'monospace',
            boxShadow: '0 0 10px #6b1f1f'
          }}
        >
          {language === 'ru' ? 'НАЗАД В МЕНЮ' : 'BACK TO MENU'}
        </button>
      </div>
    </div>
  );
}
