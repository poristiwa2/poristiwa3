import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const POOL_FILE = path.join(process.cwd(), 'data', 'pool.json');

export async function GET() {
  try {
    // In Cloudflare Workers, we can't reliably use fs at runtime for dynamic data.
    // However, if the file is part of the build, we might be able to read it.
    // We use a try-catch to prevent worker crashes.
    try {
      // Check if file exists before reading
      await fs.access(POOL_FILE);
      const data = await fs.readFile(POOL_FILE, 'utf-8');
      return NextResponse.json(JSON.parse(data));
    } catch (e: any) {
      // If file doesn't exist, return empty array instead of crashing
      console.warn('Pool file not found or inaccessible at runtime:', e.message);
      return NextResponse.json([]);
    }
  } catch (error: any) {
    console.error('Critical error in pool GET:', error);
    // Return empty array instead of 500 to keep the UI working
    return NextResponse.json([]);
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Writing to filesystem is not supported on Cloudflare Workers' }, { status: 405 });
}
