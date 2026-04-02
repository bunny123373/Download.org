'use client';

import { Link as LinkType } from '@/types';
import { getTypeColor, getTypeIcon } from '@/types';
import { useState } from 'react';

interface LinkCardProps {
  link: LinkType;
  onEdit: (link: LinkType) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (link: LinkType) => void;
  index?: number;
}

export default function LinkCard({ link, onEdit, onDelete, onToggleFavorite, index = 0 }: LinkCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const typeColor = getTypeColor(link.type);
  const typeIcon = getTypeIcon(link.type);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div 
      className={`glass-card p-5 animate-fade-in stagger-${(index % 8) + 1}`}
      style={{ opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span 
            className="type-badge"
            style={{ 
              backgroundColor: `${typeColor}20`,
              color: typeColor,
              border: `1px solid ${typeColor}40`
            }}
          >
            <span>{typeIcon}</span>
            {link.type}
          </span>
        </div>
        <button
          onClick={() => onToggleFavorite(link)}
          className={`btn-icon w-8 h-8 ${link.favorite ? 'text-[var(--warning)]' : ''}`}
          style={link.favorite ? { backgroundColor: 'rgba(245, 158, 11, 0.15)' } : {}}
        >
          {link.favorite ? '⭐' : '☆'}
        </button>
      </div>

      <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-2 line-clamp-1">
        {link.title}
      </h3>

      <p className="text-[var(--text-muted)] text-sm mb-3 line-clamp-2 font-mono">
        {link.url}
      </p>

      {link.category && (
        <div className="mb-3">
          <span className="text-xs text-[var(--text-muted)]">Category:</span>
          <span className="text-sm text-[var(--text-secondary)] ml-2">{link.category}</span>
        </div>
      )}

      {link.tags && link.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {link.tags.map((tag, i) => (
            <span key={i} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
      )}

      {link.note && (
        <p className="text-[var(--text-muted)] text-sm mb-4 line-clamp-2 italic">
          &ldquo;{link.note}&rdquo;
        </p>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-[var(--glass-border)]">
        <button
          onClick={handleCopy}
          className="btn-icon flex-1 text-xs gap-1"
        >
          {isCopied ? '✓ Copied' : '📋 Copy'}
        </button>
        <button
          onClick={() => onEdit(link)}
          className="btn-icon flex-1 text-xs gap-1"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(link._id)}
          className="btn-icon flex-1 text-xs gap-1 hover:bg-[var(--error)]/20 hover:text-[var(--error)] hover:border-[var(--error)]/30"
        >
          🗑️ Delete
        </button>
      </div>

      <p className="text-xs text-[var(--text-muted)] mt-3">
        Added {new Date(link.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
