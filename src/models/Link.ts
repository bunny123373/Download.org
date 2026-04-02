import mongoose, { Schema, Document } from 'mongoose';

export type LinkType = 'MP4' | 'HLS' | 'SUBTITLE' | 'IMAGE' | 'TOOL';

export interface ILink extends Document {
  title: string;
  url: string;
  category: string;
  tags: string[];
  note: string;
  favorite: boolean;
  type: LinkType;
  failed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LinkSchema = new Schema<ILink>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['MP4', 'HLS', 'SUBTITLE', 'IMAGE', 'TOOL'],
      required: true,
    },
    failed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

LinkSchema.index({ title: 'text', tags: 'text', category: 'text' });

export const Link = mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);