# Phase 3: Intelligence Layer (45 minutes)

**Objective**: Build health scoring and insights with composite data analysis

## Learning Goals

By the end of this phase, you will:
- ✅ Implement customer health score calculation
- ✅ Create trend analysis and predictive indicators
- ✅ Build market intelligence with news sentiment
- ✅ Add geographic insights for business context
- ✅ Understand complex data orchestration with AI

## DDD Focus

1. **Complex specification** for scoring algorithms and business logic
2. **Multi-agent coordination** for different data sources
3. **Performance optimization** with intelligent caching and batching

## Tasks Overview

### Task 3.1: Health Score Calculator (15 minutes)

**Specification**: Create a comprehensive health scoring algorithm that combines multiple data points into a single actionable metric.

**Create**: `workshop/specs/health-score-algorithm.md`

```markdown
# Customer Health Score Algorithm Specification

## Context
Customer Success Managers need a single, reliable metric that represents 
overall customer health, combining technical, market, and engagement factors 
into an actionable score (0-100).

## Algorithm Design

### Health Score Formula
```
Health Score = (0.25 × Domain Stability) + 
               (0.25 × Website Health) + 
               (0.25 × Market Presence) + 
               (0.25 × Engagement Level)
```

### Factor Calculations

#### Domain Stability (25%)
- **Domain Age**: Points based on years registered
  - < 1 year: 20 points
  - 1-3 years: 50 points  
  - 3-5 years: 80 points
  - 5+ years: 100 points
- **Registration Status**: Active = 100, Expired = 0

#### Website Health (25%)
- **Availability**: HTTP status 200 = 100, others = 0
- **SSL Certificate**: Valid = 100, Invalid = 50, None = 0
- **Response Time**: < 2s = 100, 2-5s = 70, > 5s = 30

#### Market Presence (25%)
- **News Mentions**: Recent articles count
  - 0 articles: 10 points
  - 1-3 articles: 40 points
  - 4-10 articles: 80 points
  - 10+ articles: 100 points
- **Sentiment Score**: Average sentiment of mentions
  - Positive: +20 points
  - Neutral: 0 points
  - Negative: -20 points

#### Engagement Level (25%)
- **Recency**: Days since last activity
  - < 7 days: 100 points
  - 7-30 days: 70 points
  - 30-90 days: 40 points
  - > 90 days: 10 points
- **Tier Factor**: Enterprise = 1.2x, Growth = 1.0x, Startup = 0.8x

### Trend Calculation
- **Improving**: Score > 80 OR recent positive news
- **Stable**: Score 50-80 AND consistent engagement
- **Declining**: Score < 50 OR negative sentiment OR no recent activity

## Output Format
```javascript
{
  overall: 85,
  trend: 'improving',
  breakdown: {
    domain: { score: 90, weight: 0.25, details: {...} },
    website: { score: 100, weight: 0.25, details: {...} },
    market: { score: 70, weight: 0.25, details: {...} },
    engagement: { score: 80, weight: 0.25, details: {...} }
  },
  lastUpdated: '2024-12-30T10:00:00Z',
  confidence: 'high' // high/medium/low based on data availability
}
```

## Requirements
- Handle missing data gracefully (default to neutral scores)
- Cache calculations for 15 minutes
- Provide detailed breakdown for debugging
- Include confidence level based on data completeness
```

**Generate Implementation**:

**AI Prompt**:
```
Create a health score calculator based on the specification above.

Requirements:
- Implement the exact formula and factor calculations
- Handle missing or invalid data gracefully
- Return detailed breakdown for transparency
- Include trend analysis logic
- Add confidence scoring based on data availability
- Use TypeScript for type safety
- Include comprehensive JSDoc documentation
- Add unit test helpers for validation

File: src/utils/healthCalculator.js

The function should accept:
- customer: Customer object with internal data
- apiData: Object containing API responses from various endpoints
- options: Configuration options (weights, thresholds, etc.)
```

**Expected Structure**:
```javascript
/**
 * Calculate comprehensive customer health score
 * @param {Object} customer - Customer data
 * @param {Object} apiData - API responses
 * @param {Object} options - Configuration
 * @returns {Object} Health score with breakdown
 */
export const calculateHealthScore = (customer, apiData, options = {}) => {
  // Implementation here
};
```

