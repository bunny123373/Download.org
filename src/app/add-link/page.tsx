'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LinkForm from '@/components/LinkForm';
import Toast, { ToastType } from '@/components/Toast';
import { useLinks } from '@/hooks/useLinks';
import { Link } from '@/types';

interface FormData {
  title: string;
  url: string;
  category: string;
  tags: string;
  note: string;
  favorite: boolean;
}

export default function AddLinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addLink, updateLink, fetchLinks, links } = useLinks();
  const [isLoading, setIsLoading] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      fetchLinks().then(() => {
        const link = links.find(l => l._id === editId);
        if (link) {
          setEditingLink(link);
        }
      });
    }
  }, [searchParams]);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (editingLink) {
        const result = await updateLink(editingLink._id, data);
        if (result) {
          setToast({ message: 'Link updated successfully!', type: 'success' });
          setTimeout(() => router.push('/dashboard'), 1500);
        } else {
          setToast({ message: 'Failed to update link', type: 'error' });
        }
      } else {
        const result = await addLink(data);
        if (result) {
          setToast({ message: 'Link added successfully!', type: 'success' });
          setTimeout(() => router.push('/dashboard'), 1500);
        } else {
          setToast({ message: 'Failed to add link', type: 'error' });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen">
      <Navbar showSearch={false} showFilter={false} />
      
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {editingLink ? 'Edit Link' : 'Add New Link'}
          </h1>
          <p className="text-[var(--text-muted)]">
            {editingLink ? 'Update the link details below' : 'Add a new link to your collection'}
          </p>
        </div>

        <div className="glass-card p-8">
          <LinkForm
            link={editingLink}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
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
