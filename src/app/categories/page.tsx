'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useLinks } from '@/hooks/useLinks';
import { CATEGORIES, Category } from '@/types';

interface CategoryWithCount extends Category {
  count: number;
}

export default function CategoriesPage() {
  const router = useRouter();
  const { links, loading, fetchLinks } = useLinks();
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  useEffect(() => {
    const categoryCounts = CATEGORIES.map(cat => ({
      ...cat,
      count: links.filter(l => l.category.toLowerCase() === cat.name.toLowerCase()).length,
    }));
    setCategories(categoryCounts);
  }, [links]);

  const handleCategoryClick = (category: string) => {
    router.push(`/dashboard?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar showSearch={false} showFilter={false} />
      
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1 md:mb-2">Categories</h1>
          <p className="text-sm md:text-base text-[var(--text-muted)]">Browse links by category</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {CATEGORIES.map((_, i) => (
              <div key={i} className="glass-card p-4 md:p-6 animate-pulse">
                <div className="skeleton h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl mb-3 md:mb-4" />
                <div className="skeleton h-5 w-1/2 mb-2" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="glass-card p-4 md:p-6 text-left hover:scale-[1.02] transition-transform animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div 
                  className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg md:rounded-xl flex items-center justify-center text-xl md:text-2xl mb-3 md:mb-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${category.color}30, ${category.color}10)`,
                    border: `1px solid ${category.color}30`
                  }}
                >
                  {category.icon}
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-semibold text-[var(--text-primary)] mb-1 md:mb-2">
                  {category.name}
                </h3>
                <p className="text-xs md:text-sm text-[var(--text-muted)]">
                  {category.count} {category.count === 1 ? 'link' : 'links'}
                </p>
                {category.count > 0 && (
                  <div className="mt-3 md:mt-4 h-1.5 md:h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((category.count / 50) * 100, 100)}%`,
                        background: `linear-gradient(90deg, ${category.color}, ${category.color}80)`
                      }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
