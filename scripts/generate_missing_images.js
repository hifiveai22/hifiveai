const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const newsArticlesPath = path.join(__dirname, '../src/components/hifive/newsArticles.ts');
const fileContent = fs.readFileSync(newsArticlesPath, 'utf8');

const articleRegex = /id:\s*'([^']+)'[\s\S]*?title:\s*['"`]([\s\S]*?)['"`],\s*\n[\s\S]*?category:\s*'([^']+)'/g;

const articles = [];
let match;
while ((match = articleRegex.exec(fileContent)) !== null) {
  articles.push({
    id: match[1],
    title: match[2].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\n/g, ' '),
    category: match[3],
  });
}

console.log(`Found ${articles.length} articles in newsArticles.ts`);

const CATEGORY_COLORS = {
  'Company News':      { bg1: '#18140F', bg2: '#28231A', accent: '#B07D2E', text: '#E5C07B' },
  'AI in HR':          { bg1: '#0F0E1A', bg2: '#1D1A30', accent: '#8B5CF6', text: '#C4B5FD' },
  'Hiring Trends':     { bg1: '#18120F', bg2: '#2A1D15', accent: '#EA580C', text: '#FDBA74' },
  'Product Updates':   { bg1: '#0E1A14', bg2: '#162D20', accent: '#16A34A', text: '#86EFAC' },
  'Industry News':     { bg1: '#0F1520', bg2: '#182436', accent: '#2563EB', text: '#93C5FD' },
  'Compliance & HR Laws': { bg1: '#1A0E0E', bg2: '#2E1818', accent: '#DC2626', text: '#FCA5A5' },
  'Research Reports':  { bg1: '#140E1A', bg2: '#241830', accent: '#9333EA', text: '#E9D5FF' },
  'Customer Stories':  { bg1: '#0E171A', bg2: '#16282E', accent: '#0284C7', text: '#7DD3FC' },
};

const DEFAULT_COLOR = { bg1: '#18140F', bg2: '#28231A', accent: '#B07D2E', text: '#E5C07B' };

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, 'and')
    .replace(/</g, '')
    .replace(/>/g, '')
    .replace(/"/g, '')
    .replace(/'/g, '');
}

function wrapText(text, maxLen = 32) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach((w) => {
    if ((currentLine + ' ' + w).trim().length <= maxLen) {
      currentLine = (currentLine + ' ' + w).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = w;
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines.slice(0, 3);
}

function generateSvg(article) {
  const colors = CATEGORY_COLORS[article.category] || DEFAULT_COLOR;
  const safeTitleLines = wrapText(article.title);
  const safeCategory = escapeXml(article.category);
  const safeIcon = escapeXml(article.icon || '✨');

  const titleTspans = safeTitleLines
    .map((line, i) => `<tspan x="100" dy="${i === 0 ? 0 : 48}">${escapeXml(line)}</tspan>`)
    .join('');

  return `
  <svg width="1344" height="768" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${colors.bg1}" />
        <stop offset="60%" stop-color="${colors.bg2}" />
        <stop offset="100%" stop-color="${colors.bg1}" />
      </linearGradient>

      <radialGradient id="glow" cx="80%" cy="30%" r="65%">
        <stop offset="0%" stop-color="${colors.accent}" stop-opacity="0.38" />
        <stop offset="100%" stop-color="${colors.accent}" stop-opacity="0" />
      </radialGradient>

      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.02" />
      </linearGradient>

      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="${colors.accent}" stroke-opacity="0.08" stroke-width="1.5" />
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="1344" height="768" fill="url(#bgGrad)" />
    <rect width="1344" height="768" fill="url(#grid)" />
    <rect width="1344" height="768" fill="url(#glow)" />

    <!-- Ambient Geometric Graphics -->
    <circle cx="1080" cy="384" r="280" fill="none" stroke="${colors.accent}" stroke-opacity="0.14" stroke-width="2" stroke-dasharray="8 8" />
    <circle cx="1080" cy="384" r="180" fill="none" stroke="${colors.accent}" stroke-opacity="0.2" stroke-width="1.5" />
    <circle cx="1080" cy="384" r="80" fill="${colors.accent}" fill-opacity="0.12" />

    <!-- Connected Nodes Graphic -->
    <line x1="900" y1="260" x2="1080" y2="384" stroke="${colors.accent}" stroke-opacity="0.3" stroke-width="2" />
    <line x1="1260" y1="280" x2="1080" y2="384" stroke="${colors.accent}" stroke-opacity="0.3" stroke-width="2" />
    <line x1="1000" y1="520" x2="1080" y2="384" stroke="${colors.accent}" stroke-opacity="0.3" stroke-width="2" />

    <circle cx="900" cy="260" r="12" fill="${colors.accent}" fill-opacity="0.8" />
    <circle cx="1260" cy="280" r="14" fill="${colors.accent}" fill-opacity="0.6" />
    <circle cx="1000" cy="520" r="10" fill="${colors.accent}" fill-opacity="0.7" />
    <circle cx="1080" cy="384" r="24" fill="${colors.accent}" />

    <!-- Abstract Glass Card Banner -->
    <rect x="64" y="64" width="1216" height="640" rx="24" fill="url(#cardGrad)" stroke="${colors.accent}" stroke-opacity="0.25" stroke-width="2" />

    <!-- Badge / Icon Container -->
    <rect x="100" y="120" width="240" height="52" rx="26" fill="${colors.accent}" fill-opacity="0.2" stroke="${colors.accent}" stroke-width="1.5" />
    <circle cx="132" cy="146" r="10" fill="${colors.accent}" />
    <circle cx="132" cy="146" r="5" fill="#FFFFFF" />
    <text x="156" y="152" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="${colors.text}" letter-spacing="1">${safeCategory.toUpperCase()}</text>

    <!-- Title -->
    <text x="100" y="270" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="800" fill="#FFFFFF" letter-spacing="-0.5">
      ${titleTspans}
    </text>

    <!-- Footer Branding -->
    <line x1="100" y1="620" x2="1244" y2="620" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1" />
    <text x="100" y="655" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="${colors.accent}">
      HiFive AI
    </text>
    <text x="185" y="655" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="400" fill="#AAAAAA">
      • Research and Insights
    </text>
  </svg>
  `;
}

async function run() {
  const publicArticlesDir = path.join(__dirname, '../public/articles');
  if (!fs.existsSync(publicArticlesDir)) {
    fs.mkdirSync(publicArticlesDir, { recursive: true });
  }

  let generatedCount = 0;
  for (const article of articles) {
    const imgPath = path.join(publicArticlesDir, `${article.id}.png`);
    if (!fs.existsSync(imgPath)) {
      const svg = generateSvg(article);
      await sharp(Buffer.from(svg)).png().toFile(imgPath);
      console.log(`Generated: ${article.id}`);
      generatedCount++;
    }
  }
  console.log(`Done! Total generated: ${generatedCount}`);
}

run().catch(console.error);
