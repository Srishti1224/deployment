// youtube_recommend.ts
import fs from 'fs';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function fetchYouTubeVideos(topic: string): Promise<string[]> {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' tutorial')}`;
  const res = await fetch(searchUrl);
  const html = await res.text();

  const $ = cheerio.load(html);
  const links = new Set<string>();

  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href?.startsWith('/watch')) {
      links.add('https://www.youtube.com' + href);
    }
  });

  return Array.from(links).slice(0, 3); // Top 3 videos
}

async function generateYouTubeRecommendations(weakTopics: string[]) {
  const recommendations: Record<string, string[]> = {};

  for (const topic of weakTopics) {
    console.log(`🔍 Fetching videos for: ${topic}`);
    const videos = await fetchYouTubeVideos(topic);
    recommendations[topic] = videos;
  }

  fs.writeFileSync('youtube_recommendations.json', JSON.stringify(recommendations, null, 2));
  console.log('\n✅ YouTube recommendations saved to youtube_recommendations.json');
}

// Example weak topics (can be passed dynamically from quiz analysis)
const weakTopics = ['Binary Search', 'Time Complexity', 'Graph Traversal'];
generateYouTubeRecommendations(weakTopics);
