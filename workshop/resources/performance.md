# Performance Optimization Guide

## Overview

This guide covers performance optimization techniques for the Customer Intelligence Dashboard, ensuring smooth user experience and efficient resource utilization.

## Performance Targets

### Target Metrics
- **Initial Load**: < 2 seconds
- **Widget Updates**: < 500ms
- **API Response**: < 1 second
- **Memory Usage**: < 50MB
- **Bundle Size**: < 2MB
- **Lighthouse Score**: > 90

### Measurement Tools
```javascript
// Performance timing measurement
const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  };
};

// Usage
const optimizedFetch = measurePerformance('API Call', fetch);
```

## Component Optimization

### React.memo for Expensive Components
```javascript
import React, { memo } from 'react';

// Expensive component that should only re-render when props change
const CustomerHealthScore = memo(({ customer, healthData }) => {
  // Expensive calculations here
  const score = calculateHealthScore(customer, healthData);
  
  return (
    <div className="health-score-widget">
      <CircularProgress value={score.overall} />
      <HealthBreakdown factors={score.breakdown} />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.customer.id === nextProps.customer.id &&
    prevProps.healthData === nextProps.healthData
  );
});
```

### useMemo for Heavy Calculations
```javascript
import { useMemo } from 'react';

const MarketIntelligence = ({ articles, customer }) => {
  // Expensive sentiment analysis
  const analyzedArticles = useMemo(() => {
    return articles.map(article => ({
      ...article,
      sentiment: analyzeSentiment(article.content),
      relevance: calculateRelevance(article, customer)
    }));
  }, [articles, customer.id]); // Only recalculate when dependencies change
  
  // Expensive aggregation
  const summary = useMemo(() => {
    return {
      totalArticles: analyzedArticles.length,
      averageSentiment: calculateAverageSentiment(analyzedArticles),
      topEvents: extractTopEvents(analyzedArticles)
    };
  }, [analyzedArticles]);
  
  return (
    <div>
      <SummaryStats summary={summary} />
      <ArticleList articles={analyzedArticles} />
    </div>
  );
};
```

### useCallback for Stable Function References
```javascript
import { useCallback, useState } from 'react';

const CustomerDashboard = ({ customers }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filters, setFilters] = useState({});
  
  // Stable function reference prevents child re-renders
  const handleCustomerSelect = useCallback((customer) => {
    setSelectedCustomer(customer);
    // Track analytics
    analytics.track('customer_selected', { customerId: customer.id });
  }, []); // No dependencies = never changes
  
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  }, []);
  
  return (
    <div>
      <CustomerSelector 
        customers={customers}
        onSelect={handleCustomerSelect}
      />
      <FilterPanel 
        filters={filters}
        onChange={handleFilterChange}
      />
    </div>
  );
};
```

## Data Management Optimization

### Intelligent Caching System
```javascript
class IntelligentCache {
  constructor() {
    this.cache = new Map();
    this.accessTimes = new Map();
    this.maxSize = 100;
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Check TTL
    if (Date.now() > item.expiry) {
      this.delete(key);
      return null;
    }
    
    // Update access time for LRU
    this.accessTimes.set(key, Date.now());
    return item.data;
  }
  
  set(key, data, ttl = 900000) { // 15 minutes default
    // Evict old items if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
      size: this.estimateSize(data)
    });
    this.accessTimes.set(key, Date.now());
  }
  
  evictLRU() {
    let oldestKey = null;
    let oldestTime = Infinity;
    
    for (const [key, time] of this.accessTimes) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.delete(oldestKey);
    }
  }
  
  estimateSize(data) {
    return JSON.stringify(data).length * 2; // Rough estimate
  }
  
  delete(key) {
    this.cache.delete(key);
    this.accessTimes.delete(key);
  }
  
  getStats() {
    const totalSize = Array.from(this.cache.values())
      .reduce((sum, item) => sum + item.size, 0);
    
    return {
      itemCount: this.cache.size,
      totalSize: totalSize,
      hitRate: this.hitCount / (this.hitCount + this.missCount)
    };
  }
}

const cache = new IntelligentCache();
```

### Request Deduplication
```javascript
class RequestManager {
  constructor() {
    this.pendingRequests = new Map();
  }
  
  async fetch(url, options = {}) {
    const key = this.getRequestKey(url, options);
    
    // Return existing promise if request is already in flight
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }
    
    // Create new request
    const requestPromise = this.makeRequest(url, options)
      .finally(() => {
        // Clean up when request completes
        this.pendingRequests.delete(key);
      });
    
    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }
  
  getRequestKey(url, options) {
    return `${options.method || 'GET'}:${url}:${JSON.stringify(options.body || {})}`;
  }
  
  async makeRequest(url, options) {
    const response = await fetch(url, options);
    return response.json();
  }
}

const requestManager = new RequestManager();

// Usage - multiple calls to same endpoint will share the same request
const data1 = requestManager.fetch('/api/customer/123');
const data2 = requestManager.fetch('/api/customer/123'); // Reuses same request
```

