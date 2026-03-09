import { scrapeFeeds } from '../lib/scraper';

async function run() {
  console.log('Starting scrape...');
  await scrapeFeeds();
  console.log('Scrape complete.');
}

run().catch(console.error);
