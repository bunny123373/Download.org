'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/add-link', label: 'Add Link', icon: '➕' },
  { href: '/categories', label: 'Categories', icon: '📁' },
  { href: '/favorites', label: 'Favorites', icon: '⭐' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden btn-icon z-40"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-[280px] 
        bg-[var(--bg-secondary)] border-r border-[var(--glass-border)] 
        flex flex-col z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 border-b border-[var(--glass-border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 flex items-center justify-center text-lg">
                🔗
              </div>
              <div>
                <h1 className="text-lg font-bold text-[var(--text-primary)]">LinkHub</h1>
                <p className="text-xs text-[var(--text-muted)]">Organize</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden btn-icon w-8 h-8 text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/25'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--glass)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--glass-border)] hidden lg:block">
          <div className="glass-card p-3">
            <p className="text-xs text-[var(--text-muted)] mb-2">Storage</p>
            <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 rounded-full" />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">33% used</p>
          </div>
        </div>
      </aside>
    </>
  );
}