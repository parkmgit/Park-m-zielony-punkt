'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HomeIcon, FolderPlusIcon } from '@heroicons/react/24/outline';
import { TreePine, LogOut, User, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

const MoonIcon = () => (
  <svg height="1em" role="presentation" viewBox="0 0 24 24" width="1em">
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

const SunIcon = () => (
  <svg height="1em" role="presentation" viewBox="0 0 24 24" width="1em">
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
);

interface CurrentUser {
  id: number;
  name: string;
  role: string;
  email: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Check initial theme
    setIsDark(document.documentElement.classList.contains('dark'));
    
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

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
            <img src="/logo.png" alt="Park M Logo" className="h-12 w-auto object-contain" style={{maxWidth: '250px'}} />
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
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative inline-flex items-center h-10 w-16 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2"
              style={{
                backgroundColor: isDark ? '#15803d' : '#86efac'
              }}
            >
              <span
                className={`inline-flex items-center justify-center h-8 w-8 rounded-full bg-white shadow-lg transform transition-transform duration-300 ${
                  isDark ? 'translate-x-7 text-gray-800' : 'translate-x-1 text-gray-800'
                }`}
              >
                {isDark ? (
                  <SunIcon />
                ) : (
                  <MoonIcon />
                )}
              </span>
            </button>
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
            
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none"
              style={{
                backgroundColor: isDark ? '#15803d' : '#86efac'
              }}
            >
              <span
                className={`inline-flex items-center justify-center h-6 w-6 rounded-full bg-white shadow-lg transform transition-transform duration-300 text-sm ${
                  isDark ? 'translate-x-7 text-gray-800' : 'translate-x-1 text-gray-800'
                }`}
              >
                {isDark ? (
                  <SunIcon />
                ) : (
                  <MoonIcon />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
