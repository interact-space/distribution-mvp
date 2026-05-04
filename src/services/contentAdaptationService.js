const CHANNEL_PROFILES = {
  Zhihu: {
    format: 'Long-form Q&A',
    intent: 'Search discovery and expert explanation',
    keywords: ['GEO', 'cold start', 'B2B growth', 'content distribution'],
    baseScore: 86,
  },
  Xiaohongshu: {
    format: 'Short hook + practical bullets',
    intent: 'Lightweight awareness and founder discovery',
    keywords: ['startup growth', 'content workflow', 'automation', 'lead generation'],
    baseScore: 78,
  },
  LinkedIn: {
    format: 'Professional B2B post',
    intent: 'B2B visibility and decision-maker discovery',
    keywords: ['B2B SaaS', 'sales workflow', 'distribution system', 'growth operations'],
    baseScore: 90,
  },
  Reddit: {
    format: 'Discussion-first community post',
    intent: 'Community feedback and problem validation',
    keywords: ['indie hackers', 'distribution', 'cold start', 'community growth'],
    baseScore: 82,
  },
  'X / Twitter': {
    format: 'Short thread',
    intent: 'Fast awareness and founder audience testing',
    keywords: ['build in public', 'GEO', 'distribution', 'startup'],
    baseScore: 76,
  },
  Weibo: {
    format: 'Short social update',
    intent: 'Broad awareness and lightweight traffic testing',
    keywords: ['automation', 'content distribution', 'growth workflow'],
    baseScore: 70,
  },
};

function extractInputKeywords(keywords) {
  return keywords
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export function enrichPostWithGeoMetadata(post, inputKeywords = '') {
  const profile = CHANNEL_PROFILES[post.channel] || {
    format: 'General content asset',
    intent: 'General discovery',
    keywords: [],
    baseScore: 65,
  };

  const input = extractInputKeywords(inputKeywords);
  const geoKeywords = [...new Set([...input, ...profile.keywords])].slice(0, 6);

  const keywordBonus = Math.min(input.length * 2, 10);
  const bodyBonus = post.body.length > 350 ? 4 : 0;
  const channelFitScore = Math.min(100, profile.baseScore + keywordBonus + bodyBonus);

  return {
    ...post,
    format: profile.format,
    distributionIntent: profile.intent,
    geoKeywords,
    channelFitScore,
  };
}

export function getAverageChannelFit(posts) {
  if (!posts.length) return 0;
  const total = posts.reduce((sum, post) => sum + (post.channelFitScore || 0), 0);
  return Math.round(total / posts.length);
}
