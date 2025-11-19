'use client';

import { useState } from 'react';

interface CreditsScreenProps {
  onBack: () => void;
}

export default function CreditsScreen({ onBack }: CreditsScreenProps) {
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');

  const creditsText = {
    ru: {
      title: 'ТИТРЫ',
      design: 'ДИЗАЙН И РАЗРАБОТКА',
      designArt: 'v0.app Studio',
      story: 'СЮЖЕТ И НАРРАТИВ',
      storyArt: 'Основано на концепции "I am not Human"',
      storyArt2: 'История Субхана',
      audio: 'ЗВУК',
      audioArt: 'Пиксельные звуковые эффекты',
      audioArt2: 'Ретро-синтез бипов',
      visual: 'ВИЗУАЛЬНЫЙ СТИЛЬ',
      visualArt: 'Пиксель-арт эстетика',
      visualArt2: 'Киберпанк VHS стиль',
      thanks: 'Спасибо за игру',
      gameTitle: 'Я НЕ СУБХАН',
      language: 'ЯЗЫК'
    },
    en: {
      title: 'CREDITS',
      design: 'GAME DESIGN & DEVELOPMENT',
      designArt: 'v0.app Studio',
      story: 'STORY & NARRATIVE',
      storyArt: 'Based on "I am not Human" concept',
      storyArt2: 'Featuring the journey of Subhan',
      audio: 'AUDIO',
      audioArt: 'Pixel-style sound effects',
      audioArt2: 'Retro beep synthesis',
      visual: 'VISUAL DESIGN',
      visualArt: 'Pixel art aesthetic',
      visualArt2: 'Cyberpunk VHS style',
      thanks: 'Thank you for playing',
      gameTitle: 'I AM NOT SUBHAN',
      language: 'LANGUAGE'
    }
  };

  const text = creditsText[language];

  return (
    <div 
      className="w-full h-screen bg-gradient-to-b from-red-950 via-slate-900 to-black flex flex-col items-center justify-center overflow-y-auto p-8"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23660000' fillOpacity='0.1'%3E%3Crect x='0' y='0' width='1' height='40'/%3E%3Crect x='10' y='0' width='1' height='40'/%3E%3Crect x='20' y='0' width='1' height='40'/%3E%3Crect x='30' y='0' width='1' height='40'/%3E%3Crect x='0' y='0' width='40' height='1'/%3E%3Crect x='0' y='10' width='40' height='1'/%3E%3Crect x='0' y='20' width='40' height='1'/%3E%3Crect x='0' y='30' width='40' height='1'/%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      <h1 className="text-4xl font-bold mb-12 text-red-800 pt-12" style={{
        fontFamily: 'monospace',
        textShadow: '0 0 10px #6b1f1f'
      }}>
        {text.title}
      </h1>

      <div className="text-center text-red-700 font-mono max-w-2xl space-y-4">
        <div>
          <p className="text-red-600 font-bold">{text.design}</p>
          <p>{text.designArt}</p>
        </div>

        <div>
          <p className="text-red-600 font-bold">{text.story}</p>
          <p>{text.storyArt}</p>
          <p>{text.storyArt2}</p>
        </div>

        <div>
          <p className="text-red-600 font-bold">{text.audio}</p>
          <p>{text.audioArt}</p>
          <p>{text.audioArt2}</p>
        </div>

        <div>
          <p className="text-red-600 font-bold">{text.visual}</p>
          <p>{text.visualArt}</p>
          <p>{text.visualArt2}</p>
        </div>

        <div className="mt-12 pt-8 border-t border-red-800">
          <p className="text-red-600">{text.thanks}</p>
          <p className="text-red-700 mt-4 font-bold" style={{
            textShadow: '0 0 10px #6b1f1f'
          }}>{text.gameTitle}</p>
        </div>
      </div>

      <div className="fixed top-8 right-8 flex gap-2">
        <button
          onClick={() => setLanguage('ru')}
          className={`px-3 py-2 border border-red-800 text-sm transition-all ${
            language === 'ru'
              ? 'bg-red-800 text-red-100'
              : 'bg-transparent text-red-700 hover:bg-red-950'
          }`}
          style={{ fontFamily: 'monospace' }}
        >
          РУС
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-2 border border-red-800 text-sm transition-all ${
            language === 'en'
              ? 'bg-red-800 text-red-100'
              : 'bg-transparent text-red-700 hover:bg-red-950'
          }`}
          style={{ fontFamily: 'monospace' }}
        >
          ENG
        </button>
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
          {language === 'ru' ? 'НАЗАД' : 'BACK'}
        </button>
      </div>
    </div>
  );
}
