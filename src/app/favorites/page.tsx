'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LinkCard from '@/components/LinkCard';
import SkeletonCard from '@/components/SkeletonCard';
import Toast, { ToastType } from '@/components/Toast';
import { useLinks } from '@/hooks/useLinks';
import { Link } from '@/types';

export default function FavoritesPage() {
  const router = useRouter();
  const { links, loading, fetchLinks, deleteLink, toggleFavorite, toggleFailed } = useLinks();
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    fetchLinks({ favorite: 'true' });
  }, [fetchLinks]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    fetchLinks({ search: query, favorite: 'true' });
  }, [fetchLinks]);

  const filteredLinks = links.filter(l => l.favorite);

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
      <Navbar onSearch={handleSearch} showFilter={false} />
      
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-1 md:mb-2">⭐ Favorites</h1>
          <p className="text-sm md:text-base text-[var(--text-muted)]">Your starred links</p>
        </div>

        {loading ? (
          <SkeletonCard count={4} />
        ) : filteredLinks.length === 0 ? (
          <div className="glass-card p-6 md:p-12 text-center">
            <div className="text-4xl md:text-6xl mb-4">⭐</div>
            <h3 className="text-lg md:text-xl font-semibold text-[var(--text-primary)] mb-2">No favorites yet</h3>
            <p className="text-sm md:text-base text-[var(--text-muted)] mb-6">Star links to add them to your favorites</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary"
            >
              Browse All Links
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredLinks.map((link, index) => (
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
