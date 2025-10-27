'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TreePine, List, MapPin } from 'lucide-react';

// Configure Lucide icons to be thinner
const iconProps = {
  strokeWidth: 1.5
};

export default function Home() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize database on first load
    fetch('/api/init')
      .then(() => setInitialized(true))
      .catch(console.error);
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <img src="/logo.png" alt="Park M Logo" className="h-20 w-auto mx-auto mb-4 object-contain animate-pulse" style={{maxWidth: '300px', filter: 'brightness(0) invert(1)'}} />
          <p className="text-lg text-gray-600 dark:text-gray-300">Inicjalizacja aplikacji...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <TreePine className="w-24 h-24 text-[#22c55e] mx-auto mb-4" {...iconProps} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Ewidencji Drzew</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/add-tree">
            <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur rounded-[2rem] shadow-lg dark:shadow-[0_0_30px_rgba(34,197,94,0.5)] p-8 hover:shadow-xl hover:shadow-[0_0_40px_rgba(34,197,94,0.7)] transition-all cursor-pointer border-[3px] border-gray-200 dark:border-[#22c55e] hover:border-green-500 dark:hover:border-[#4ade80]">
              <TreePine className="w-12 h-12 text-green-600 dark:text-[#22c55e] mx-auto mb-4" {...iconProps} />
              <h2 className="text-xl font-semibold text-center mb-2 dark:text-[#22c55e]">Dodaj Drzewo</h2>
              <p className="text-gray-600 dark:text-slate-300 text-center text-sm">
                Zarejestruj nowe drzewo z GPS i zdjęciem
              </p>
            </div>
          </Link>

          <Link href="/trees">
            <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur rounded-[2rem] shadow-lg dark:shadow-[0_0_30px_rgba(34,197,94,0.5)] p-8 hover:shadow-xl hover:shadow-[0_0_40px_rgba(34,197,94,0.7)] transition-all cursor-pointer border-[3px] border-gray-200 dark:border-[#22c55e] hover:border-green-500 dark:hover:border-[#4ade80]">
              <List className="w-12 h-12 text-green-600 dark:text-[#22c55e] mx-auto mb-4" {...iconProps} />
              <h2 className="text-xl font-semibold text-center mb-2 dark:text-[#22c55e]">Lista Drzew</h2>
              <p className="text-gray-600 dark:text-slate-300 text-center text-sm">
                Przeglądaj i zarządzaj zarejestrowanymi drzewami
              </p>
            </div>
          </Link>

          <Link href="/map">
            <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur rounded-[2rem] shadow-lg dark:shadow-[0_0_30px_rgba(34,197,94,0.5)] p-8 hover:shadow-xl hover:shadow-[0_0_40px_rgba(34,197,94,0.7)] transition-all cursor-pointer border-[3px] border-gray-200 dark:border-[#22c55e] hover:border-green-500 dark:hover:border-[#4ade80]">
              <MapPin className="w-12 h-12 text-green-600 dark:text-[#22c55e] mx-auto mb-4" {...iconProps} />
              <h2 className="text-xl font-semibold text-center mb-2 dark:text-[#22c55e]">Mapa</h2>
              <p className="text-gray-600 dark:text-slate-300 text-center text-sm">
                Zobacz rozmieszczenie drzew na mapie
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-12 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Funkcje aplikacji:</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-green-600 dark:text-green-500 mr-2">✓</span>
              <span>Automatyczne pobranie lokalizacji GPS</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 dark:text-green-500 mr-2">✓</span>
              <span>Dodawanie zdjęć drzew</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 dark:text-green-500 mr-2">✓</span>
              <span>Historia działań (podlewanie, przycinanie, inspekcja)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 dark:text-green-500 mr-2">✓</span>
              <span>Przypisywanie do budów i pracowników</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 dark:text-green-500 mr-2">✓</span>
              <span>Wizualizacja na mapie</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
