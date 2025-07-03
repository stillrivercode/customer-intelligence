# Geographic Insights Widget Specification

## Context
Account managers need location-based business intelligence to understand customer markets, optimize communication timing, and identify regional opportunities and challenges that may impact customer relationships.

## Requirements

### Functional Requirements
- [ ] Display city demographics and economic indicators
- [ ] Show country-level business environment data
- [ ] Provide timezone information for optimal contact timing
- [ ] Display holiday calendar for communication planning
- [ ] Calculate business days and SLA considerations
- [ ] Show regional market trends and opportunities

### Data Sources
**API Ninjas Endpoints:**
- `/city` - Demographics, population, coordinates
- `/country` - GDP, business ranking, economic data
- `/timezone` - Current time, UTC offset, DST status
- `/holidays` - National and regional holidays
- `/businessdays` - Working day calculations

### Visual Design
- Card-based layout with distinct sections
- Interactive elements for exploring data
- Icons representing different data categories
- Color-coded indicators for business favorability
- Responsive design for mobile and desktop

## Component Interface

### Props
```typescript
interface GeographicInsightsProps {
  customer: Customer;
  showTimezone?: boolean; // default: true
  showHolidays?: boolean; // default: true
  showDemographics?: boolean; // default: true
  refreshInterval?: number; // default: 24 hours
  onInsightClick?: (insight: GeographicInsight) => void;
}

interface GeographicData {
  city: CityData;
  country: CountryData;
  timezone: TimezoneData;
  holidays: Holiday[];
  businessEnvironment: BusinessEnvironment;
}

interface CityData {
  name: string;
  country: string;
  population: number;
  latitude: number;
  longitude: number;
  isCapital: boolean;
  currency?: string;
}

interface CountryData {
  name: string;
  capital: string;
  population: number;
  gdp: number;
  gdpPerCapita: number;
  currency: string;
  region: string;
  businessRanking?: number;
  timeZones: string[];
}

interface TimezoneData {
  timezone: string;
  currentTime: string;
  utcOffset: number;
  isDST: boolean;
  abbreviation: string;
}

interface Holiday {
  name: string;
  date: string;
  type: 'national' | 'regional' | 'religious' | 'cultural';
  isBusinessDay: boolean;
}

interface BusinessEnvironment {
  easeOfBusiness: number; // 1-190 ranking
  economicFreedom: number; // 0-100 score
  marketPotential: 'high' | 'medium' | 'low';
  businessHours: string;
  workingDays: string[];
}
```

## Data Processing Logic

### Business Environment Analysis
```javascript
const analyzeBusinessEnvironment = (countryData, cityData) => {
  const environment = {
    easeOfBusiness: countryData.businessRanking || 100,
    economicFreedom: calculateEconomicFreedom(countryData),
    marketPotential: assessMarketPotential(countryData, cityData),
    businessHours: getStandardBusinessHours(countryData.region),
    workingDays: getWorkingDays(countryData.culture)
  };
  
  return environment;
};

const assessMarketPotential = (country, city) => {
  const gdpPerCapita = country.gdpPerCapita || 0;
  const population = city.population || 0;
  
  if (gdpPerCapita > 30000 && population > 1000000) return 'high';
  if (gdpPerCapita > 15000 || population > 500000) return 'medium';
  return 'low';
};
```

### Optimal Contact Time Calculation
```javascript
const calculateOptimalContactTime = (timezone, businessHours, holidays) => {
  const now = new Date();
  const localTime = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
  
  const recommendations = {
    nextBusinessDay: findNextBusinessDay(localTime, holidays),
    bestCallTime: calculateBestCallTime(timezone, businessHours),
    avoidDates: getUpcomingHolidays(holidays, 30), // Next 30 days
    timeUntilBusiness: getTimeUntilBusinessHours(localTime, businessHours)
  };
  
  return recommendations;
};

const calculateBestCallTime = (timezone, businessHours) => {
  // Optimal times are typically mid-morning or mid-afternoon
  const optimalHours = [10, 11, 14, 15]; // 10 AM, 11 AM, 2 PM, 3 PM
  
  return optimalHours.map(hour => {
    const time = new Date();
    time.setHours(hour, 0, 0, 0);
    return {
      localTime: time.toLocaleString("en-US", {timeZone: timezone}),
      yourTime: time.toLocaleString(), // User's timezone
      confidence: getTimeConfidence(hour)
    };
  });
};
```

