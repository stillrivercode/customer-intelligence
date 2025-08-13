# Workshop Overview

## Dashboard Purpose

The Customer Intelligence Dashboard helps account managers and customer success teams monitor customer health by combining internal customer data (mocked) with external market intelligence from the workshop API. This example showcases:

- **Progressive complexity** from simple displays to AI-orchestrated insights
- **Real-world business value** through customer health scoring
- **Multiple API integrations** working in harmony
- **Modern React patterns** with AI-generated code

## Key Features

### 🏥 Customer Health Scoring
Automated calculation based on multiple data points including:
- Domain age and stability
- Website availability and performance
- Market presence and news sentiment
- Engagement levels and activity

### 📰 Market Intelligence
Real-time monitoring of:
- Company news and announcements
- Industry trends and competitor activity
- Risk indicators and opportunities
- Sentiment analysis of market coverage

### 🌍 Geographic Insights
Location-based business intelligence:
- City demographics and business environment
- Country-specific market data
- Timezone optimization for communications
- Cultural and holiday considerations

### 📞 Engagement Optimization
Communication planning tools:
- Best times to contact based on timezone
- Holiday calendar integration
- Business day calculations for SLAs
- Meeting scheduler optimization

## Technical Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for rapid UI development
- **Vite** as build tool for fast development
- **React Context** for state management

### API Integration
- **Workshop API** (no setup required)
- **Rate limiting** demonstration for production patterns
- **Caching layer** for performance optimization
- **Error handling** with graceful degradation

### Testing & Quality
- **Jest** with React Testing Library
- **ESLint** and **Prettier** for code quality
- **Performance monitoring** and optimization
- **Accessibility** compliance (WCAG)

## Workshop API Endpoints

| Endpoint | Purpose | Dashboard Feature |
|----------|---------|-------------------|
| `/whois` | Domain registration data | Company age, stability metrics |
| `/dnslookup` | DNS configuration | Technical health indicators |
| `/urllookup` | Website availability | Uptime monitoring |
| `/news` | Company news | Market intelligence feed |
| `/city` | City demographics | Location insights |
| `/country` | Country data | Business environment analysis |
| `/timezone` | Timezone information | Meeting scheduler |
| `/holidays` | Holiday calendar | Communication planner |
| `/businessdays` | Business day calculator | SLA tracking |

**Base URL**: `https://api.stillriver.info/`

## Mock Data Structure

### Customer Schema
```javascript
{
  id: "cust_001",
  name: "TechVentures Inc",
  domain: "github.com",  // Real domain for API testing
  website: "https://github.com",
  city: "San Francisco",
  country: "United States",
  tier: "Enterprise",
  mrr: 5000,
  signupDate: "2023-01-15",
  lastActivity: "2024-12-28",
  industry: "Software Development",
  employees: "1000-5000",
  tags: ["high-value", "tech-savvy", "growth"],
  contacts: [
    {
      name: "John Smith",
      role: "CTO",
      email: "john@example.com",
      timezone: "America/Los_Angeles"
    }
  ]
}
```

### Pre-configured Test Customers
- **15 diverse customers** spanning different industries
- **Real domains** (github.com, spotify.com, etc.) for API testing
- **Geographic diversity** across US, Europe, and Asia
- **Various tiers** (Startup, Growth, Enterprise)

## Component Architecture

```
CustomerIntelligenceDashboard/
├── Layout/
│   ├── Header (Customer Selector, Search, Actions)
│   ├── Sidebar (Navigation, Filters)
│   └── MainContent (Widget Grid)
├── Widgets/
│   ├── CustomerHealthScore/
│   │   ├── HealthScore.jsx
│   │   ├── HealthBreakdown.jsx
│   │   └── TrendIndicator.jsx
│   ├── MarketIntelligence/
│   │   ├── NewsFeed.jsx
│   │   ├── IndustryTrends.jsx
│   │   └── CompetitorAlerts.jsx
│   ├── GeographicInsights/
│   │   ├── LocationMap.jsx
│   │   ├── Demographics.jsx
│   │   └── BusinessEnvironment.jsx
│   └── EngagementOptimizer/
│       ├── BestTimeToContact.jsx
│       ├── HolidayCalendar.jsx
│       └── CommunicationPlanner.jsx
└── Shared/
    ├── DataManager/
    ├── LoadingStates/
    └── ErrorBoundaries/
```

## Business Value Demonstration

### ROI Metrics
- **Time Savings**: 2-3 hours per customer review
- **Risk Reduction**: Early warning for churn (15-20% improvement)
- **Revenue Protection**: Proactive account management
- **Efficiency Gains**: Automated intelligence gathering

### Real-world Use Cases
1. **Weekly Health Reviews**: Automated customer assessments
2. **Renewal Planning**: Early identification of at-risk accounts
3. **Expansion Opportunities**: Market intelligence for upsells
4. **Communication Optimization**: Data-driven engagement timing

## Workshop Philosophy

This workshop demonstrates **Document Driven Development (DDD)** principles:

1. **Specification First**: Clear requirements before implementation
2. **AI-Assisted Generation**: Let AI write the code from specs
3. **Iterative Refinement**: Continuous improvement through feedback
4. **Production Ready**: Real-world quality and performance standards

## Performance Targets

- **Initial Load**: < 2 seconds
- **Widget Updates**: < 500ms
- **API Rate Limiting**: 1 request per second
- **Memory Usage**: < 50MB
- **Bundle Size**: < 2MB

## Cost Considerations

### Workshop API Usage
- **No limits** for workshop duration
- **No registration required** - instant access
- **No credit card needed** for workshop

### Estimated Workshop Usage
- **~50 API calls** per participant
- **Zero cost** for workshop learning
- **Production usage**: Would require API Ninjas or similar service (~$10-20/month)

---

**Next Step**: Begin with [Phase 1: Basic Dashboard](./phases/phase1-basic-dashboard.md)