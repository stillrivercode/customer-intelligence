# Workshop API Integration Reference

## Overview

This guide provides comprehensive documentation for integrating with the workshop API endpoints used in the Customer Intelligence Dashboard workshop.

## Getting Started

### No Setup Required
1. The workshop uses a custom API proxy at `https://api.stillriver.info/`
2. No API keys or account creation required
3. Zero configuration needed to get started

### Workshop API Features
- **No limits** for workshop duration
- **No authentication** required
- **Standard REST patterns** for easy integration
- **CORS enabled** for browser requests

## Endpoint Documentation

### 1. Domain Information (`/whois`)

**Purpose**: Get domain registration and ownership information

**Endpoint**: `GET https://api.stillriver.info/whois`

**Parameters**:
- `domain` (required): Domain name to lookup

**Example Request**:
```javascript
const response = await fetch('https://api.api-ninjas.com/v1/whois?domain=github.com', {
  headers: {
    'X-Api-Key': 'your_api_key_here'
  }
});
const data = await response.json();
```

**Example Response**:
```json
{
  "domain_name": "GITHUB.COM",
  "registrar": "MarkMonitor Inc.",
  "whois_server": "whois.markmonitor.com",
  "created_date": "2007-10-09T18:20:50Z",
  "expiration_date": "2025-10-09T07:00:00Z",
  "updated_date": "2024-09-10T09:18:13Z",
  "name_servers": [
    "dns1.p08.nsone.net",
    "dns2.p08.nsone.net"
  ]
}
```

**Workshop Usage**:
- Calculate domain age for health scoring
- Check registration status
- Assess domain stability

---

### 2. Website Status (`/urllookup`)

**Purpose**: Check website availability and basic information

**Endpoint**: `GET https://api.api-ninjas.com/v1/urllookup`

**Parameters**:
- `url` (required): Full URL to check

**Example Request**:
```javascript
const response = await fetch('https://api.api-ninjas.com/v1/urllookup?url=https://github.com', {
  headers: {
    'X-Api-Key': 'your_api_key_here'
  }
});
const data = await response.json();
```

**Example Response**:
```json
{
  "url": "https://github.com",
  "status": 200,
  "headers": {
    "content-type": "text/html; charset=utf-8",
    "server": "GitHub.com"
  },
  "content_length": 125000,
  "response_time": 0.234
}
```

**Workshop Usage**:
- Website availability monitoring
- Response time tracking
- Health score calculation

---

### 3. Company News (`/news`)

**Purpose**: Get recent news articles

**Endpoint**: `GET https://api.api-ninjas.com/v1/news`

**Parameters**:
- `q` (optional): Search query
- `category` (optional): News category
- `language` (optional): Language code (default: en)

**Example Request**:
```javascript
const response = await fetch('https://api.api-ninjas.com/v1/news?q=GitHub', {
  headers: {
    'X-Api-Key': 'your_api_key_here'
  }
});
const data = await response.json();
```

**Example Response**:
```json
[
  {
    "title": "GitHub announces new AI coding assistant",
    "description": "GitHub has unveiled a new AI-powered coding assistant that helps developers write code faster and more efficiently.",
    "url": "https://example.com/news/github-ai-assistant",
    "source": "TechCrunch",
    "published_date": "2024-12-29T15:30:00Z"
  }
]
```

**Workshop Usage**:
- Market intelligence feed
- Sentiment analysis
- Event detection (funding, acquisitions, etc.)

---

### 4. City Information (`/city`)

**Purpose**: Get demographic and geographic data for cities

**Endpoint**: `GET https://api.api-ninjas.com/v1/city`

**Parameters**:
- `name` (required): City name
- `country` (optional): Country to filter results

**Example Request**:
```javascript
const response = await fetch('https://api.api-ninjas.com/v1/city?name=San Francisco', {
  headers: {
    'X-Api-Key': 'your_api_key_here'
  }
});
const data = await response.json();
```

**Example Response**:
```json
[
  {
    "name": "San Francisco",
    "country": "US",
    "population": 873965,
    "is_capital": false,
    "latitude": 37.7749,
    "longitude": -122.4194
  }
]
```

**Workshop Usage**:
- Geographic insights
- Market size analysis
- Location-based business intelligence

---

### 5. Country Information (`/country`)

