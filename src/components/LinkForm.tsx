'use client';

import { useState, useEffect } from 'react';
import { Link, LinkType, detectType, getTypeColor, getTypeIcon } from '@/types';

interface LinkFormProps {
  link?: Link | null;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormData {
  title: string;
  url: string;
  category: string;
  tags: string;
  note: string;
  favorite: boolean;
}

const categories = ['Movies', 'MP4', 'HLS', 'Subtitles', 'Images', 'Tools'];

export default function LinkForm({ link, onSubmit, onCancel, isLoading = false }: LinkFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: link?.title || '',
    url: link?.url || '',
    category: link?.category || 'Movies',
    tags: link?.tags?.join(', ') || '',
    note: link?.note || '',
    favorite: link?.favorite || false,
  });
  const [detectedType, setDetectedType] = useState<LinkType | null>(null);

  useEffect(() => {
    if (formData.url) {
      const type = detectType(formData.url);
      setDetectedType(type);
    } else {
      setDetectedType(null);
    }
  }, [formData.url]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter link title..."
          className="glass-input w-full py-3 px-4"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          URL
        </label>
        <input
          type="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
          placeholder="https://example.com/link..."
          className="glass-input w-full py-3 px-4"
        />
        {detectedType && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">Detected type:</span>
            <span 
              className="type-badge text-xs"
              style={{ 
                backgroundColor: `${getTypeColor(detectedType)}20`,
                color: getTypeColor(detectedType),
                border: `1px solid ${getTypeColor(detectedType)}40`
              }}
            >
              {getTypeIcon(detectedType)} {detectedType}
            </span>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="glass-input w-full py-3 px-4 cursor-pointer"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Tags (comma separated)
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="action, adventure, 2024..."
          className="glass-input w-full py-3 px-4"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Note
        </label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows={3}
          placeholder="Add a note about this link..."
          className="glass-input w-full py-3 px-4 resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="favorite"
          id="favorite"
          checked={formData.favorite}
          onChange={handleChange}
          className="w-5 h-5 rounded border-[var(--glass-border)] bg-[var(--glass)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] focus:ring-offset-0"
        />
        <label htmlFor="favorite" className="text-sm text-[var(--text-secondary)]">
          Add to favorites
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Saving...
            </span>
          ) : (
            link ? 'Update Link' : 'Add Link'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
