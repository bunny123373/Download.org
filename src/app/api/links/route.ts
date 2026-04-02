import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Link } from '@/models/Link';
import { detectType } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    const favorite = searchParams.get('favorite');
    const failed = searchParams.get('failed');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (favorite === 'true') {
      query.favorite = true;
    }

    if (failed === 'true') {
      query.failed = true;
    }

    const skip = (page - 1) * limit;
    
    const [links, total] = await Promise.all([
      Link.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Link.countDocuments(query),
    ]);

    const categories = await Link.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const stats = {
      total,
      favorites: await Link.countDocuments({ favorite: true }),
      categories: categories.length,
      recent: await Link.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      failed: await Link.countDocuments({ failed: true }),
    };

    return NextResponse.json({
      success: true,
      data: {
        links,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        stats,
      },
    });
  } catch (error) {
    console.error('GET /api/links error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Failed to fetch links', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, url, category, tags, note, favorite } = body;

    if (!title || !url || !category) {
      return NextResponse.json(
        { success: false, error: 'Title, URL, and category are required' },
        { status: 400 }
      );
    }

    const type = detectType(url);

    const link = await Link.create({
      title,
      url,
      category,
      tags: tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      note: note || '',
      favorite: favorite || false,
      type,
    });

    return NextResponse.json({
      success: true,
      data: link,
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/links error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Failed to create link', details: errorMessage },
      { status: 500 }
    );
  }
}
