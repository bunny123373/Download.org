'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LinkCard from '@/components/LinkCard';
import SkeletonCard from '@/components/SkeletonCard';
import Toast, { ToastType } from '@/components/Toast';
import { useLinks } from '@/hooks/useLinks';
import { Link } from '@/types';

export default function TrashPage() {
  const router = useRouter();
  const { links, loading, fetchLinks, deleteLink, restoreLink, permanentDelete, toggleFavorite } = useLinks();
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    fetchLinks({ trashed: 'true' });
  }, [fetchLinks]);

  const handleRestore = async (id: string) => {
    await restoreLink(id);
    setToast({ message: 'Link restored!', type: 'success' });
    fetchLinks({ trashed: 'true' });
  };

  const handlePermanentDelete = async (id: string) => {
    if (confirm('Permanently delete this link? This cannot be undone!')) {
      await permanentDelete(id);
      setToast({ message: 'Link permanently deleted!', type: 'success' });
    }
  };

  const handleToggleFavorite = async () => {};

  const handleEdit = () => {};
  const handleDelete = () => {};

  return (
    <div className="min-h-screen">
      <Navbar showSearch={false} showFilter={false} />
      
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1 md:mb-2">🗑️ Trash</h1>
            <p className="text-sm md:text-base text-[var(--text-muted)]">Deleted links</p>
          </div>
          <button onClick={() => router.push('/dashboard')} className="btn-secondary text-sm">
            ← Back
          </button>
        </div>

        {loading ? (
          <SkeletonCard count={4} />
        ) : links.length === 0 ? (
          <div className="glass-card p-6 md:p-12 text-center">
            <div className="text-4xl md:text-6xl mb-4">🗑️</div>
            <h3 className="text-lg md:text-xl font-semibold text-[var(--text-primary)] mb-2">Trash is empty</h3>
            <p className="text-sm md:text-base text-[var(--text-muted)]">Deleted links will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {links.map((link, index) => (
              <div key={link._id} className="glass-card p-3 md:p-4 lg:p-5 opacity-75">
                <div className="flex items-start justify-between mb-2">
                  <span className="type-badge text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                    🗑️ TRASHED
                  </span>
                </div>
                <h3 className="text-sm md:text-base font-semibold text-[var(--text-primary)] mb-1 line-clamp-1">
                  {link.title}
                </h3>
                <p className="text-xs md:text-sm text-[var(--text-muted)] mb-3 line-clamp-1 font-mono">
                  {link.url}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => handleRestore(link._id)} className="btn-primary flex-1 text-xs py-1.5">
                    ↩️ Restore
                  </button>
                  <button onClick={() => handlePermanentDelete(link._id)} className="btn-secondary flex-1 text-xs py-1.5 text-[var(--error)] hover:bg-[var(--error)]/20">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}