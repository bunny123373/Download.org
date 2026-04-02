'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onFilter?: (filter: string) => void;
  showSearch?: boolean;
  showFilter?: boolean;
}

const filters = [
  { value: '', label: 'All Types' },
  { value: 'MP4', label: 'MP4' },
  { value: 'HLS', label: 'HLS' },
  { value: 'SUBTITLE', label: 'Subtitle' },
  { value: 'IMAGE', label: 'Image' },
  { value: 'TOOL', label: 'Tool' },
];

export default function Navbar({ onSearch, onFilter, showSearch = true, showFilter = true }: NavbarProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: unknown[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch?.(query);
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue, debouncedSearch]);

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    onFilter?.(value);
  };

  return (
    <header className="h-[72px] bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--glass-border)] flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="btn-icon lg:hidden"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] hidden lg:block">
          Link Organizer
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className={`relative ${isSearchOpen ? 'w-64' : 'w-10'} transition-all duration-300`}>
            <input
              type="text"
              placeholder="Search links..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => !searchValue && setIsSearchOpen(false)}
              className="glass-input w-full py-2 pl-10 pr-4 text-sm"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              🔍
            </span>
          </div>
        )}

        {showFilter && (
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="glass-input py-2 px-4 text-sm cursor-pointer"
          >
            {filters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        )}

        <button className="btn-icon relative">
          <span>🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--error)] rounded-full" />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 flex items-center justify-center text-sm font-bold cursor-pointer">
          U
        </div>
      </div>
    </header>
  );
}
