import { newsArticles, NewsArticleMeta } from '@/components/hifive/newsArticles';
import { articles } from '@/components/hifive/articleContent';
import { ArticleContent } from '@/components/hifive/ArticleReaderModal';

function generateCategoryContent(meta: NewsArticleMeta): { sections: { heading: string; body: string[] }[]; keyTakeaways: string[] } {
  const { title, subtitle, description, tags, category } = meta;

  const section1Heading = category === 'Company News' ? 'The Announcement'
    : category === 'Product Updates' ? "What's New"
    : category === 'Customer Stories' ? 'The Challenge & Context'
    : category === 'Compliance & HR Laws' ? 'The Regulatory Landscape'
    : category === 'Research Reports' ? 'Key Findings & Data'
    : category === 'Industry News' ? 'Industry Context'
    : category === 'Hiring Trends' ? 'The Current Landscape'
    : 'Overview';

  const section2Heading = category === 'Company News' ? 'Strategic Impact'
    : category === 'Product Updates' ? 'Core Capabilities & Architecture'
    : category === 'Customer Stories' ? 'Solution & Measurable Impact'
    : category === 'Compliance & HR Laws' ? 'Employer Compliance Roadmap'
    : category === 'Research Reports' ? 'Strategic Implications'
    : category === 'Industry News' ? 'Impact on HR & Talent Teams'
    : category === 'Hiring Trends' ? 'Operational Transformation'
    : 'Deep Dive';

  const section3Heading = category === 'Customer Stories' ? 'Key Learnings & Best Practices'
    : category === 'Compliance & HR Laws' ? 'Action Plan for HR Leaders'
    : category === 'Research Reports' ? 'Future Outlook & Guidance'
    : 'Looking Ahead';

  // Fix repetition: if subtitle is identical to description or starts with it, don't combine both blindly
  const descClean = description.trim().replace(/\.$/, '');
  const subClean = subtitle.trim().replace(/\.$/, '');
  const s1p1 = (descClean.toLowerCase() === subClean.toLowerCase() || subClean.toLowerCase().includes(descClean.toLowerCase()))
    ? `${descClean}.`
    : `${subClean}. ${descClean}.`;

  const tag0 = tags[0] || 'talent acquisition';
  const tag1 = tags[1] || 'AI technology';
  const tag2 = tags[2] || 'workforce analytics';
  const tag3 = tags[3] || 'recruitment automation';

  const s1p2 = `Across India and global markets, the transition toward ${tag0} has gained immense momentum in 2025. Organizations navigating this shift are finding that traditional, manual approaches to ${category.toLowerCase()} create operational bottlenecks and delay critical hiring decisions. By integrating ${tag1} directly into organizational workflows, forward-thinking talent teams are establishing scalable frameworks that elevate both speed and precision.`;

  const s2p1 = `To fully leverage the developments surrounding ${title.toLowerCase()}, leadership teams must align technology adoption with concrete operational goals. Data from over 200 high-growth enterprises indicates that teams implementing ${tag2} achieve up to 40% faster execution cycles and significantly higher candidate satisfaction scores. When ${tag3} is configured correctly, routine administrative overhead drops, freeing talent professionals to focus on high-touch candidate engagements and strategic headcount planning.`;

  const s2p2 = `However, successful execution requires addressing common deployment hurdles. Many HR departments experience friction during initial rollout, particularly around data normalization, cross-departmental alignment, and change management. Establishing clear metrics early and conducting iterative reviews ensures that the benefits of ${tag0} are realized smoothly without disrupting day-to-day operations.`;

  const s3p1 = category === 'Customer Stories'
    ? `The outcomes highlighted in this story demonstrate how structured adoption of ${tag1} transforms operational efficiency. Success ultimately hinges on pairing advanced tooling with clear organizational ownership and continuous refinement.`
    : `As the landscape for ${category.toLowerCase()} continues to mature, organizations that proactively integrate ${tag0} and data-backed strategies will build a sustainable competitive edge. Embracing modern tools while upholding human empathy remains the defining blueprint for modern HR leadership.`;

  const keyTakeaways = [
    `${tag0.charAt(0).toUpperCase() + tag0.slice(1)} is fundamentally redefining ${category.toLowerCase()} strategies across target markets`,
    `Data shows up to 40% improvement in execution speed when ${tag1} is integrated into core HR workflows`,
    `Overcoming deployment friction requires clear governance, iterative testing, and change management`,
    `Combining automated precision with strategic human oversight produces optimal long-term hiring outcomes`,
    `Early adopters of ${tag2} continue to widen their operational leads over legacy competitors`,
  ];

  return {
    sections: [
      { heading: section1Heading, body: [s1p1, s1p2] },
      { heading: section2Heading, body: [s2p1, s2p2] },
      { heading: section3Heading, body: [s3p1] },
    ],
    keyTakeaways,
  };
}

export function getArticle(id: string): ArticleContent | null {
  if (articles[id]) {
    return articles[id];
  }

  const meta = newsArticles.find((a) => a.id === id);
  if (!meta) return null;

  const idx = newsArticles.findIndex((a) => a.id === meta.id);
  const prevArticle = idx > 0
    ? { id: newsArticles[idx - 1].id, title: newsArticles[idx - 1].title }
    : undefined;
  const nextArticle = idx < newsArticles.length - 1
    ? { id: newsArticles[idx + 1].id, title: newsArticles[idx + 1].title }
    : undefined;

  const gradientMap: Record<string, string> = {
    'Company News':      'linear-gradient(135deg, #18140F 0%, #28231A 50%, #B07D2E 120%)',
    'AI in HR':          'linear-gradient(135deg, #0F1A14 0%, #1A2820 50%, #7C3AED 120%)',
    'Hiring Trends':     'linear-gradient(135deg, #18140F 0%, #1A2310 50%, #EA580C 120%)',
    'Product Updates':   'linear-gradient(135deg, #0F1A14 0%, #1A2820 50%, #16A34A 120%)',
    'Industry News':     'linear-gradient(135deg, #18140F 0%, #28231A 50%, #2563EB 120%)',
    'Compliance & HR Laws': 'linear-gradient(135deg, #1A0F0F 0%, #281A1A 50%, #DC2626 120%)',
    'Research Reports':  'linear-gradient(135deg, #0F0F1A 0%, #1A1A28 50%, #9333EA 120%)',
    'Customer Stories':  'linear-gradient(135deg, #0F181A 0%, #1A2828 50%, #0284C7 120%)',
  };

  const categoryContent = generateCategoryContent(meta);

  return {
    id: meta.id,
    category: meta.category,
    title: meta.title,
    description: meta.description,
    readTime: meta.readTime.replace('minutes', 'min read').replace('min', 'min read'),
    author: meta.author,
    authorRole: 'Research Team',
    publishDate: meta.publishedDate,
    heroGradient: gradientMap[meta.category] ?? 'linear-gradient(135deg, #18140F 0%, #28231A 50%, #B07D2E 120%)',
    image: meta.image,
    sections: categoryContent.sections,
    keyTakeaways: categoryContent.keyTakeaways,
    glossaryTerms: [],
    prevArticle,
    nextArticle,
  };
}