### Holiday Impact Assessment
```javascript
const assessHolidayImpact = (holidays, customer) => {
  const upcoming = holidays.filter(h => 
    new Date(h.date) > new Date() && 
    new Date(h.date) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // Next 90 days
  );
  
  return upcoming.map(holiday => ({
    ...holiday,
    impact: getBusinessImpact(holiday, customer),
    alternativeDates: suggestAlternativeDates(holiday.date),
    culturalSignificance: getCulturalContext(holiday.name)
  }));
};

const getBusinessImpact = (holiday, customer) => {
  const highImpactTypes = ['national', 'religious'];
  const tier = customer.tier.toLowerCase();
  
  if (highImpactTypes.includes(holiday.type)) {
    return tier === 'enterprise' ? 'high' : 'medium';
  }
  return 'low';
};
```

## Visual Layout Specification

### Main Layout Structure
```
┌─────────────────────────────────────────────────┐
│  Geographic Insights                            │
│  ┌─────────────────┐ ┌─────────────────────────┐ │
│  │ 🌍 Location     │ │ 🕐 Timezone            │ │
│  │ San Francisco   │ │ PST (UTC-8)            │ │
│  │ California, US  │ │ 2:30 PM Local          │ │
│  │ Pop: 875K       │ │ Best Call: 10 AM       │ │
│  └─────────────────┘ └─────────────────────────┘ │
│                                                 │
│  ┌─────────────────────────────────────────────┐ │
│  │ 💼 Business Environment                     │ │
│  │ • High market potential                     │ │
│  │ • Ease of business: #6 globally            │ │
│  │ │ • Working days: Mon-Fri                    │ │
│  │ • Business hours: 9 AM - 6 PM              │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  ┌─────────────────────────────────────────────┐ │
│  │ 📅 Upcoming Holidays (Next 90 days)        │ │
│  │ • Martin Luther King Jr. Day (Jan 15)      │ │
│  │   🔴 National Holiday - Avoid contact      │ │
│  │ • Presidents Day (Feb 19)                  │ │
│  │   🟡 Federal Holiday - Limited business    │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  ┌─────────────────────────────────────────────┐ │
│  │ 📊 Market Context                           │ │
│  │ • GDP per capita: $65,280                  │ │
│  │ • Major industries: Tech, Finance          │ │
│  │ • Business ranking: 6/190 countries        │ │
│  │ • Currency: USD                            │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Color Coding System
```javascript
const getMarketPotentialColor = (potential) => {
  switch (potential) {
    case 'high': return 'text-green-600 bg-green-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'low': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getHolidayImpactColor = (impact) => {
  switch (impact) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};
```

## Business Intelligence Features

### Market Opportunity Scoring
```javascript
const calculateMarketOpportunity = (geoData, customer) => {
  let score = 50; // Base score
  
  // GDP per capita influence
  const gdpPerCapita = geoData.country.gdpPerCapita || 0;
  if (gdpPerCapita > 50000) score += 20;
  else if (gdpPerCapita > 30000) score += 10;
  else if (gdpPerCapita < 10000) score -= 10;
  
  // Population influence (market size)
  const population = geoData.city.population || 0;
  if (population > 5000000) score += 15;
  else if (population > 1000000) score += 10;
  else if (population < 100000) score -= 5;
  
  // Business environment
  const businessRanking = geoData.country.businessRanking || 100;
  if (businessRanking <= 20) score += 15;
  else if (businessRanking <= 50) score += 5;
  else if (businessRanking > 100) score -= 10;
  
  // Industry alignment
  if (customer.industry === 'Technology' && isInTechHub(geoData.city.name)) {
    score += 10;
  }
  
  return Math.max(0, Math.min(100, score));
};

const isInTechHub = (cityName) => {
  const techHubs = [
    'San Francisco', 'New York', 'London', 'Berlin', 
    'Singapore', 'Toronto', 'Sydney', 'Tel Aviv'
  ];
  return techHubs.includes(cityName);
};
```

### Communication Recommendations
```javascript
const generateCommunicationRecommendations = (geoData, customer) => {
  const recommendations = [];
  
  // Timezone considerations
  const timeDiff = calculateTimeDifference(geoData.timezone.utcOffset);
  if (Math.abs(timeDiff) > 8) {
    recommendations.push({
      type: 'timezone',
      priority: 'high',
      message: `Large timezone difference (${timeDiff} hours). Schedule calls carefully.`,
      action: 'Use scheduling tool with timezone display'
    });
  }
  
  // Holiday awareness
  const upcomingHolidays = getUpcomingHolidays(geoData.holidays, 14);
  if (upcomingHolidays.length > 0) {
    recommendations.push({
      type: 'holidays',
      priority: 'medium',
      message: `${upcomingHolidays.length} holidays in next 2 weeks`,
      action: 'Plan communications around holidays'
    });
  }
  
  // Business environment considerations
  if (geoData.businessEnvironment.easeOfBusiness > 150) {
    recommendations.push({
      type: 'business_environment',
      priority: 'medium',
      message: 'Challenging business environment may affect decision-making',
      action: 'Allow extra time for approvals and decisions'
    });
  }
  
  return recommendations;
};
```

### Cultural Context Integration
```javascript
const getCulturalContext = (countryData, cityData) => {
  const context = {
    businessCulture: getBusinessCulture(countryData.region),
    communicationStyle: getCommunicationStyle(countryData.name),
    meetingPreferences: getMeetingPreferences(countryData.region),
    decisionMaking: getDecisionMakingStyle(countryData.region)
  };
  
  return context;
};

const getBusinessCulture = (region) => {
  const cultures = {
    'North America': 'Direct, time-conscious, informal',
    'Europe': 'Formal, relationship-focused, punctual',
    'Asia': 'Hierarchical, consensus-driven, patient',
    'Middle East': 'Relationship-based, formal, patient',
    'Latin America': 'Relationship-focused, flexible timing'
  };
  
  return cultures[region] || 'Research local business customs';
};
```

## Performance Optimizations

### Data Caching Strategy
```javascript
const geoDataCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const getCachedGeoData = (locationKey) => {
  const cached = geoDataCache.get(locationKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedGeoData = (locationKey, data) => {
  geoDataCache.set(locationKey, {
    data,
    timestamp: Date.now()
  });
};
```

### Lazy Loading for Non-Critical Data
```javascript
const useGeographicData = (customer) => {
  const [coreData, setCoreData] = useState(null);
  const [extendedData, setExtendedData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load critical data first (timezone, basic location)
    loadCoreData(customer).then(setCoreData);
    
    // Load extended data in background
    setTimeout(() => {
      loadExtendedData(customer).then(setExtendedData);
    }, 1000);
  }, [customer]);
  
  return { coreData, extendedData, loading };
};
```

## Error Handling & Fallbacks

### API Failure Graceful Degradation
```javascript
const handleGeoDataError = (error, dataType) => {
  console.warn(`Geographic data fetch failed for ${dataType}:`, error);
  
  const fallbacks = {
    city: { name: customer.city, population: 'Unknown' },
    country: { name: customer.country, currency: 'Unknown' },
    timezone: { timezone: 'Unknown', currentTime: new Date().toISOString() },
    holidays: []
  };
  
  return fallbacks[dataType] || {};
};
```

### Offline Mode Support
```javascript
const useOfflineGeoData = (customer) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState(null);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Use cached data when offline
  if (!isOnline && offlineData) {
    return { data: offlineData, isOffline: true };
  }
  
  return { data: null, isOffline: false };
};
```

## Testing Requirements

### Data Accuracy Tests
```javascript
describe('Geographic Insights', () => {
  test('calculates market opportunity correctly', () => {
    const mockData = {
      country: { gdpPerCapita: 55000, businessRanking: 15 },
      city: { population: 2000000 }
    };
    
    const score = calculateMarketOpportunity(mockData, techCustomer);
    expect(score).toBeGreaterThan(70); // High-opportunity market
  });
  
  test('handles timezone calculations accurately', () => {
    const result = calculateOptimalContactTime('America/Los_Angeles', '9-17');
    expect(result.bestCallTime).toHaveLength(4);
    expect(result.bestCallTime[0].confidence).toBeGreaterThan(0.7);
  });
});
```

### Integration Tests
```javascript
test('integrates multiple API endpoints successfully', async () => {
  const customer = { city: 'London', country: 'United Kingdom' };
  const geoData = await fetchGeographicData(customer);
  
  expect(geoData.city.name).toBe('London');
  expect(geoData.timezone.timezone).toContain('London');
  expect(geoData.holidays).toBeInstanceOf(Array);
});
```

## Acceptance Criteria
- [ ] Displays accurate city and country information
- [ ] Shows current local time and optimal contact windows
- [ ] Lists upcoming holidays with business impact assessment
- [ ] Provides market opportunity insights
- [ ] Handles missing or incomplete data gracefully
- [ ] Updates automatically every 24 hours
- [ ] Mobile responsive design
- [ ] Loading states prevent layout shifts
- [ ] Error states provide helpful recovery options
- [ ] Performance optimized with appropriate caching
- [ ] Accessible to screen readers and keyboard navigation
- [ ] Cultural context enhances business intelligence

## Business Value Metrics

### Measurable Outcomes
- **Communication Efficiency**: 25% improvement in meeting success rate
- **Cultural Sensitivity**: Reduced miscommunications due to holiday awareness
- **Market Intelligence**: Better understanding of customer business environment
- **Time Management**: Optimal scheduling reduces back-and-forth emails

This comprehensive specification ensures the Geographic Insights widget provides valuable, actionable business intelligence that directly improves customer relationship management.