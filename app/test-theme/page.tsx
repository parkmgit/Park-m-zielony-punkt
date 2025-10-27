'use client';

import { useTheme } from '@/components/ThemeProvider';
import { useEffect, useState } from 'react';

export default function TestThemePage() {
  const { theme, toggleTheme } = useTheme();
  const [htmlClasses, setHtmlClasses] = useState('');
  const [localStorageTheme, setLocalStorageTheme] = useState('');

  useEffect(() => {
    const updateInfo = () => {
      setHtmlClasses(document.documentElement.className);
      setLocalStorageTheme(localStorage.getItem('theme') || 'none');
    };
    
    updateInfo();
    const interval = setInterval(updateInfo, 100);
    return () => clearInterval(interval);
  }, []);

  const clearStorage = () => {
    localStorage.removeItem('theme');
    window.location.reload();
  };

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Test Motywu
        </h1>

        <div className="space-y-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <div>
            <strong className="text-gray-900 dark:text-white">Aktualny motyw (state):</strong>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{theme}</span>
          </div>

          <div>
            <strong className="text-gray-900 dark:text-white">localStorage theme:</strong>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{localStorageTheme}</span>
          </div>

          <div>
            <strong className="text-gray-900 dark:text-white">Klasy na &lt;html&gt;:</strong>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{htmlClasses || '(brak)'}</span>
          </div>

          <div>
            <strong className="text-gray-900 dark:text-white">Czy ma klasę "dark":</strong>
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              {htmlClasses.includes('dark') ? 'TAK ✓' : 'NIE ✗'}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={toggleTheme}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Przełącz motyw (obecnie: {theme})
          </button>

          <button
            onClick={clearStorage}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 font-semibold"
          >
            Wyczyść localStorage i odśwież
          </button>
        </div>

        <div className="mt-8 p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Test wizualny:
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Ten tekst powinien być ciemny na jasnym tle lub jasny na ciemnym tle.
          </p>
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded">
            <p className="text-green-900 dark:text-green-100">
              To pole zmienia kolor w zależności od motywu
            </p>
          </div>
        </div>

        <div className="mt-4">
          <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Powrót do strony głównej
          </a>
        </div>
      </div>
    </div>
  );
}
