import { NextResponse } from 'next/server';
import { scrapeFeeds } from '@/lib/scraper';

export async function GET() {
  try {
    const articles = await scrapeFeeds();
    return NextResponse.json({ success: true, count: articles.length });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ success: false, error: 'Failed to scrape' }, { status: 500 });
  }
}
