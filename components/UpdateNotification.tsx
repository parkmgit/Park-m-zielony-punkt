'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

export default function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Sprawdź czy jest nowa wersja Service Worker
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Nasłuchuj na aktualizacje
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nowa wersja jest dostępna!
                setShowUpdate(true);
              }
            });
          }
        });
      });

      // Sprawdź aktualizacje co 60 sekund
      const interval = setInterval(() => {
        navigator.serviceWorker.ready.then((reg) => {
          reg.update();
        });
      }, 60000);

      return () => clearInterval(interval);
    }
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      // Powiedz Service Worker aby aktywował nową wersję
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Odśwież stronę po aktywacji
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-[#22c55e] p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-[#22c55e]" strokeWidth={2} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Dostępna aktualizacja! 🎉
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
              Nowa wersja aplikacji jest gotowa. Kliknij "Aktualizuj" aby załadować najnowszą wersję.
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-medium rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" strokeWidth={2} />
                Aktualizuj teraz
              </button>
              
              <button
                onClick={handleDismiss}
                className="px-3 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                title="Zamknij"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
