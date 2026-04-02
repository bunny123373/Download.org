'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const { links, loading, stats, pagination, fetchLinks, deleteLink, toggleFavorite, toggleFailed, exportLinks, importLinks } = useLinks();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLinks({ sort: sortBy });
  }, [fetchLinks, sortBy]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    fetchLinks({ search: query, type: typeFilter, sort: sortBy });
  }, [fetchLinks, typeFilter, sortBy]);

  const handleFilter = useCallback((filter: string) => {
    setTypeFilter(filter);
    fetchLinks({ search: searchQuery, type: filter, sort: sortBy });
  }, [fetchLinks, searchQuery, sortBy]);

  const handleSort = (sort: string) => {
    setSortBy(sort);
    fetchLinks({ search: searchQuery, type: typeFilter, sort });
  };

  const handlePageChange = (newPage: number) => {
    fetchLinks({ page: newPage.toString(), search: searchQuery, type: typeFilter, sort: sortBy });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Move to trash?')) {
      const success = await deleteLink(id);
      if (success) {
        setToast({ message: 'Moved to trash!', type: 'success' });
      }
    }
  };

  const handleToggleFavorite = async (link: Link) => {
    await toggleFavorite(link);
    setToast({ message: link.favorite ? 'Removed from favorites' : 'Added to favorites', type: 'success' });
  };

  const handleEdit = (link: Link) => {
    router.push(`/add-link?edit=${link._id}`);
  };

  const handleMarkFailed = async (id: string, failed: boolean) => {
    await toggleFailed(id, failed);
    setToast({ message: failed ? 'Link marked as failed' : 'Link marked as working', type: 'info' });
  };

  const handleExport = async () => {
    await exportLinks();
    setToast({ message: 'Links exported!', type: 'success' });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          const count = await importLinks(imported);
          setToast({ message: `Imported ${count} links!`, type: 'success' });
        } catch {
          setToast({ message: 'Invalid file format', type: 'error' });
        }
      };
      reader.readAsText(file);
    }
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
          <StatsCard icon="🔗" label="Total" value={stats?.total || 0} color="#6366f1" index={0} />
          <StatsCard icon="⭐" label="Favorites" value={stats?.favorites || 0} color="#f59e0b" index={1} />
          <StatsCard icon="📁" label="Categories" value={stats?.categories || 0} color="#22c55e" index={2} />
          <StatsCard icon="❌" label="Failed" value={stats?.failed || 0} color="#ef4444" index={3} />
          <StatsCard icon="🕐" label="Recent" value={stats?.recent || 0} color="#ec4899" index={4} />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--text-primary)]">Recent Links</h2>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="glass-input py-1.5 px-3 text-xs md:text-sm cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="btn-secondary text-xs md:text-sm px-3 py-2">
              📤 Export
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-xs md:text-sm px-3 py-2">
              📥 Import
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            <button onClick={() => router.push('/add-link')} className="btn-primary text-xs md:text-sm px-3 md:px-4 py-2">
              ➕ Add
            </button>
          </div>
        </div>

        {loading ? (
          <SkeletonCard count={4} />
        ) : links.length === 0 ? (
          <div className="glass-card p-6 md:p-12 text-center">
            <div className="text-4xl md:text-6xl mb-4">🔗</div>
            <h3 className="text-lg md:text-xl font-semibold text-[var(--text-primary)] mb-2">No links yet</h3>
            <p className="text-sm md:text-base text-[var(--text-muted)] mb-6">Start adding your first link</p>
            <button onClick={() => router.push('/add-link')} className="btn-primary">
              Add Your First Link
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {links.map((link, index) => (
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

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  ← Prev
                </button>
                <span className="text-sm text-[var(--text-muted)]">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}