# Troubleshooting Guide

## Common Issues and Solutions

This guide covers the most frequently encountered issues during the Customer Intelligence Dashboard workshop and their solutions.

## Environment Setup Issues

### Issue: API Key Not Working
**Symptoms**: 401 Unauthorized errors, "Invalid API key" messages

**Solutions**:

1. **Verify API Key Format**:
   ```bash
   # Check your .env file
   cat .env
   # Should show: VITE_API_NINJAS_KEY=your_actual_key
   ```

2. **Validate API Key Online**:
   - Visit [api-ninjas.com](https://api-ninjas.com)
   - Log into your account
   - Verify the key in your dashboard matches your `.env` file

3. **Test API Key Directly**:
   ```bash
   curl -H "X-Api-Key: your_api_key_here" \
        "https://api.api-ninjas.com/v1/city?name=London"
   ```

4. **Environment Variable Issues**:
   ```javascript
   // Check if env var is loaded correctly
   console.log('API Key loaded:', !!import.meta.env.VITE_API_NINJAS_KEY);
   console.log('Key length:', import.meta.env.VITE_API_NINJAS_KEY?.length);
   
   // Common issues:
   // - Missing VITE_ prefix
   // - Spaces in the key
   // - Key in wrong file (.env vs .env.local)
   ```

### Issue: Environment Variables Not Loading
**Symptoms**: `undefined` when accessing `import.meta.env.VITE_API_NINJAS_KEY`

**Solutions**:

1. **Check File Location**:
   ```bash
   # .env file should be in project root
   ls -la .env
   # Should exist and be readable
   ```

2. **Verify Naming Convention**:
   ```bash
   # For Vite, must start with VITE_
   VITE_API_NINJAS_KEY=your_key_here  # ✓ Correct
   API_NINJAS_KEY=your_key_here       # ✗ Wrong
   ```

3. **Restart Development Server**:
   ```bash
   # Environment changes require restart
   npm run dev
   ```

4. **Check for Quotes**:
   ```bash
   # Don't use quotes in .env files
   VITE_API_NINJAS_KEY=sk-1234567890  # ✓ Correct
   VITE_API_NINJAS_KEY="sk-1234567890"  # ✗ Wrong
   ```

---

## API Integration Issues

### Issue: Rate Limit Errors (429)
**Symptoms**: "Too Many Requests" errors, failed API calls

**Solutions**:

1. **Implement Rate Limiting**:
   ```javascript
   // Basic rate limiter implementation
   class RateLimiter {
     constructor(requestsPerSecond = 1) {
       this.lastRequest = 0;
       this.delay = 1000 / requestsPerSecond;
     }
   
     async throttle() {
       const now = Date.now();
       const timeSinceLastRequest = now - this.lastRequest;
       
       if (timeSinceLastRequest < this.delay) {
         await new Promise(resolve => 
           setTimeout(resolve, this.delay - timeSinceLastRequest)
         );
       }
       
       this.lastRequest = Date.now();
     }
   }
   ```

2. **Check Request Frequency**:
   ```javascript
   // Add debugging to see request timing
   console.log('Making API request at:', new Date().toISOString());
   ```

3. **Use Request Queuing**:
   ```javascript
   // Queue requests instead of making them simultaneously
   const requestQueue = [];
   const processQueue = async () => {
     if (requestQueue.length === 0) return;
     
     const request = requestQueue.shift();
     await request();
     
     setTimeout(processQueue, 1000); // Wait 1 second between requests
   };
   ```

### Issue: CORS Errors
**Symptoms**: "Access to fetch blocked by CORS policy"

**Solutions**:

1. **Verify API Ninjas Supports CORS**:
   - API Ninjas does support CORS for browser requests
   - The issue is likely with your request headers

2. **Check Request Headers**:
   ```javascript
   // Correct headers
   const response = await fetch(url, {
     method: 'GET',
     headers: {
       'X-Api-Key': import.meta.env.VITE_API_NINJAS_KEY,
       'Content-Type': 'application/json'
     }
   });
   ```

3. **Development Proxy (if needed)**:
   ```javascript
   // vite.config.js
   export default {
     server: {
       proxy: {
         '/api': {
           target: 'https://api.api-ninjas.com/v1',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/api/, ''),
           headers: {
             'X-Api-Key': process.env.VITE_API_NINJAS_KEY
           }
         }
       }
     }
   };
   ```

### Issue: Empty or Null API Responses
**Symptoms**: API returns `null`, `[]`, or missing expected fields

**Solutions**:

1. **Handle Missing Data Gracefully**:
   ```javascript
   const safeAccess = (obj, path, fallback = null) => {
     try {
       return path.split('.').reduce((current, key) => current?.[key], obj) ?? fallback;
     } catch {
       return fallback;
     }
   };
   
   // Usage
   const domainAge = safeAccess(whoisData, 'created_date', 'Unknown');
   const population = safeAccess(cityData, '0.population', 0);
   ```

2. **Validate Input Data**:
   ```javascript
   const validateDomain = (domain) => {
     if (!domain || typeof domain !== 'string') return false;
     
     // Basic domain validation
     const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
     return domainRegex.test(domain);
   };
   ```

3. **Add Fallback Data**:
   ```javascript
   const getCustomerData = async (customer) => {
     try {
       const data = await apiNinjas.whois(customer.domain);
       return data || getDefaultDomainData(customer);
     } catch (error) {
       console.warn('API failed, using fallback data');
       return getDefaultDomainData(customer);
     }
   };
   ```

---

## Component Issues

### Issue: Components Not Rendering
**Symptoms**: Blank screens, missing widgets, console errors

**Solutions**:

1. **Check Component Imports**:
   ```javascript
   // Verify import paths are correct
   import { CustomerCard } from './components/CustomerCard'; // ✓
   import { CustomerCard } from './CustomerCard';           // ✗ Wrong path
   ```

2. **Validate Props**:
   ```javascript
   // Add prop validation
   const CustomerCard = ({ customer }) => {
     if (!customer) {
       console.error('CustomerCard: customer prop is required');
       return <div>No customer data</div>;
     }
     
     return (
       <div>
         <h3>{customer.name || 'Unknown Customer'}</h3>
         {/* ... rest of component */}
       </div>
     );
   };
   ```

3. **Check for JavaScript Errors**:
   ```javascript
   // Add error boundaries
   class ErrorBoundary extends React.Component {
     constructor(props) {
       super(props);
       this.state = { hasError: false };
     }
   
     static getDerivedStateFromError(error) {
       return { hasError: true };
     }
   
     componentDidCatch(error, errorInfo) {
       console.error('Component error:', error, errorInfo);
     }
   
     render() {
       if (this.state.hasError) {
         return <div>Something went wrong with this component.</div>;
       }
   
       return this.props.children;
     }
   }
   ```

### Issue: State Not Updating
**Symptoms**: UI doesn't reflect state changes, stale data

**Solutions**:

1. **Check State Updates**:
   ```javascript
   // Make sure you're updating state correctly
   const [customers, setCustomers] = useState([]);
   
   // ✓ Correct
   setCustomers(prev => [...prev, newCustomer]);
   
   // ✗ Wrong (mutating state)
   customers.push(newCustomer);
   setCustomers(customers);
   ```

2. **Debug State Changes**:
   ```javascript
   useEffect(() => {
     console.log('Customers state changed:', customers);
   }, [customers]);
   ```

3. **Check Dependencies**:
   ```javascript
   // Make sure useEffect dependencies are correct
   useEffect(() => {
     fetchCustomerData();
   }, [customer.id]); // ✓ Include dependencies
   ```

---

## Performance Issues

### Issue: Slow Loading
**Symptoms**: Dashboard takes too long to load, sluggish interactions

**Solutions**:

1. **Add Loading States**:
   ```javascript
   const [loading, setLoading] = useState(true);
   const [data, setData] = useState(null);
   
   if (loading) {
     return <LoadingSkeleton />;
   }
   ```

2. **Implement Caching**:
   ```javascript
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

3. **Optimize API Calls**:
   ```javascript
   // Batch related calls
   const fetchAllCustomerData = async (customer) => {
     const [domainData, newsData, cityData] = await Promise.all([
       apiNinjas.whois(customer.domain),
       apiNinjas.news(customer.name),
       apiNinjas.city(customer.city)
     ]);
     
     return { domainData, newsData, cityData };
   };
   ```

### Issue: Memory Leaks
**Symptoms**: Browser tab becomes slow over time, high memory usage

**Solutions**:

1. **Clean Up Effects**:
   ```javascript
   useEffect(() => {
     const interval = setInterval(fetchData, 60000);
     
     return () => {
       clearInterval(interval);
     };
   }, []);
   ```

2. **Cancel Fetch Requests**:
   ```javascript
   useEffect(() => {
     const abortController = new AbortController();
     
     fetch(url, { signal: abortController.signal })
       .then(response => response.json())
       .then(setData)
       .catch(error => {
         if (error.name !== 'AbortError') {
           console.error('Fetch error:', error);
         }
       });
     
     return () => {
       abortController.abort();
     };
   }, []);
   ```

---

## Data Issues

### Issue: Health Score Calculation Wrong
**Symptoms**: Unexpected health scores, incorrect calculations

**Solutions**:

1. **Debug Score Calculation**:
   ```javascript
   const calculateHealthScore = (customer, apiData) => {
     console.log('Input data:', { customer, apiData });
     
     const domainScore = calculateDomainScore(apiData.whois);
     console.log('Domain score:', domainScore);
     
     const websiteScore = calculateWebsiteScore(apiData.url);
     console.log('Website score:', websiteScore);
     
     // ... rest of calculation
   };
   ```

2. **Validate Input Data**:
   ```javascript
   const validateHealthScoreInput = (customer, apiData) => {
     const issues = [];
     
     if (!customer) issues.push('Customer data missing');
     if (!customer.lastActivity) issues.push('Last activity missing');
     if (!apiData) issues.push('API data missing');
     
     if (issues.length > 0) {
       console.warn('Health score validation issues:', issues);
     }
     
     return issues.length === 0;
   };
   ```

3. **Add Unit Tests**:
   ```javascript
   // test/healthCalculator.test.js
   describe('Health Score Calculator', () => {
     test('calculates perfect score correctly', () => {
       const customer = { lastActivity: new Date().toISOString() };
       const apiData = {
         whois: { created_date: '2015-01-01' },
         url: { status: 200 }
       };
       
       const score = calculateHealthScore(customer, apiData);
       expect(score.overall).toBeGreaterThan(80);
     });
   });
   ```

### Issue: Mock Data Not Loading
**Symptoms**: Empty customer list, no data to display

**Solutions**:

1. **Check Import Path**:
   ```javascript
   // Make sure path is correct
   import { mockCustomers } from '../data/mock-customers';
   console.log('Loaded customers:', mockCustomers.length);
   ```

2. **Validate Data Structure**:
   ```javascript
   const validateCustomerData = (customers) => {
     return customers.every(customer => 
       customer.id && 
       customer.name && 
       customer.domain
     );
   };
   ```

3. **Add Fallback Data**:
   ```javascript
   const defaultCustomers = [
     {
       id: 'fallback_001',
       name: 'Demo Customer',
       domain: 'example.com',
       // ... other required fields
     }
   ];
   
   const customers = mockCustomers.length > 0 ? mockCustomers : defaultCustomers;
   ```

---

## UI/UX Issues

### Issue: Layout Broken on Mobile
**Symptoms**: Components overlap, text too small, buttons not clickable

**Solutions**:

1. **Use Responsive Classes**:
   ```javascript
   // Tailwind responsive utilities
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {/* Content */}
   </div>
   ```

2. **Test on Mobile**:
   ```bash
   # Open Chrome DevTools
   # Toggle device toolbar (Ctrl+Shift+M)
   # Test different screen sizes
   ```

3. **Add Viewport Meta Tag**:
   ```html
   <!-- In index.html -->
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

### Issue: Styling Not Applied
**Symptoms**: Components look unstyled, Tailwind classes not working

**Solutions**:

1. **Check Tailwind Configuration**:
   ```javascript
   // tailwind.config.js
   module.exports = {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     // ...
   };
   ```

2. **Import Tailwind CSS**:
   ```css
   /* src/index.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. **Verify Class Names**:
   ```javascript
   // Check for typos in class names
   <div className="bg-blue-500">  {/* ✓ Correct */}
   <div className="bg-blue-5000"> {/* ✗ Wrong */}
   ```

---

## Development Tools

### Debug Mode
Enable debug logging to troubleshoot issues:

```javascript
// Add to localStorage in browser console
localStorage.setItem('DEBUG', 'true');

// Use in your code
const DEBUG = localStorage.getItem('DEBUG') === 'true';

if (DEBUG) {
  console.log('Debug info:', data);
}
```

### API Testing Tool
Test API endpoints directly:

```javascript
// Add to browser console
const testAPI = async (endpoint, params = {}) => {
  const url = new URL(`https://api.api-ninjas.com/v1/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  try {
    const response = await fetch(url, {
      headers: { 'X-Api-Key': 'your_key_here' }
    });
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Usage
testAPI('whois', { domain: 'github.com' });
```

### Performance Monitoring
Monitor component performance:

```javascript
// Add to components for performance monitoring
const PerformanceMonitor = ({ children, name }) => {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      console.log(`${name} render time:`, end - start, 'ms');
    };
  });
  
  return children;
};

// Usage
<PerformanceMonitor name="CustomerCard">
  <CustomerCard customer={customer} />
</PerformanceMonitor>
```

---

## Getting Help

### Workshop Support Checklist

Before asking for help, please check:

1. **Console Errors**: Open browser dev tools and check for red errors
2. **Network Tab**: Verify API requests are being made and their responses
3. **Environment**: Confirm `.env` file exists and has correct API key
4. **Dependencies**: Run `npm install` to ensure all packages are installed
5. **Restart**: Try restarting the development server

### Reporting Issues

When reporting issues, please include:

1. **Error Messages**: Full error text from console
2. **Steps to Reproduce**: What you did before the error occurred
3. **Browser/OS**: Which browser and operating system you're using
4. **Code Snippet**: Relevant code that's causing the issue
5. **Screenshot**: If it's a visual issue

### Additional Resources

- **React DevTools**: Browser extension for debugging React components
- **API Ninjas Status**: [status.api-ninjas.com](https://status.api-ninjas.com)
- **Tailwind CSS Documentation**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **MDN Web Docs**: [developer.mozilla.org](https://developer.mozilla.org)

Remember: Most issues in workshops are common and have simple solutions. Don't hesitate to ask for help!