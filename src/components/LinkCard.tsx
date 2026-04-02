'use client';

import { Link as LinkType } from '@/types';
import { getTypeColor, getTypeIcon } from '@/types';
import { useState } from 'react';

interface LinkCardProps {
  link: LinkType;
  onEdit: (link: LinkType) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (link: LinkType) => void;
  onMarkFailed?: (id: string, failed: boolean) => void;
  index?: number;
}

export default function LinkCard({ link, onEdit, onDelete, onToggleFavorite, onMarkFailed, index = 0 }: LinkCardProps) {
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
      className={`glass-card p-3 md:p-4 lg:p-5 animate-fade-in stagger-${(index % 8) + 1} ${link.failed ? 'border-[var(--error)]/50' : ''}`}
      style={{ opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span 
            className="type-badge text-[10px] md:text-xs"
            style={{ 
              backgroundColor: link.failed ? 'rgba(239, 68, 68, 0.2)' : `${typeColor}20`,
              color: link.failed ? '#ef4444' : typeColor,
              border: `1px solid ${link.failed ? 'rgba(239, 68, 68, 0.4)' : `${typeColor}40`}`
            }}
          >
            <span className="text-xs">{link.failed ? '❌' : typeIcon}</span>
            {link.failed ? 'FAILED' : link.type}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onMarkFailed && (
            <button
              onClick={() => onMarkFailed(link._id, !link.failed)}
              className={`btn-icon w-6 h-6 md:w-7 md:h-7 flex-shrink-0 ${link.failed ? 'text-[var(--error)]' : 'text-[var(--text-muted)]'}`}
              title={link.failed ? 'Mark as working' : 'Mark as failed'}
            >
              {link.failed ? '↩️' : '⚠️'}
            </button>
          )}
          <button
            onClick={() => onToggleFavorite(link)}
            className={`btn-icon w-6 h-6 md:w-7 md:h-7 flex-shrink-0 ${link.favorite ? 'text-[var(--warning)]' : ''}`}
            style={link.favorite ? { backgroundColor: 'rgba(245, 158, 11, 0.15)' } : {}}
          >
            {link.favorite ? '⭐' : '☆'}
          </button>
        </div>
      </div>

      <h3 className="text-sm md:text-base lg:text-lg font-semibold text-[var(--text-primary)] mb-1 md:mb-2 line-clamp-1">
        {link.title}
      </h3>

      <p className={`text-xs md:text-sm mb-2 md:mb-3 line-clamp-1 md:line-clamp-2 font-mono ${link.failed ? 'text-[var(--error)]/70' : 'text-[var(--text-muted)]'}`}>
        {link.url}
      </p>

      {link.category && (
        <div className="mb-2 md:mb-3">
          <span className="text-[10px] md:text-xs text-[var(--text-muted)]">Category:</span>
          <span className="text-xs md:text-sm text-[var(--text-secondary)] ml-1 md:ml-2">{link.category}</span>
        </div>
      )}

      {link.tags && link.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-3">
          {link.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="tag-pill text-[10px] md:text-xs">
              {tag}
            </span>
          ))}
          {link.tags.length > 3 && (
            <span className="tag-pill text-[10px] md:text-xs">+{link.tags.length - 3}</span>
          )}
        </div>
      )}

      {link.note && (
        <p className="text-xs md:text-sm text-[var(--text-muted)] mb-2 md:mb-4 line-clamp-1 md:line-clamp-2 italic hidden sm:block">
          &ldquo;{link.note}&rdquo;
        </p>
      )}

      <div className="flex items-center gap-1 md:gap-2 pt-2 md:pt-3 border-t border-[var(--glass-border)]">
        <button
          onClick={handleCopy}
          className="btn-icon flex-1 text-[10px] md:text-xs py-1.5 md:py-2"
        >
          {isCopied ? '✓' : '📋'}
        </button>
        <button
          onClick={() => onEdit(link)}
          className="btn-icon flex-1 text-[10px] md:text-xs py-1.5 md:py-2"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(link._id)}
          className="btn-icon flex-1 text-[10px] md:text-xs py-1.5 md:py-2 hover:bg-[var(--error)]/20 hover:text-[var(--error)]"
        >
          🗑️
        </button>
      </div>

      <p className="text-[10px] md:text-xs text-[var(--text-muted)] mt-2 md:mt-3 hidden md:block">
        {new Date(link.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}