### Task 3.2: Market Intelligence Widget (15 minutes)

**Specification**: Create a widget that displays company news with sentiment analysis and trend identification.

**Create**: `workshop/specs/market-intelligence-widget.md`

```markdown
# Market Intelligence Widget Specification

## Context
Account managers need real-time awareness of customer company activities, 
industry developments, and potential risks or opportunities through 
automated news monitoring and analysis.

## Requirements

### Functional Requirements
- [ ] Fetch recent news about customer company
- [ ] Analyze sentiment of each article (positive/neutral/negative)
- [ ] Highlight significant events (funding, M&A, layoffs, product launches)
- [ ] Filter articles by relevance and recency
- [ ] Provide summary of overall market sentiment
- [ ] Link to full articles for detailed reading

### Intelligence Features
- **Keyword Detection**: Identify risk/opportunity indicators
- **Sentiment Analysis**: Basic positive/negative/neutral scoring
- **Event Classification**: Categorize news types
- **Relevance Scoring**: Rank articles by importance to account management

### Visual Design
- Timeline view of recent articles
- Color-coded sentiment indicators
- Event type badges (funding, product, hiring, etc.)
- Summary metrics at top (total articles, sentiment distribution)
- Expandable article previews

## Data Processing
- Search variations: company name, domain, CEO name
- Filter noise (unrelated articles)
- Deduplicate similar articles
- Sort by publication date and relevance
```

**Generate Component**:

**AI Prompt**:
```
Create a MarketIntelligenceWidget React component based on the specification.

Features needed:
- Fetch news using apiNinjas.news()
- Implement basic sentiment analysis (keyword-based)
- Categorize news types (funding, product, hiring, etc.)
- Timeline display with article cards
- Summary metrics showing total articles and sentiment breakdown
- Loading states and error handling
- Automatic refresh every 30 minutes

Props:
- customer: Customer object
- maxArticles?: number (default: 10)

Use Tailwind CSS for styling with:
- Timeline layout
- Sentiment color coding (green/yellow/red)
- Event type badges
- Hover effects and animations
```

### Task 3.3: Geographic Insights Widget (10 minutes)

**Create a widget showing business environment data**:

**AI Prompt**:
```
Create a GeographicInsightsWidget that:
- Fetches city and country data for customer location
- Displays key demographics and business indicators
- Shows timezone information for optimal contact times
- Includes holiday calendar for communication planning
- Provides business environment context (GDP, business ranking, etc.)

Use API endpoints:
- /city for demographic data
- /country for business environment
- /timezone for contact optimization
- /holidays for communication planning

Visual design:
- Card layout with sections for different data types
- Icons for each data category
- Business-friendly formatting
- Interactive elements for exploring data
```

### Task 3.4: Composite Health Dashboard (5 minutes)

**Integration**: Combine all widgets into a comprehensive health dashboard:

**AI Prompt**:
```
Create a CustomerHealthDashboard component that:
- Orchestrates data fetching from all API endpoints
- Calculates overall health score using healthCalculator
- Displays DomainHealthWidget, MarketIntelligenceWidget, GeographicInsightsWidget
- Shows summary health score with trend indicator
- Handles loading states for the entire dashboard
- Implements refresh functionality
- Provides export capabilities for reports

Layout:
- Health score prominently at top
- Widgets in responsive grid below
- Action buttons for refresh and export
- Last updated timestamp
```

## Testing Your Implementation

### Task 3.5: Health Score Validation (5 minutes)

Test your health calculator with known scenarios:

```javascript
// Test perfect score scenario
const perfectCustomer = {
  lastActivity: new Date().toISOString(),
  tier: 'Enterprise'
};

const perfectApiData = {
  whois: { created_date: '2015-01-01', status: 'active' },
  urlStatus: { status: 200, ssl: true },
  news: { 
    articles: Array(12).fill({ sentiment: 'positive' })
  }
};

const result = calculateHealthScore(perfectCustomer, perfectApiData);
console.log('Perfect score:', result.overall); // Should be ~100

// Test declining scenario
const decliningApiData = {
  whois: { created_date: '2024-01-01' },
  urlStatus: { status: 500 },
  news: { articles: [] }
};

const declining = calculateHealthScore(
  { lastActivity: '2024-01-01', tier: 'Startup' }, 
  decliningApiData
);
console.log('Declining score:', declining.overall); // Should be low
```

