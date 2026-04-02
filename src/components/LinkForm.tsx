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
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div>
        <label className="block text-xs md:text-sm font-medium text-[var(--text-secondary)] mb-1 md:mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter link title..."
          className="glass-input w-full py-2 md:py-3 px-3 md:px-4 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-[var(--text-secondary)] mb-1 md:mb-2">
          URL
        </label>
        <input
          type="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
          placeholder="https://example.com/link..."
          className="glass-input w-full py-2 md:py-3 px-3 md:px-4 text-sm"
        />
        {detectedType && (
          <div className="mt-1 md:mt-2 flex items-center gap-2">
            <span className="text-[10px] md:text-xs text-[var(--text-muted)]">Type:</span>
            <span 
              className="type-badge text-[10px] md:text-xs"
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
        <label className="block text-xs md:text-sm font-medium text-[var(--text-secondary)] mb-1 md:mb-2">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="glass-input w-full py-2 md:py-3 px-3 md:px-4 cursor-pointer text-sm"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-[var(--text-secondary)] mb-1 md:mb-2">
          Tags
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="action, adventure..."
          className="glass-input w-full py-2 md:py-3 px-3 md:px-4 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-[var(--text-secondary)] mb-1 md:mb-2">
          Note
        </label>
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows={3}
          placeholder="Add a note..."
          className="glass-input w-full py-2 md:py-3 px-3 md:px-4 resize-none text-sm"
        />
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <input
          type="checkbox"
          name="favorite"
          id="favorite"
          checked={formData.favorite}
          onChange={handleChange}
          className="w-4 h-4 md:w-5 md:h-5 rounded border-[var(--glass-border)] bg-[var(--glass)] text-[var(--accent-primary)]"
        />
        <label htmlFor="favorite" className="text-xs md:text-sm text-[var(--text-secondary)]">
          Add to favorites
        </label>
      </div>

      <div className="flex gap-2 md:gap-4 pt-2 md:pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex-1 text-sm md:text-base py-2.5 md:py-3 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Saving...
            </span>
          ) : (
            link ? 'Update' : 'Add Link'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary text-sm md:text-base py-2.5 md:py-3"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}