'use client';

import { useEffect, useState } from 'react';

export default function PixelCursor() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect x="0" y="0" width="2" height="2" fill="%2300ff00"/><rect x="2" y="0" width="2" height="2" fill="%2300ff00"/><rect x="0" y="2" width="2" height="2" fill="%2300ff00"/><rect x="2" y="2" width="2" height="2" fill="%2300ff00"/><rect x="4" y="4" width="2" height="2" fill="%2300ff00"/><rect x="6" y="6" width="2" height="2" fill="%2300ff00"/><rect x="8" y="8" width="2" height="2" fill="%2300ff00"/></svg>') 0 0, auto;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
