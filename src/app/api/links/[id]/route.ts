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
    const { title, url, category, tags, note, favorite } = body;

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (note !== undefined) updateData.note = note;
    if (favorite !== undefined) updateData.favorite = favorite;
    
    if (url !== undefined) {
      updateData.url = url;
      updateData.type = detectType(url);
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
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: link,
    });
  } catch (error) {
    console.error('PUT /api/links/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update link' },
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

    const link = await Link.findByIdAndDelete(id);

    if (!link) {
      return NextResponse.json(
        { success: false, error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Link deleted successfully' },
    });
  } catch (error) {
    console.error('DELETE /api/links/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}