### Data Pagination
```javascript
const usePaginatedData = (fetchFn, pageSize = 20) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newData = await fetchFn(data.length, pageSize);
      
      setData(prev => [...prev, ...newData]);
      setHasMore(newData.length === pageSize);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, data.length, pageSize, loading, hasMore]);
  
  const reset = useCallback(() => {
    setData([]);
    setHasMore(true);
    setError(null);
  }, []);
  
  return { data, loading, hasMore, error, loadMore, reset };
};

// Usage
const CustomerList = () => {
  const { data: customers, loading, hasMore, loadMore } = usePaginatedData(
    (offset, limit) => fetchCustomers({ offset, limit })
  );
  
  return (
    <InfiniteScroll
      dataLength={customers.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<LoadingSpinner />}
    >
      {customers.map(customer => (
        <CustomerCard key={customer.id} customer={customer} />
      ))}
    </InfiniteScroll>
  );
};
```

## API Optimization

### Batch API Requests
```javascript
class APIBatcher {
  constructor(apiClient, batchDelay = 100) {
    this.apiClient = apiClient;
    this.batchDelay = batchDelay;
    this.batches = new Map();
  }
  
  async batchRequest(endpoint, params) {
    const batchKey = endpoint;
    
    if (!this.batches.has(batchKey)) {
      this.batches.set(batchKey, {
        requests: [],
        timeout: null
      });
    }
    
    const batch = this.batches.get(batchKey);
    
    return new Promise((resolve, reject) => {
      batch.requests.push({ params, resolve, reject });
      
      // Clear existing timeout
      if (batch.timeout) {
        clearTimeout(batch.timeout);
      }
      
      // Set new timeout to execute batch
      batch.timeout = setTimeout(() => {
        this.executeBatch(batchKey);
      }, this.batchDelay);
    });
  }
  
  async executeBatch(batchKey) {
    const batch = this.batches.get(batchKey);
    if (!batch || batch.requests.length === 0) return;
    
    this.batches.delete(batchKey);
    
    try {
      // Execute all requests in parallel
      const results = await Promise.allSettled(
        batch.requests.map(({ params }) => 
          this.apiClient.request(batchKey, params)
        )
      );
      
      // Resolve individual promises
      results.forEach((result, index) => {
        const { resolve, reject } = batch.requests[index];
        
        if (result.status === 'fulfilled') {
          resolve(result.value);
        } else {
          reject(result.reason);
        }
      });
    } catch (error) {
      // Reject all promises if batch fails
      batch.requests.forEach(({ reject }) => reject(error));
    }
  }
}

// Usage
const batcher = new APIBatcher(apiNinjas);

// These will be batched together
const data1 = batcher.batchRequest('whois', { domain: 'github.com' });
const data2 = batcher.batchRequest('whois', { domain: 'google.com' });
const data3 = batcher.batchRequest('whois', { domain: 'microsoft.com' });
```

### Smart Background Prefetching
```javascript
const usePrefetch = (prefetchFn, dependencies = []) => {
  const prefetchRef = useRef(null);
  
  useEffect(() => {
    // Cancel previous prefetch
    if (prefetchRef.current) {
      prefetchRef.current.cancel();
    }
    
    // Start new prefetch after delay
    prefetchRef.current = {
      cancel: () => clearTimeout(prefetchRef.current.timeout),
      timeout: setTimeout(() => {
        prefetchFn().catch(console.error);
      }, 1000) // 1 second delay
    };
    
    return () => {
      if (prefetchRef.current) {
        prefetchRef.current.cancel();
      }
    };
  }, dependencies);
};

// Usage
const CustomerDashboard = ({ customers }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  
  // Prefetch data for next likely customer
  usePrefetch(async () => {
    const nextCustomer = getNextLikelyCustomer(customers, selectedCustomer);
    if (nextCustomer) {
      await prefetchCustomerData(nextCustomer);
    }
  }, [selectedCustomer]);
  
  return <div>{/* Dashboard content */}</div>;
};
```

## Bundle Optimization