**Purpose**: Get country-level economic and demographic data

**Endpoint**: `GET https://api.api-ninjas.com/v1/country`

**Parameters**:
- `name` (required): Country name

**Example Request**:
```javascript
const response = await fetch('https://api.api-ninjas.com/v1/country?name=United States', {
  headers: {
    'X-Api-Key': 'your_api_key_here'
  }
});
const data = await response.json();
```

**Example Response**:
```json
[
  {
    "name": "United States",
    "capital": "Washington",
    "population": 331002651,
    "gdp": 21427700000000,
    "region": "Americas",
    "surface_area": 9833517,
    "currency": "US Dollar"
  }
]
```

**Workshop Usage**:
- Business environment analysis
- Market opportunity assessment
- Economic context for customer decisions

---

### 6. Timezone Information (`/timezone`)

**Purpose**: Get timezone data for optimal communication timing

**Endpoint**: `GET https://api.api-ninjas.com/v1/timezone`

**Parameters**:
- `city` (required): City name
- `country` (optional): Country name for disambiguation

**Example Request**:
```javascript
const response = await fetch('https://api.api-ninjas.com/v1/timezone?city=San Francisco', {
  headers: {
    'X-Api-Key': 'your_api_key_here'
  }
});
const data = await response.json();
```

**Example Response**:
```json
{
  "timezone": "America/Los_Angeles",
  "datetime": "2024-12-30T14:30:45.123456-08:00",
  "utc_offset": "-08:00",
  "day_of_week": 1,
  "day_of_year": 365,
  "is_dst": false
}
```

**Workshop Usage**:
- Optimal contact time calculation
- Meeting scheduling
- Business hours alignment

---

### 7. Holiday Calendar (`/holidays`)

**Purpose**: Get holiday information for communication planning

**Endpoint**: `GET https://api.api-ninjas.com/v1/holidays`

**Parameters**:
- `country` (required): Country code (US, GB, etc.)
- `year` (required): Year for holidays

**Example Request**:
```javascript
const response = await fetch('https://api.api-ninjas.com/v1/holidays?country=US&year=2024', {
  headers: {
    'X-Api-Key': 'your_api_key_here'
  }
});
const data = await response.json();
```

**Example Response**:
```json
[
  {
    "name": "New Year's Day",
    "date": "2024-01-01",
    "type": "National holiday"
  },
  {
    "name": "Martin Luther King Jr. Day",
    "date": "2024-01-15",
    "type": "National holiday"
  }
]
```

**Workshop Usage**:
- Communication planning
- Avoiding contact during holidays
- Cultural awareness

## Implementation Patterns

### Rate Limiting Implementation

```javascript
class RateLimiter {
  constructor(requestsPerSecond = 1) {
    this.queue = [];
    this.processing = false;
    this.delay = 1000 / requestsPerSecond;
  }

  async add(requestFunction) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFunction, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const { requestFunction, resolve, reject } = this.queue.shift();
    
    try {
      const result = await requestFunction();
      resolve(result);
    } catch (error) {
      reject(error);
    }
    
    setTimeout(() => {
      this.processing = false;
      this.process();
    }, this.delay);
  }
}

// Usage
const rateLimiter = new RateLimiter(1); // 1 request per second

const fetchData = async () => {
  return rateLimiter.add(() => 
    fetch('https://api.api-ninjas.com/v1/whois?domain=example.com', {
      headers: { 'X-Api-Key': process.env.VITE_API_NINJAS_KEY }
    }).then(res => res.json())
  );
};
```

### Error Handling

