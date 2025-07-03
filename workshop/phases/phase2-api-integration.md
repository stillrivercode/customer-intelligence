# Phase 2: API Integration (45 minutes)

**Objective**: Enhance dashboard with real API data from API Ninjas

## Learning Goals

By the end of this phase, you will:
- ✅ Set up API Ninjas client with rate limiting
- ✅ Fetch domain information (whois) and website status
- ✅ Display real-time data in widgets
- ✅ Implement error handling and loading states
- ✅ Understand API integration patterns with DDD

## DDD Focus

1. **Specify API integration requirements** clearly
2. **Use AI to generate service layer** from specifications
3. **Implement error handling patterns** systematically

## Pre-requisites

### API Key Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file and add your API key
VITE_API_NINJAS_KEY=your_actual_api_key_here
```

**Get your free API key**: [api-ninjas.com](https://api-ninjas.com) (no credit card required)

## Tasks Overview

### Task 2.1: Rate Limiter Implementation (10 minutes)

**Why Rate Limiting?** API Ninjas free tier allows 1 request per second.

**Specification**: Create a rate limiter that queues requests and executes them sequentially with proper delays.

**Create**: `src/utils/rateLimiter.js`

**AI Prompt**:
```
Create a JavaScript rate limiter class that:
- Accepts requests per second configuration (default: 1)
- Queues API requests when rate limit would be exceeded
- Processes queue sequentially with proper delays
- Returns promises that resolve when request completes
- Handles errors gracefully
- Includes debugging/logging capabilities

The class should have:
- add(requestFunction) method that returns a Promise
- Internal queue management
- Automatic processing with delays
```

**Expected Implementation**:
```javascript
class RateLimiter {
  constructor(requestsPerSecond = 1) {
    this.queue = [];
    this.processing = false;
    this.delay = 1000 / requestsPerSecond;
  }

  async add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.process();
    });
  }

  // ... implementation
}

export const apiLimiter = new RateLimiter(1);
```

### Task 2.2: API Ninjas Service Layer (15 minutes)

**Specification**: Create a service layer that abstracts API Ninjas endpoints with proper error handling and caching.

**Create**: `src/services/apiNinjas.js`

**AI Prompt**:
```
Create an API Ninjas service layer with:

Endpoints to implement:
- whois(domain) - Get domain registration info
- urlLookup(url) - Check website availability
- news(query) - Get company news
- city(name) - Get city demographics
- timezone(city) - Get timezone info
- holidays(country, year) - Get holidays

Requirements:
- Use axios for HTTP client
- Integrate with rate limiter
- Handle API errors gracefully
- Add request/response logging
- Support API key from environment
- Return consistent error format
- Include JSDoc documentation

Base URL: https://api-ninjas.com/v1
Header: X-Api-Key: ${API_KEY}
```

**Expected Structure**:
```javascript
import axios from 'axios';
import { apiLimiter } from '../utils/rateLimiter';

const API_KEY = import.meta.env.VITE_API_NINJAS_KEY;
const BASE_URL = 'https://api.api-ninjas.com/v1';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Api-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

export const apiNinjas = {
  whois: (domain) => 
    apiLimiter.add(() => client.get(`/whois?domain=${domain}`)),
  // ... other methods
};
```

### Task 2.3: Domain Health Widget (15 minutes)

**Specification**: Create a widget that displays domain registration information and website status.

**Create**: `workshop/specs/domain-health-widget.md`

```markdown
# Domain Health Widget Specification

## Context
Account managers need to assess the technical stability of customer 
companies through their domain age, registration status, and website availability.

## Requirements

### Functional Requirements
- [ ] Display domain age in years/months
- [ ] Show domain registration status
- [ ] Check website availability (HTTP status)
- [ ] Display SSL certificate status
- [ ] Show last updated timestamp
- [ ] Handle loading and error states

### Visual Design
- Card layout with health indicators
- Color-coded status indicators (green/yellow/red)
- Icon for each metric
- Loading skeleton during API calls
- Error message with retry button

### Data Sources
- API Ninjas /whois endpoint for domain info
- API Ninjas /urllookup endpoint for website status

## Acceptance Criteria
- [ ] Domain age calculated correctly
- [ ] Website status updates in real-time
- [ ] Error states handled gracefully
- [ ] Loading states prevent UI flicker
- [ ] Retry mechanism for failed requests
```

**Generate Component**:

**AI Prompt**:
```
Create a DomainHealthWidget React component based on the specification.

Requirements:
- Use React hooks for state management
- Fetch data from apiNinjas service
- Display domain age, registration status, website availability
- Include loading states and error handling
- Use Tailwind CSS for styling
- Add status indicators with colors
- Include retry functionality for errors

