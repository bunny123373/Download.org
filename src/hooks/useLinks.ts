'use client';

import { useState, useCallback } from 'react';
import { Link } from '@/types';

interface UseLinksReturn {
  links: Link[];
  loading: boolean;
  error: string | null;
  stats: { total: number; favorites: number; categories: number; recent: number } | null;
  fetchLinks: (params?: Record<string, string>) => Promise<void>;
  addLink: (data: Record<string, unknown>) => Promise<Link | null>;
  updateLink: (id: string, data: Record<string, unknown>) => Promise<Link | null>;
  deleteLink: (id: string) => Promise<boolean>;
  toggleFavorite: (link: Link) => Promise<void>;
  toggleFailed: (id: string, failed: boolean) => Promise<void>;
}

export function useLinks(): UseLinksReturn {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ total: number; favorites: number; categories: number; recent: number; failed: number } | null>(null);

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
      const res = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });
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

  return {
    links,
    loading,
    error,
    stats,
    fetchLinks,
    addLink,
    updateLink,
    deleteLink,
    toggleFavorite,
    toggleFailed,
  };
}