```javascript
const apiNinjasClient = async (endpoint, params = {}) => {
  const url = new URL(`https://api.api-ninjas.com/v1/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': process.env.VITE_API_NINJAS_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait before making another request.');
      }
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      }
      if (response.status === 404) {
        throw new Error('Endpoint not found. Please check the URL.');
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Ninjas request failed:`, error);
    throw error;
  }
};
```

### Caching Strategy

```javascript
class APICache {
  constructor(ttl = 3600000) { // 1 hour default
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl
    });
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new APICache();

const cachedRequest = async (cacheKey, requestFunction) => {
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const result = await requestFunction();
  cache.set(cacheKey, result);
  return result;
};
```

## Data Processing Utilities

### Domain Age Calculation

```javascript
const calculateDomainAge = (createdDate) => {
  if (!createdDate) return null;
  
  const created = new Date(createdDate);
  const now = new Date();
  
  const years = now.getFullYear() - created.getFullYear();
  const months = now.getMonth() - created.getMonth();
  
  const totalMonths = years * 12 + months;
  
  if (totalMonths < 12) {
    return `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
};
```

### News Sentiment Analysis

```javascript
const analyzeSentiment = (text) => {
  const positiveWords = [
    'growth', 'success', 'profit', 'expansion', 'achievement',
    'breakthrough', 'innovation', 'award', 'partnership', 'funding'
  ];
  
  const negativeWords = [
    'loss', 'decline', 'bankruptcy', 'layoffs', 'lawsuit',
    'scandal', 'controversy', 'failure', 'crisis', 'breach'
  ];
  
  const lowerText = text.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
};
```

### Business Hours Calculation

```javascript
const isBusinessHours = (date, timezone, businessHours = '9-17') => {
  const [startHour, endHour] = businessHours.split('-').map(Number);
  const localTime = new Date(date.toLocaleString("en-US", {timeZone: timezone}));
  const hour = localTime.getHours();
  const day = localTime.getDay();
  
  // Check if it's a weekday (Monday = 1, Friday = 5)
  const isWeekday = day >= 1 && day <= 5;
  const isBusinessHour = hour >= startHour && hour < endHour;
  
  return isWeekday && isBusinessHour;
};
```

## Testing Your Integration

### API Key Validation

```javascript
const validateAPIKey = async () => {
  try {
    const response = await fetch('https://api.api-ninjas.com/v1/city?name=London', {
      headers: { 'X-Api-Key': process.env.VITE_API_NINJAS_KEY }
    });
    
    if (response.ok) {
      console.log('✓ API key is valid');
      return true;
    } else {
      console.error('✗ API key validation failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('✗ API key validation error:', error.message);
    return false;
  }
};
```

### Rate Limit Testing

```javascript
const testRateLimit = async () => {
  const requests = Array(5).fill().map((_, i) => 
    fetch('https://api.api-ninjas.com/v1/city?name=London', {
      headers: { 'X-Api-Key': process.env.VITE_API_NINJAS_KEY }
    })
  );
  
  try {
    const responses = await Promise.all(requests);
    const statuses = responses.map(r => r.status);
    
    if (statuses.includes(429)) {
      console.log('⚠ Rate limit triggered - implement rate limiting');
    } else {
      console.log('✓ No rate limit issues detected');
    }
  } catch (error) {
    console.error('Rate limit test failed:', error);
  }
};
```

## Common Issues & Solutions

### Issue: CORS Errors
**Solution**: API Ninjas supports CORS for browser requests. If you encounter CORS issues, verify your API key and request headers.

### Issue: 429 Rate Limit Errors
**Solution**: Implement the rate limiter pattern shown above. Free tier allows 1 request per second.

### Issue: Invalid API Key (401)
**Solution**: 
1. Verify your API key is correct
2. Ensure it's properly set in environment variables
3. Check that `VITE_` prefix is used for Vite projects

### Issue: Empty or Null Responses
**Solution**: Some data may not be available for all queries. Always handle null/undefined values gracefully:

```javascript
const safeAccess = (data, path, fallback = 'Unknown') => {
  try {
    return path.split('.').reduce((obj, key) => obj?.[key], data) ?? fallback;
  } catch {
    return fallback;
  }
};

// Usage
const domainAge = safeAccess(whoisData, 'created_date', null);
const population = safeAccess(cityData, '0.population', 0);
```

## Best Practices

1. **Always implement rate limiting** for production applications
2. **Cache responses** to minimize API calls and improve performance
3. **Handle errors gracefully** with user-friendly messages
4. **Validate data** before using it in calculations
5. **Use environment variables** for API keys
6. **Implement retry logic** for temporary failures
7. **Monitor usage** to stay within free tier limits

## Useful Resources

- **API Ninjas Documentation**: [api-ninjas.com/documentation](https://api-ninjas.com/documentation)
- **Rate Limiting Best Practices**: [HTTP Status Code 429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
- **Environment Variables in Vite**: [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- **JavaScript Date/Time Handling**: [MDN Date Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)