Props:
- customer: { domain: string, website: string }
- refreshInterval?: number (default: 15 minutes)
```

**Expected File**: `src/components/widgets/DomainHealthWidget.jsx`

### Task 2.4: Integration with Dashboard (5 minutes)

**Add widget to main dashboard**:

1. Import the DomainHealthWidget
2. Add it to the selected customer view
3. Pass the current customer as props
4. Test with different customers

**Modify**: `src/App.jsx` or main dashboard component

```javascript
import { DomainHealthWidget } from './components/widgets/DomainHealthWidget';

// In your render method:
{selectedCustomer && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <DomainHealthWidget customer={selectedCustomer} />
    {/* Other widgets will go here */}
  </div>
)}
```

## Testing Your Implementation

### Task 2.5: Manual Testing (5 minutes)

1. **Test with GitHub customer**:
   - Domain: github.com
   - Should show domain age ~15 years
   - Website should be available (200 status)

2. **Test with different customers**:
   - Try Spotify (spotify.com)
   - Try Wikipedia (wikipedia.org)
   - Observe different domain ages and statuses

3. **Test error handling**:
   - Remove API key temporarily
   - Check error message displays
   - Verify retry button works

## Validation Checklist

After completing the tasks, verify:

- [ ] **Rate Limiting**: API calls are spaced 1 second apart
- [ ] **Domain Data**: Shows accurate domain registration info
- [ ] **Website Status**: Correctly identifies website availability
- [ ] **Loading States**: Smooth loading experience
- [ ] **Error Handling**: Graceful error messages with retry
- [ ] **Real-time Updates**: Data refreshes automatically

## Common Issues & Solutions

### Issue: CORS errors
**Solution**: API Ninjas supports CORS, but verify your API key:
```javascript
// Test your API key
const testKey = async () => {
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/city?name=London', {
      headers: { 'X-Api-Key': 'your-key' }
    });
    console.log('API Key valid:', response.ok);
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

### Issue: Rate limiting not working
**Solution**: Check queue processing:
```javascript
// Add debugging to rate limiter
console.log('Queue length:', this.queue.length);
console.log('Processing:', this.processing);
```

### Issue: Environment variables not loading
**Solution**: Verify Vite environment variable naming:
```javascript
// Must start with VITE_ for Vite to expose to client
const apiKey = import.meta.env.VITE_API_NINJAS_KEY;
console.log('API Key loaded:', !!apiKey);
```

### Issue: Domain age calculation wrong
**Solution**: Handle different date formats:
```javascript
const calculateAge = (createdDate) => {
  if (!createdDate) return 'Unknown';
  
  const created = new Date(createdDate);
  const now = new Date();
  const years = now.getFullYear() - created.getFullYear();
  
  return years > 0 ? `${years} years` : 'Less than 1 year';
};
```

## Performance Considerations

### Caching Strategy
```javascript
// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};
```

### Batch Processing
Group API calls when possible:
```javascript
// Instead of individual calls
const domainData = await apiNinjas.whois(domain);
const websiteData = await apiNinjas.urlLookup(website);

// Batch them
const [domainData, websiteData] = await Promise.all([
  apiNinjas.whois(domain),
  apiNinjas.urlLookup(website)
]);
```

## Phase 2 Success Criteria

✅ **API Integration**: Successfully calling API Ninjas endpoints
✅ **Rate Limiting**: Requests properly throttled
✅ **Data Display**: Real domain and website information shown
✅ **Error Handling**: Graceful degradation when APIs fail
✅ **Performance**: Efficient API usage with caching

## Security Considerations

- ✅ **API Key Security**: Never commit API keys
- ✅ **Error Sanitization**: Don't expose internal errors to UI
- ✅ **Rate Limiting**: Prevent API abuse
- ✅ **Input Validation**: Validate domains before API calls

## Phase 2 Completion

When you've successfully completed all tasks:

1. **Demo API integration**: Show live data from different customers
2. **Test error scenarios**: Demonstrate error handling
3. **Verify performance**: Check rate limiting in network tab
4. **Review security**: Confirm API key is not exposed

**Time Check**: This phase should take ~45 minutes. Focus on core API integration if running over.

---

**Next Phase**: [Phase 3: Intelligence Layer](./phase3-intelligence-layer.md)

## Additional Resources

- **API Ninjas Documentation**: [api-ninjas.com/documentation](https://api-ninjas.com/documentation)
- **Axios Documentation**: [axios-http.com](https://axios-http.com)
- **Rate Limiting Patterns**: [engineering.paypal.com/rate-limiting](https://medium.com/paypal-engineering/rate-limiting-a-powerful-tool-to-improve-stability-and-ux-4027d0d5e42b)