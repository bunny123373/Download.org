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
  { value: '', label: 'All' },
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
    <header className="h-16 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--glass-border)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 gap-2 md:gap-4">
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        <button
          onClick={() => router.back()}
          className="btn-icon w-8 h-8 flex-shrink-0 lg:hidden"
        >
          ←
        </button>
        <h2 className="text-base md:text-lg font-semibold text-[var(--text-primary)] truncate hidden sm:block">
          Link Organizer
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {showSearch && (
          <div className={`relative transition-all duration-300 ${isSearchOpen || searchValue ? 'w-40 md:w-64' : 'w-8 md:w-10'}`}>
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => !searchValue && setIsSearchOpen(false)}
              className="glass-input w-full py-1.5 md:py-2 pl-8 md:pl-10 pr-3 md:pr-4 text-xs md:text-sm"
            />
            <span className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 text-sm">
              🔍
            </span>
          </div>
        )}

        {showFilter && (
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="glass-input py-1.5 px-2 md:px-4 text-xs md:text-sm cursor-pointer max-w-[100px] md:max-w-none"
          >
            {filters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        )}

        <button className="btn-icon w-8 h-8 relative hidden sm:flex">
          <span>🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--error)] rounded-full" />
        </button>

        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-purple-500 flex items-center justify-center text-xs md:text-sm font-bold cursor-pointer flex-shrink-0">
          U
        </div>
      </div>
    </header>
  );
}