'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HomeIcon, FolderPlusIcon } from '@heroicons/react/24/outline';
import { TreePine, LogOut, User, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CurrentUser {
  id: number;
  name: string;
  role: string;
  email: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Fetch current user if not on login page
    if (pathname !== '/login' && pathname !== '/register') {
      fetch('/api/auth/me')
        .then(res => res.ok ? res.json() : null)
        .then(user => setCurrentUser(user))
        .catch(() => setCurrentUser(null));
    }

    // PWA Install prompt handler
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowInstallButton(false);
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
  };

  const links = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/projects', label: 'Projekty', icon: FolderPlusIcon },
  ];

  // Don't show navbar on login and register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-slate-800 border-b-2 border-gray-200 dark:border-[#22c55e]/30 shadow-lg dark:shadow-[#22c55e]/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Park M Logo" className="h-12 w-auto object-contain" style={{maxWidth: '250px', filter: 'brightness(0) invert(1)'}} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isActive
                      ? 'bg-[#22c55e] text-white shadow-lg'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
            
            {/* Install PWA Button */}
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#22c55e] text-white hover:bg-[#16a34a] transition-all shadow-lg animate-pulse"
                title="Zainstaluj aplikację"
              >
                <Download className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Pobierz</span>
              </button>
            )}

            {/* User Info */}
            {currentUser && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-slate-700 rounded-full">
                <User className="w-4 h-4 text-[#22c55e]" strokeWidth={1.5} />
                <span className="text-sm text-gray-700 dark:text-slate-300">{currentUser.name}</span>
              </div>
            )}
            
            {/* Logout Button */}
            {currentUser && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                title="Wyloguj"
              >
                <LogOut className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">Wyloguj</span>
              </button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2 overflow-x-auto">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-full transition-all min-w-fit ${
                    isActive
                      ? 'bg-[#22c55e] text-white'
                      : 'text-gray-700 dark:text-slate-300'
                  }`}
                  title={link.label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{link.label.split(' ')[0]}</span>
                </Link>
              );
            })}
            
            {/* Install PWA Button Mobile */}
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-full bg-[#22c55e] text-white min-w-fit animate-pulse"
                title="Zainstaluj aplikację"
              >
                <Download className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-xs">Pobierz</span>
              </button>
            )}

            {/* Logout Button Mobile */}
            {currentUser && (
              <button
                onClick={handleLogout}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-full text-red-600 dark:text-red-400 min-w-fit"
                title="Wyloguj"
              >
                <LogOut className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-xs">Wyloguj</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
