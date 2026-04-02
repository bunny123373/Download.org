export type LinkType = 'MP4' | 'HLS' | 'SUBTITLE' | 'IMAGE' | 'TOOL';

export interface Link {
  _id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  note: string;
  favorite: boolean;
  type: LinkType;
  createdAt: string;
  updatedAt: string;
}

export interface LinkFormData {
  title: string;
  url: string;
  category: string;
  tags: string;
  note: string;
  favorite: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LinksResponse {
  links: Link[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Stats {
  total: number;
  favorites: number;
  categories: number;
  recent: number;
}

export type Category = {
  name: string;
  count: number;
  color: string;
  icon: string;
};

export const CATEGORIES: Category[] = [
  { name: 'Movies', count: 0, color: '#6366f1', icon: '🎬' },
  { name: 'MP4', count: 0, color: '#22c55e', icon: '🎥' },
  { name: 'HLS', count: 0, color: '#f59e0b', icon: '📡' },
  { name: 'Subtitles', count: 0, color: '#ec4899', icon: '📝' },
  { name: 'Images', count: 0, color: '#06b6d4', icon: '🖼️' },
  { name: 'Tools', count: 0, color: '#8b5cf6', icon: '🔧' },
];

export const LINK_TYPES: Record<string, LinkType> = {
  mp4: 'MP4',
  m4v: 'MP4',
  webm: 'MP4',
  mkv: 'MP4',
  mov: 'MP4',
  m3u8: 'HLS',
  m3u: 'HLS',
  srt: 'SUBTITLE',
  vtt: 'SUBTITLE',
  ass: 'SUBTITLE',
  jpg: 'IMAGE',
  jpeg: 'IMAGE',
  png: 'IMAGE',
  gif: 'IMAGE',
  webp: 'IMAGE',
  svg: 'IMAGE',
};

export function detectType(url: string): LinkType {
  const urlLower = url.toLowerCase();
  
  for (const [ext, type] of Object.entries(LINK_TYPES)) {
    if (urlLower.includes(`.${ext}`)) {
      return type;
    }
  }
  
  return 'TOOL';
}

export function getTypeColor(type: LinkType): string {
  const colors: Record<LinkType, string> = {
    MP4: '#22c55e',
    HLS: '#f59e0b',
    SUBTITLE: '#ec4899',
    IMAGE: '#06b6d4',
    TOOL: '#8b5cf6',
  };
  return colors[type];
}

export function getTypeIcon(type: LinkType): string {
  const icons: Record<LinkType, string> = {
    MP4: '🎥',
    HLS: '📡',
    SUBTITLE: '📝',
    IMAGE: '🖼️',
    TOOL: '🔧',
  };
  return icons[type];
}