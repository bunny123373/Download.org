'use client';

import { useState, useCallback } from 'react';
import { Link } from '@/types';

interface UseLinksReturn {
  links: Link[];
  loading: boolean;
  error: string | null;
  stats: { total: number; favorites: number; categories: number; recent: number; failed: number; trashed: number } | null;
  pagination: { page: number; totalPages: number; total: number };
  fetchLinks: (params?: Record<string, string>) => Promise<void>;
  addLink: (data: Record<string, unknown>) => Promise<Link | null>;
  updateLink: (id: string, data: Record<string, unknown>) => Promise<Link | null>;
  deleteLink: (id: string) => Promise<boolean>;
  restoreLink: (id: string) => Promise<void>;
  permanentDelete: (id: string) => Promise<void>;
  toggleFavorite: (link: Link) => Promise<void>;
  toggleFailed: (id: string, failed: boolean) => Promise<void>;
  exportLinks: () => Promise<void>;
  importLinks: (links: unknown[]) => Promise<number>;
}

export function useLinks(): UseLinksReturn {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ total: number; favorites: number; categories: number; recent: number; failed: number; trashed: number } | null>(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchLinks = useCallback(async (params: Record<string, string> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryString = new URLSearchParams(params).toString();
      const res = await fetch(`/api/links${queryString ? `?${queryString}` : ''}`);
      const data = await res.json();
      
      if (data.success) {
        setLinks(data.data.links);
        setStats(data.data.stats);
        setPagination({
          page: data.data.page,
          totalPages: data.data.totalPages,
          total: data.data.total,
        });
      } else {
        setError(data.error || 'Failed to fetch links');
      }
    } catch (err) {
      setError('Failed to fetch links');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addLink = useCallback(async (data: Record<string, unknown>): Promise<Link | null> => {
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      
      if (result.success) {
        setLinks(prev => [result.data, ...prev]);
        return result.data;
      } else {
        setError(result.error || 'Failed to add link');
        return null;
      }
    } catch (err) {
      setError('Failed to add link');
      console.error(err);
      return null;
    }
  }, []);

  const updateLink = useCallback(async (id: string, data: Record<string, unknown>): Promise<Link | null> => {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      
      if (result.success) {
        setLinks(prev => prev.map(l => l._id === id ? result.data : l));
        return result.data;
      } else {
        setError(result.error || 'Failed to update link');
        return null;
      }
    } catch (err) {
      setError('Failed to update link');
      console.error(err);
      return null;
    }
  }, []);

  const deleteLink = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
      const result = await res.json();
      
      if (result.success) {
        setLinks(prev => prev.filter(l => l._id !== id));
        return true;
      } else {
        setError(result.error || 'Failed to delete link');
        return false;
      }
    } catch (err) {
      setError('Failed to delete link');
      console.error(err);
      return false;
    }
  }, []);

  const restoreLink = useCallback(async (id: string) => {
    const res = await fetch(`/api/links/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restore: true }),
    });
    const result = await res.json();
    if (result.success) {
      setLinks(prev => prev.filter(l => l._id !== id));
    }
  }, []);

  const permanentDelete = useCallback(async (id: string) => {
    const res = await fetch(`/api/links/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permanent: true }),
    });
    const result = await res.json();
    if (result.success) {
      setLinks(prev => prev.filter(l => l._id !== id));
    }
  }, []);

  const toggleFavorite = useCallback(async (link: Link) => {
    await updateLink(link._id, { favorite: !link.favorite });
  }, [updateLink]);

  const toggleFailed = useCallback(async (id: string, failed: boolean) => {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ failed }),
      });
      const result = await res.json();
      if (result.success) {
        setLinks(prev => prev.map(l => l._id === id ? { ...l, failed } : l));
      }
    } catch (err) {
      console.error('Failed to toggle failed status:', err);
    }
  }, []);

  const exportLinks = useCallback(async () => {
    try {
      const res = await fetch('/api/links/export');
      const data = await res.json();
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'links-export.json';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, []);

  const importLinks = useCallback(async (importedLinks: unknown[]): Promise<number> => {
    try {
      const res = await fetch('/api/links/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: importedLinks }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLinks();
        return data.data.count;
      }
      return 0;
    } catch (err) {
      console.error('Import failed:', err);
      return 0;
    }
  }, [fetchLinks]);

  return {
    links,
    loading,
    error,
    stats,
    pagination,
    fetchLinks,
    addLink,
    updateLink,
    deleteLink,
    restoreLink,
    permanentDelete,
    toggleFavorite,
    toggleFailed,
    exportLinks,
    importLinks,
  };
}