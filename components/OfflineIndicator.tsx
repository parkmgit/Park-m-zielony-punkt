'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showNotification) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm ${
          isOnline
            ? 'bg-green-500/90 text-white'
            : 'bg-red-500/90 text-white'
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className="w-5 h-5" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-sm">Połączono z internetem</p>
              <p className="text-xs opacity-90">Aplikacja działa online</p>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-sm">Tryb offline</p>
              <p className="text-xs opacity-90">Dane będą zsynchronizowane później</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
