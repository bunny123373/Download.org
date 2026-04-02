'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useLinks } from '@/hooks/useLinks';
import { CATEGORIES, Link } from '@/types';

interface CategoryWithCount extends typeof CATEGORIES[number] {
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
      
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Categories</h1>
          <p className="text-[var(--text-muted)]">Browse links by category</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="skeleton h-12 w-12 rounded-xl mb-4" />
                <div className="skeleton h-6 w-1/2 mb-2" />
                <div className="skeleton h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="glass-card p-6 text-left hover:scale-[1.02] transition-transform animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${category.color}30, ${category.color}10)`,
                    border: `1px solid ${category.color}30`
                  }}
                >
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  {category.name}
                </h3>
                <p className="text-[var(--text-muted)]">
                  {category.count} {category.count === 1 ? 'link' : 'links'}
                </p>
                {category.count > 0 && (
                  <div className="mt-4 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
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
