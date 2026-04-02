'use client';

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

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[var(--bg-secondary)] border-r border-[var(--glass-border)] flex flex-col z-50">
      <div className="p-6 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 flex items-center justify-center text-xl">
            🔗
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">LinkHub</h1>
            <p className="text-xs text-[var(--text-muted)]">Organize everything</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/25'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--glass)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--glass-border)]">
        <div className="glass-card p-4">
          <p className="text-xs text-[var(--text-muted)] mb-2">Storage</p>
          <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-[var(--accent-primary)] to-purple-500 rounded-full" />
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-2">33% used</p>
        </div>
      </div>
    </aside>
  );
}
