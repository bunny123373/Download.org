import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Link } from '@/models/Link';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const links = body.links || [];

    if (!Array.isArray(links) || links.length === 0) {
      return NextResponse.json({ success: false, error: 'No links to import' }, { status: 400 });
    }

    const importedLinks = await Link.insertMany(links.map(link => ({
      title: link.title,
      url: link.url,
      category: link.category || 'Tools',
      tags: link.tags || [],
      note: link.note || '',
      favorite: link.favorite || false,
      type: link.type || 'TOOL',
      failed: false,
      favicon: link.favicon || '',
    })));

    return NextResponse.json({ success: true, data: { count: importedLinks.length } }, { status: 201 });
  } catch (error) {
    console.error('POST /api/links/import error:', error);
    return NextResponse.json({ success: false, error: 'Failed to import links' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const links = await Link.find({ deletedAt: null }).sort({ createdAt: -1 });
    
    const exportData = links.map(link => ({
      title: link.title,
      url: link.url,
      category: link.category,
      tags: link.tags,
      note: link.note,
      favorite: link.favorite,
      type: link.type,
    }));

    return NextResponse.json({ success: true, data: exportData });
  } catch (error) {
    console.error('GET /api/links/export error:', error);
    return NextResponse.json({ success: false, error: 'Failed to export links' }, { status: 500 });
  }
}