## Validation Checklist

After completing the tasks, verify:

- [ ] **Health Calculation**: Scores match expected algorithm
- [ ] **News Analysis**: Articles fetched and sentiment analyzed
- [ ] **Geographic Data**: Location insights displayed correctly
- [ ] **Data Orchestration**: All widgets working together
- [ ] **Performance**: Dashboard loads efficiently
- [ ] **Error Resilience**: Graceful handling of API failures

## Common Issues & Solutions

### Issue: Health score seems wrong
**Solution**: Add debugging to see factor breakdown:
```javascript
console.log('Health breakdown:', {
  domain: domainScore,
  website: websiteScore,
  market: marketScore,
  engagement: engagementScore,
  final: overall
});
```

### Issue: News sentiment inaccurate
**Solution**: Improve keyword-based sentiment:
```javascript
const sentimentKeywords = {
  positive: ['growth', 'expansion', 'funding', 'success', 'launch'],
  negative: ['layoffs', 'decline', 'loss', 'bankruptcy', 'lawsuit'],
  neutral: ['update', 'announcement', 'statement']
};
```

### Issue: Too many API calls
**Solution**: Implement intelligent batching:
```javascript
// Batch related calls
const fetchCustomerIntelligence = async (customer) => {
  const [domainData, newsData, locationData] = await Promise.all([
    apiNinjas.whois(customer.domain),
    apiNinjas.news(customer.name),
    apiNinjas.city(customer.city)
  ]);
  
  return { domainData, newsData, locationData };
};
```

### Issue: Performance degradation
**Solution**: Add strategic caching:
```javascript
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const getCachedOrFetch = async (key, fetchFn) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};
```

## Advanced Features (Optional)

### Predictive Analytics
```javascript
// Simple trend prediction based on historical data
const predictTrend = (healthHistory) => {
  if (healthHistory.length < 3) return 'insufficient_data';
  
  const recent = healthHistory.slice(-3);
  const trend = recent[2] - recent[0];
  
  if (trend > 10) return 'improving';
  if (trend < -10) return 'declining';
  return 'stable';
};
```

### Alert System
```javascript
// Generate alerts based on health score changes
const generateAlerts = (currentScore, previousScore, customer) => {
  const alerts = [];
  
  if (currentScore < 30) {
    alerts.push({
      type: 'critical',
      message: `${customer.name} health score critically low`,
      action: 'immediate_attention_required'
    });
  }
  
  if (previousScore - currentScore > 20) {
    alerts.push({
      type: 'warning',
      message: `${customer.name} health score declining rapidly`,
      action: 'investigate_cause'
    });
  }
  
  return alerts;
};
```

## Phase 3 Success Criteria

✅ **Intelligence Integration**: All data sources contributing to insights
✅ **Health Scoring**: Accurate, explainable health calculations
✅ **Market Analysis**: News fetched and analyzed for sentiment
✅ **Geographic Context**: Location-based business insights
✅ **Dashboard Orchestration**: Smooth coordination of multiple widgets

## Business Impact

By completing Phase 3, you've created a system that:
- **Reduces analysis time** from hours to minutes
- **Provides early warning** for at-risk accounts
- **Automates intelligence gathering** that was previously manual
- **Combines disparate data** into actionable insights

## Phase 3 Completion

When you've successfully completed all tasks:

1. **Demo the intelligence**: Show health scoring for different customers
2. **Explain the algorithm**: Walk through score calculation
3. **Test edge cases**: Show handling of missing data
4. **Validate business value**: Discuss practical applications

**Time Check**: This phase should take ~45 minutes. The core health scoring is most important.

---

**Next Phase**: [Phase 4: Advanced Features](./phase4-advanced-features.md)

## Additional Resources

- **Sentiment Analysis**: [npmjs.com/package/sentiment](https://www.npmjs.com/package/sentiment)
- **Data Visualization**: [recharts.org](https://recharts.org)
- **Business Intelligence**: [Harvard Business Review - Customer Health Scoring](https://hbr.org/customer-health-metrics)