### Code Splitting
```javascript
// Lazy load components
const CustomerHealthWidget = lazy(() => 
  import('./components/CustomerHealthWidget')
);
const MarketIntelligenceWidget = lazy(() => 
  import('./components/MarketIntelligenceWidget')
);
const GeographicInsightsWidget = lazy(() => 
  import('./components/GeographicInsightsWidget')
);

// Route-based splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));

const App = () => (
  <Router>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  </Router>
);
```

### Dynamic Imports
```javascript
// Load heavy libraries only when needed
const loadChartLibrary = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};

const AnalyticsWidget = () => {
  const [Chart, setChart] = useState(null);
  const [showChart, setShowChart] = useState(false);
  
  const handleShowChart = async () => {
    if (!Chart) {
      const ChartClass = await loadChartLibrary();
      setChart(ChartClass);
    }
    setShowChart(true);
  };
  
  return (
    <div>
      {!showChart ? (
        <button onClick={handleShowChart}>Show Analytics</button>
      ) : (
        <ChartComponent Chart={Chart} />
      )}
    </div>
  );
};
```

### Tree Shaking Optimization
```javascript
// Import only what you need
import { debounce } from 'lodash/debounce'; // ✓ Good
import _ from 'lodash'; // ✗ Imports entire library

// Use ES modules
import { format } from 'date-fns'; // ✓ Good
import * as dateFns from 'date-fns'; // ✗ Larger bundle

// Configure bundler for tree shaking
// vite.config.js
export default {
  build: {
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false
      }
    }
  }
};
```

## Rendering Optimization

### Virtual Scrolling
```javascript
import { FixedSizeList as List } from 'react-window';

const VirtualizedCustomerList = ({ customers }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <CustomerCard customer={customers[index]} />
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={customers.length}
      itemSize={120}
      itemData={customers}
    >
      {Row}
    </List>
  );
};
```

### Intersection Observer for Lazy Loading
```javascript
const useLazyLoading = (ref, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, ...options }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [ref, options]);
  
  return isVisible;
};

// Usage
const LazyWidget = ({ children }) => {
  const ref = useRef();
  const isVisible = useLazyLoading(ref);
  
  return (
    <div ref={ref} className="min-h-[200px]">
      {isVisible ? children : <SkeletonLoader />}
    </div>
  );
};
```

## Memory Management

### Cleanup Effects
```javascript
const useCleanupEffect = (effect, deps) => {
  useEffect(() => {
    const cleanup = effect();
    
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, deps);
};

// Usage
const RealTimeUpdates = () => {
  useCleanupEffect(() => {
    const interval = setInterval(updateData, 30000);
    const subscription = eventSource.subscribe(handleEvent);
    
    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, []);
  
  return <div>{/* Component content */}</div>;
};
```

### Weak References for Caches
```javascript
class WeakCache {
  constructor() {
    this.cache = new WeakMap();
  }
  
  get(key) {
    return this.cache.get(key);
  }
  
  set(key, value) {
    this.cache.set(key, value);
  }
  
  has(key) {
    return this.cache.has(key);
  }
}

// Objects can be garbage collected even if cached
const cache = new WeakCache();
```

## Performance Monitoring

### Custom Performance Hooks
```javascript
const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Report slow renders
      if (renderTime > 16) { // 60fps threshold
        console.warn(`Slow render in ${componentName}: ${renderTime}ms`);
      }
      
      // Track in analytics
      analytics.track('component_render_time', {
        component: componentName,
        duration: renderTime
      });
    };
  });
};

// Usage
const CustomerCard = ({ customer }) => {
  usePerformanceMonitor('CustomerCard');
  
  return <div>{/* Component content */}</div>;
};
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze

# Or use webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/assets/*.js
```

### Lighthouse Integration
```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'npm run preview',
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }]
      }
    }
  }
};
```

## Best Practices Summary

### Do's
- ✅ Use React.memo for expensive components
- ✅ Implement intelligent caching with TTL
- ✅ Batch API requests when possible
- ✅ Use code splitting for large features
- ✅ Monitor performance metrics
- ✅ Clean up effects and subscriptions
- ✅ Use lazy loading for non-critical content

### Don'ts
- ❌ Don't render large lists without virtualization
- ❌ Don't make unnecessary API calls
- ❌ Don't ignore memory leaks
- ❌ Don't bundle unused code
- ❌ Don't block the main thread
- ❌ Don't skip performance testing

### Performance Checklist
- [ ] Bundle size under 2MB
- [ ] Initial load under 2 seconds
- [ ] API calls properly cached
- [ ] Components properly memoized
- [ ] Memory leaks eliminated
- [ ] Lighthouse score > 90
- [ ] Mobile performance optimized
- [ ] Error boundaries implemented