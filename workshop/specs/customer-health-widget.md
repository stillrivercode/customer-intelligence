# Customer Health Score Widget Specification

## Context
Customer Success Managers need a single metric that represents overall customer health, combining multiple data points into an actionable score with clear indicators of risk or opportunity.

## Requirements

### Functional Requirements
- [ ] Display overall health score (0-100)
- [ ] Show trend indicator (improving/stable/declining)
- [ ] Break down score by factors
- [ ] Update automatically every 15 minutes
- [ ] Cache results to minimize API calls

### Data Sources
**Internal (Mock):**
- Customer tier and MRR
- Signup date and last activity
- Industry and company size

**External (API Ninjas):**
- Domain age and registration status
- Website availability and SSL status
- Recent news mentions and sentiment
- Geographic business indicators

### Visual Design
- Circular progress indicator for main score
- Color coding: Green (80+), Yellow (50-79), Red (<50)
- Sparkline for 7-day trend
- Expandable details panel
- Loading and error states

### Score Calculation
```
Health Score = (0.25 × Domain Stability) + 
               (0.25 × Website Health) + 
               (0.25 × Market Presence) + 
               (0.25 × Engagement Level)
```

#### Domain Stability (25%)
- **Domain Age**: 
  - < 1 year: 20 points
  - 1-3 years: 50 points
  - 3-5 years: 80 points
  - 5+ years: 100 points
- **Registration Status**: Active = 100, Expired = 0

#### Website Health (25%)
- **Availability**: HTTP 200 = 100, others = 0
- **SSL Certificate**: Valid = 100, Invalid = 50, None = 0

#### Market Presence (25%)
- **News Count**: 
  - 0 articles: 10 points
  - 1-3 articles: 40 points
  - 4-10 articles: 80 points
  - 10+ articles: 100 points
- **Sentiment**: Positive +20, Neutral 0, Negative -20

#### Engagement Level (25%)
- **Days Since Activity**:
  - < 7 days: 100 points
  - 7-30 days: 70 points
  - 30-90 days: 40 points
  - > 90 days: 10 points
- **Tier Multiplier**: Enterprise 1.2x, Growth 1.0x, Startup 0.8x

### Performance Requirements
- Initial load < 2 seconds
- Subsequent updates < 500ms
- Graceful degradation if APIs fail
- Maximum 10 API calls per customer per hour

## Component Interface

### Props
```typescript
interface CustomerHealthScoreProps {
  customer: Customer;
  refreshInterval?: number; // default: 15 minutes
  showBreakdown?: boolean; // default: true
  onScoreChange?: (score: HealthScore) => void;
}

interface HealthScore {
  overall: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
  breakdown: {
    domain: FactorScore;
    website: FactorScore;
    market: FactorScore;
    engagement: FactorScore;
  };
  lastUpdated: string; // ISO timestamp
  confidence: 'high' | 'medium' | 'low';
}

interface FactorScore {
  score: number;
  weight: number;
  details: Record<string, any>;
}
```

### State Management
```typescript
interface HealthScoreState {
  score: HealthScore | null;
  loading: boolean;
  error: string | null;
  lastFetch: string | null;
}
```

## Visual Specifications

### Layout
```
┌─────────────────────────────────────┐
│  Customer Health Score              │
│  ┌─────────┐  ┌─────────────────┐   │
│  │   85    │  │ ↗ Improving     │   │
│  │  ████   │  │ Last: 2 hrs ago │   │
│  └─────────┘  └─────────────────┘   │
│                                     │
│  Factor Breakdown                   │
│  ▓▓▓▓▓▓▓▓▓░ Domain (90)            │
│  ▓▓▓▓▓▓▓▓▓▓ Website (100)          │
│  ▓▓▓▓▓░░░░░ Market (70)            │
│  ▓▓▓▓▓▓▓▓░░ Engagement (80)        │
│                                     │
│  [Refresh] [Export] [Details]       │
└─────────────────────────────────────┘
```

### Color Scheme
- **Excellent (80-100)**: `bg-green-500`, `text-green-800`
- **Good (60-79)**: `bg-yellow-500`, `text-yellow-800`
- **At Risk (40-59)**: `bg-orange-500`, `text-orange-800`
- **Critical (<40)**: `bg-red-500`, `text-red-800`

### Animations
- Smooth score transitions with `transition-all duration-500`
- Pulse effect during loading
- Subtle bounce on score updates

## Error Handling

### API Failures
- Display last known score with warning
- Show degraded functionality notice
- Provide manual retry option

### Missing Data
- Use default/neutral scores for missing factors
- Lower confidence rating
- Display data completeness indicator

### Network Issues
- Offline mode with cached data
- Queue updates for when online
- Connection status indicator

## Accessibility

### ARIA Labels
```jsx
<div 
  role="progressbar"
  aria-valuenow={score.overall}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`Customer health score: ${score.overall} out of 100`}
>
```

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to expand details
- Arrow keys for factor navigation

### Screen Reader Support
- Descriptive text for all visual elements
- Status announcements for score changes
- Structured heading hierarchy

## Testing Requirements

### Unit Tests
- Score calculation accuracy
- Factor weight validation
- Error handling scenarios
- Props validation

### Integration Tests
- API integration with mocked responses
- State management with async updates
- Component lifecycle events

### Performance Tests
- Render time under 100ms
- Memory usage optimization
- Bundle size impact

## Acceptance Criteria
- [ ] Score updates reflect real-time data
- [ ] All API failures handled gracefully
- [ ] Calculations match specification exactly
- [ ] Accessible via keyboard navigation
- [ ] Mobile responsive design
- [ ] Export functionality for reports
- [ ] Loading states prevent UI flicker
- [ ] Error recovery works reliably
- [ ] Performance targets met consistently
- [ ] Visual design matches mockups

## Implementation Notes

### Optimization Strategies
1. **Memoization**: Cache expensive calculations
2. **Debouncing**: Prevent excessive API calls
3. **Lazy Loading**: Load details on demand
4. **Background Updates**: Non-blocking refreshes

### Data Flow
1. Component mounts → Check cache
2. If stale → Fetch API data
3. Calculate score → Update state
4. Render with new data
5. Schedule next update

### Error Recovery
1. Detect failure → Log error
2. Use cached data if available
3. Display appropriate message
4. Provide retry mechanism
5. Report to monitoring system