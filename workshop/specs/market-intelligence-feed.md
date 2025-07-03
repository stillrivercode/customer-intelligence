# Market Intelligence Feed Specification

## Context
Account managers need to stay informed about customer activities, industry trends, and potential risks or opportunities through automated news monitoring and intelligent analysis.

## Requirements

### Functional Requirements
- [ ] Display recent news about customer company
- [ ] Filter by relevance and date
- [ ] Sentiment analysis on articles
- [ ] Highlight significant events (M&A, funding, layoffs)
- [ ] Link to full articles with source attribution
- [ ] Search and filter capabilities
- [ ] Export selected articles

### API Integration
- Use `/news` endpoint with company name and domain variations
- Implement intelligent search queries
- Cache results for 1 hour to minimize API calls
- Handle rate limiting gracefully with queuing

### Intelligence Features
- **Sentiment scoring** per article (positive/neutral/negative)
- **Keyword highlighting** for risk/opportunity indicators
- **Event classification** (funding, product launch, hiring, legal, etc.)
- **Relevance ranking** based on customer profile
- **Competitor mention detection**
- **Industry trend identification**

### UI Requirements
- Timeline view of articles with date grouping
- Card-based layout with article previews
- Filtering by sentiment, event type, and date range
- Infinite scroll or pagination for large datasets
- Share functionality for individual articles
- Save/bookmark important articles
- Email digest formatting option

## Component Interface

### Props
```typescript
interface MarketIntelligenceFeedProps {
  customer: Customer;
  maxArticles?: number; // default: 20
  refreshInterval?: number; // default: 30 minutes
  showFilters?: boolean; // default: true
  onArticleSelect?: (article: NewsArticle) => void;
}

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1 to 1
  eventType: EventType[];
  relevanceScore: number; // 0-1
  keywords: string[];
  summary?: string;
}

type EventType = 
  | 'funding' 
  | 'acquisition' 
  | 'product_launch' 
  | 'hiring' 
  | 'layoffs' 
  | 'legal' 
  | 'partnership' 
  | 'expansion'
  | 'financial_results';
```

### State Management
```typescript
interface MarketIntelligenceState {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  filters: {
    sentiment: string[];
    eventTypes: EventType[];
    dateRange: { start: Date; end: Date };
    searchQuery: string;
  };
  pagination: {
    page: number;
    hasMore: boolean;
  };
  lastFetch: string;
}
```

## Intelligence Processing

### Search Query Generation
```javascript
const generateSearchQueries = (customer) => {
  const queries = [
    customer.name,
    customer.domain.replace('.com', '').replace('.', ' '),
    `"${customer.name}"`, // exact match
  ];
  
  // Add CEO/founder names if available
  if (customer.contacts) {
    customer.contacts
      .filter(c => c.role.includes('CEO') || c.role.includes('Founder'))
      .forEach(c => queries.push(`"${c.name}"`));
  }
  
  return [...new Set(queries)]; // Remove duplicates
};
```

### Sentiment Analysis
```javascript
const analyzeSentiment = (article) => {
  const positiveKeywords = [
    'growth', 'expansion', 'funding', 'success', 'launch', 
    'partnership', 'innovation', 'award', 'milestone', 'breakthrough'
  ];
  
  const negativeKeywords = [
    'layoffs', 'decline', 'loss', 'bankruptcy', 'lawsuit', 
    'scandal', 'breach', 'failure', 'criticism', 'controversy'
  ];
  
  const text = `${article.title} ${article.description}`.toLowerCase();
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveKeywords.forEach(keyword => {
    if (text.includes(keyword)) positiveScore++;
  });
  
  negativeKeywords.forEach(keyword => {
    if (text.includes(keyword)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
};
```

### Event Classification
```javascript
const classifyEvent = (article) => {
  const eventPatterns = {
    funding: /funding|investment|raised|series [a-z]|vc|venture/i,
    acquisition: /acquired|acquisition|merger|bought|purchased/i,
    product_launch: /launch|unveil|announce|introduce|release/i,
    hiring: /hiring|recruit|appoint|joins|new.*hire/i,
    layoffs: /layoffs|fired|restructur|downsize|cut.*jobs/i,
    legal: /lawsuit|legal|court|sue|litigation|settlement/i,
    partnership: /partner|alliance|collaboration|joint/i,
    expansion: /expand|new.*office|international|global/i,
    financial_results: /earnings|revenue|profit|quarter|financial/i
  };
  
  const text = `${article.title} ${article.description}`;
  const events = [];
  
  Object.entries(eventPatterns).forEach(([event, pattern]) => {
    if (pattern.test(text)) {
      events.push(event);
    }
  });
  
  return events;
};
```

### Relevance Scoring
```javascript
const calculateRelevance = (article, customer) => {
  let score = 0.5; // Base relevance
  
  // Exact name matches get higher score
  if (article.title.includes(customer.name)) score += 0.3;
  if (article.description.includes(customer.name)) score += 0.2;
  
  // Industry relevance
  if (article.description.includes(customer.industry.toLowerCase())) {
    score += 0.2;
  }
  
  // Recency boost (newer articles more relevant)
  const daysOld = (Date.now() - new Date(article.publishedAt)) / (1000 * 60 * 60 * 24);
  if (daysOld < 7) score += 0.1;
  if (daysOld < 1) score += 0.1;
  
  // Event type importance
  const highImportanceEvents = ['funding', 'acquisition', 'layoffs'];
  if (article.eventType.some(event => highImportanceEvents.includes(event))) {
    score += 0.2;
  }
  
  return Math.min(1, score); // Cap at 1.0
};
```

