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
  const { links, loading, stats, fetchLinks, deleteLink, toggleFavorite, toggleFailed } = useLinks();
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

  const handleMarkFailed = async (id: string, failed: boolean) => {
    await toggleFailed(id, failed);
    setToast({ 
      message: failed ? 'Link marked as failed' : 'Link marked as working', 
      type: 'info' 
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar onSearch={handleSearch} onFilter={handleFilter} />
      
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1 md:mb-2">Dashboard</h1>
          <p className="text-sm md:text-base text-[var(--text-muted)]">Manage and organize your links</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
          <StatsCard
            icon="🔗"
            label="Total"
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
            icon="❌"
            label="Failed"
            value={stats?.failed || 0}
            color="#ef4444"
            index={3}
          />
          <StatsCard
            icon="🕐"
            label="Recent"
            value={stats?.recent || 0}
            color="#ec4899"
            index={4}
          />
        </div>

        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-[var(--text-primary)]">Recent Links</h2>
          <button
            onClick={() => router.push('/add-link')}
            className="btn-primary text-xs md:text-sm px-3 md:px-4 py-2"
          >
            ➕ Add
          </button>
        </div>

        {loading ? (
          <SkeletonCard count={4} />
        ) : links.length === 0 ? (
          <div className="glass-card p-6 md:p-12 text-center">
            <div className="text-4xl md:text-6xl mb-4">🔗</div>
            <h3 className="text-lg md:text-xl font-semibold text-[var(--text-primary)] mb-2">No links yet</h3>
            <p className="text-sm md:text-base text-[var(--text-muted)] mb-6">Start adding your first link</p>
            <button
              onClick={() => router.push('/add-link')}
              className="btn-primary"
            >
              Add Your First Link
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {links.slice(0, 12).map((link, index) => (
              <LinkCard
                key={link._id}
                link={link}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onMarkFailed={handleMarkFailed}
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
