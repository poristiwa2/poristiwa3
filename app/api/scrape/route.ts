import { NextResponse } from 'next/server';
import { scrapeFeeds } from '@/lib/scraper';

export async function GET() {
  return NextResponse.json({ 
    success: false, 
    message: 'Scraping is handled via GitHub Actions and is not supported at runtime on Cloudflare Workers.' 
  }, { status: 403 });
}