## Visual Specifications

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│  Market Intelligence Feed                       │
│  ┌─────────────────┐ ┌─────────────────────────┐ │
│  │ Summary         │ │ Filters                 │ │
│  │ 15 Articles     │ │ [Sentiment] [Events]    │ │
│  │ 60% Positive    │ │ [Date Range] [Search]   │ │
│  │ 2 Critical      │ │                         │ │
│  └─────────────────┘ └─────────────────────────┘ │
│                                                 │
│  ┌─────────────────────────────────────────────┐ │
│  │ 📈 TechVentures raises $50M Series B        │ │
│  │ 2 hours ago • TechCrunch • 🟢 Positive      │ │
│  │ [FUNDING] TechVentures Inc announced...     │ │
│  │ [Read More] [Share] [Save]                  │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  ┌─────────────────────────────────────────────┐ │
│  │ ⚠️ GitHub faces service outage              │ │
│  │ 4 hours ago • The Verge • 🔴 Negative       │ │
│  │ [TECHNICAL] Users report widespread...      │ │
│  │ [Read More] [Share] [Save]                  │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  [Load More Articles]                           │
└─────────────────────────────────────────────────┘
```

### Color Coding
- **Positive Sentiment**: `bg-green-50 border-green-200 text-green-800`
- **Neutral Sentiment**: `bg-gray-50 border-gray-200 text-gray-800`
- **Negative Sentiment**: `bg-red-50 border-red-200 text-red-800`

### Event Type Badges
```javascript
const eventTypeStyles = {
  funding: 'bg-blue-100 text-blue-800',
  acquisition: 'bg-purple-100 text-purple-800',
  product_launch: 'bg-green-100 text-green-800',
  hiring: 'bg-cyan-100 text-cyan-800',
  layoffs: 'bg-red-100 text-red-800',
  legal: 'bg-yellow-100 text-yellow-800',
  partnership: 'bg-indigo-100 text-indigo-800',
  expansion: 'bg-emerald-100 text-emerald-800',
  financial_results: 'bg-orange-100 text-orange-800'
};
```

## Performance Optimizations

### Caching Strategy
```javascript
const articleCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const getCachedArticles = (customerId) => {
  const cached = articleCache.get(customerId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.articles;
  }
  return null;
};
```

### Virtualization for Large Lists
```javascript
// Use react-window for performance with many articles
import { FixedSizeList as List } from 'react-window';

const VirtualizedArticleList = ({ articles, height = 600 }) => (
  <List
    height={height}
    itemCount={articles.length}
    itemSize={120}
    itemData={articles}
  >
    {ArticleItem}
  </List>
);
```

### Debounced Search
```javascript
import { useMemo, useState } from 'react';
import { debounce } from 'lodash';

const useSearch = (articles, delay = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearch = useMemo(
    () => debounce((term) => setSearchTerm(term), delay),
    [delay]
  );
  
  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articles;
    return articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);
  
  return { filteredArticles, debouncedSearch };
};
```

## Error Handling

### API Error Recovery
```javascript
const handleAPIError = (error, retryFn) => {
  console.error('Market intelligence fetch failed:', error);
  
  // Check if it's a rate limit error
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers['retry-after'] || 60;
    setTimeout(retryFn, retryAfter * 1000);
    return;
  }
  
  // For other errors, show user-friendly message
  setError('Unable to fetch latest news. Please try again later.');
};
```

### Graceful Loading States
```jsx
const LoadingState = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="border rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
    ))}
  </div>
);
```

## Accessibility Features

### Screen Reader Support
```jsx
<article
  role="article"
  aria-labelledby={`article-title-${article.id}`}
  aria-describedby={`article-summary-${article.id}`}
>
  <h3 id={`article-title-${article.id}`}>
    {article.title}
  </h3>
  <p id={`article-summary-${article.id}`}>
    {article.description}
  </p>
  <div aria-label={`Sentiment: ${article.sentiment}`}>
    {getSentimentIcon(article.sentiment)}
  </div>
</article>
```

### Keyboard Navigation
- Tab through articles sequentially
- Enter/Space to open article links
- Arrow keys for quick navigation
- Escape to close modals/overlays

## Testing Strategy

### Unit Tests
- Sentiment analysis accuracy
- Event classification precision
- Relevance scoring consistency
- Filter logic validation

### Integration Tests
- API integration with rate limiting
- Cache invalidation behavior
- Error recovery mechanisms
- Performance under load

### User Experience Tests
- Loading state transitions
- Filter responsiveness
- Infinite scroll behavior
- Mobile touch interactions

## Acceptance Criteria
- [ ] Displays 10+ most recent relevant articles
- [ ] Updates hourly without user intervention
- [ ] Sentiment analysis accuracy > 80%
- [ ] Event classification covers major categories
- [ ] Mobile-friendly responsive design
- [ ] Export functionality works reliably
- [ ] Search and filtering perform smoothly
- [ ] Loading states prevent layout shift
- [ ] Error handling is user-friendly
- [ ] Accessibility standards met (WCAG 2.1)

## Export Functionality

### Article Export Formats
```javascript
const exportArticles = (articles, format = 'json') => {
  switch (format) {
    case 'json':
      return JSON.stringify(articles, null, 2);
    
    case 'csv':
      return convertToCSV(articles);
    
    case 'markdown':
      return articles.map(article => 
        `# ${article.title}\n\n${article.description}\n\n**Source:** ${article.source}\n**Date:** ${article.publishedAt}\n**Sentiment:** ${article.sentiment}\n\n---\n\n`
      ).join('');
    
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};
```

This specification provides comprehensive guidance for building a sophisticated market intelligence feed that delivers real business value to customer success teams.