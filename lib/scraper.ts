import Parser from 'rss-parser';
import fs from 'fs/promises';
import path from 'path';
import { Groq } from 'groq-sdk';

const parser = new Parser();

let groqClient: Groq | null = null;

function getGroqClient(): Groq | null {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn('GROQ_API_KEY environment variable is missing; enrichment will be skipped.');
      return null;
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

// ScraperAPI Proxy configuration
const scraperApiKey = process.env.SCRAPER_API_KEY;

const feeds = [
  'https://www.antaranews.com/rss/terkini.xml',
  'https://www.cnbcindonesia.com/news/rss',
  'https://www.tribunnews.com/rss',
  'https://feeds.bbci.co.uk/indonesia/rss.xml',
  'https://www.voaindonesia.com/api/',
  'https://www.okezone.com/rss/',
  'https://www.republika.co.id/rss',
  'https://www.sindonews.com/feed',
  'https://www.viva.co.id/get/all'
];

const POOL_FILE = path.join(process.cwd(), 'data', 'pool.json');

async function enrichArticle(content: string) {
  const client = getGroqClient();
  if (!client) return content;
  
  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Rewrite this news article to be more engaging, authoritative, and concise. Keep the core facts. Do not mention AI or any automated process. Article: ${content}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });
    return chatCompletion.choices[0]?.message?.content || content;
  } catch (error) {
    console.error('Groq API error:', error);
    return content;
  }
}

export async function scrapeFeeds() {
  const allArticles = [];
  
  for (const feedUrl of feeds) {
    try {
      // Use ScraperAPI to fetch the feed
      const response = await fetch(`http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(feedUrl)}`);
      const xml = await response.text();
      const feed = await parser.parseString(xml);
      
      for (const item of feed.items) {
        const enrichedContent = await enrichArticle(item.contentSnippet || item.content || '');
        allArticles.push({
          title: item.title,
          link: item.link,
          content: enrichedContent,
          pubDate: item.pubDate,
          source: feed.title,
          enriched: true,
        });
      }
    } catch (error) {
      console.error(`Error fetching ${feedUrl}:`, error);
    }
  }

  // Ensure data directory exists
  await fs.mkdir(path.dirname(POOL_FILE), { recursive: true });
  
  // Save to pool
  await fs.writeFile(POOL_FILE, JSON.stringify(allArticles, null, 2));
  return allArticles;
}
