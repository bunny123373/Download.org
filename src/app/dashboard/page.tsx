'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';
import LinkCard from '@/components/LinkCard';
import SkeletonCard from '@/components/SkeletonCard';
import Toast, { ToastType } from '@/components/Toast';
import { useLinks } from '@/hooks/useLinks';
import { Link } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { links, loading, stats, fetchLinks, deleteLink, toggleFavorite } = useLinks();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    fetchLinks({ search: query, type: typeFilter });
  }, [fetchLinks, typeFilter]);

  const handleFilter = useCallback((filter: string) => {
    setTypeFilter(filter);
    fetchLinks({ search: searchQuery, type: filter });
  }, [fetchLinks, searchQuery]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      const success = await deleteLink(id);
      if (success) {
        setToast({ message: 'Link deleted successfully!', type: 'success' });
      } else {
        setToast({ message: 'Failed to delete link', type: 'error' });
      }
    }
  };

  const handleToggleFavorite = async (link: Link) => {
    await toggleFavorite(link);
    setToast({ 
      message: link.favorite ? 'Removed from favorites' : 'Added to favorites', 
      type: 'success' 
    });
  };

  const handleEdit = (link: Link) => {
    router.push(`/add-link?edit=${link._id}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar onSearch={handleSearch} onFilter={handleFilter} />
      
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Dashboard</h1>
          <p className="text-[var(--text-muted)]">Manage and organize your links</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon="🔗"
            label="Total Links"
            value={stats?.total || 0}
            color="#6366f1"
            index={0}
          />
          <StatsCard
            icon="⭐"
            label="Favorites"
            value={stats?.favorites || 0}
            color="#f59e0b"
            index={1}
          />
          <StatsCard
            icon="📁"
            label="Categories"
            value={stats?.categories || 0}
            color="#22c55e"
            index={2}
          />
          <StatsCard
            icon="🕐"
            label="Recent (7 days)"
            value={stats?.recent || 0}
            color="#ec4899"
            index={3}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Recent Links</h2>
          <button
            onClick={() => router.push('/add-link')}
            className="btn-primary text-sm"
          >
            ➕ Add New Link
          </button>
        </div>

        {loading ? (
          <SkeletonCard count={8} />
        ) : links.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No links yet</h3>
            <p className="text-[var(--text-muted)] mb-6">Start adding your first link to get organized</p>
            <button
              onClick={() => router.push('/add-link')}
              className="btn-primary"
            >
              Add Your First Link
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {links.slice(0, 12).map((link, index) => (
              <LinkCard
                key={link._id}
                link={link}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
