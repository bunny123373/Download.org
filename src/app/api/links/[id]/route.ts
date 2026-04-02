import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Link } from '@/models/Link';
import { detectType } from '@/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    const { title, url, category, tags, note, favorite, failed, restore, permanent } = body;

    if (permanent) {
      const link = await Link.findByIdAndDelete(id);
      if (!link) {
        return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: { message: 'Link permanently deleted' } });
    }

    if (restore) {
      const link = await Link.findByIdAndUpdate(
        id,
        { deletedAt: null },
        { new: true }
      );
      if (!link) {
        return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: link });
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (note !== undefined) updateData.note = note;
    if (favorite !== undefined) updateData.favorite = favorite;
    if (failed !== undefined) updateData.failed = failed;
    
    if (url !== undefined) {
      updateData.url = url;
      updateData.type = detectType(url);
      updateData.favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`;
    }
    
    if (tags !== undefined) {
      updateData.tags = typeof tags === 'string' 
        ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : tags;
    }

    const link = await Link.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!link) {
      return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error('PUT /api/links/[id] error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Failed to update link', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const link = await Link.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!link) {
      return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { message: 'Link moved to trash' } });
  } catch (error) {
    console.error('DELETE /api/links/[id] error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Failed to delete link', details: errorMessage },
      { status: 500 }
    );
  }
}