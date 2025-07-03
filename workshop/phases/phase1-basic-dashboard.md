# Phase 1: Basic Dashboard (30 minutes)

**Objective**: Display mock customer data and understand component structure

## Learning Goals

By the end of this phase, you will:
- ✅ Set up a React project with mock customer data
- ✅ Create a customer selector component
- ✅ Display basic customer information cards
- ✅ Implement localStorage persistence
- ✅ Understand DDD specification-to-code workflow

## DDD Focus

1. **Write specification** for customer display requirements
2. **Generate basic components** using AI from specifications
3. **Validate implementation** against acceptance criteria

## Tasks Overview

### Task 1.1: Project Setup (5 minutes)

```bash
# Verify your environment
node --version  # Should be 18+
npm --version

# Start the development server
npm run dev

# Open browser to http://localhost:5173
```

**Expected Result**: See the basic React application running

### Task 1.2: Mock Data Review (5 minutes)

Examine the pre-configured customer data:

```javascript
// src/data/mock-customers.js
export const mockCustomers = [
  {
    id: "cust_001",
    name: "TechVentures Inc",
    domain: "github.com",
    website: "https://github.com",
    city: "San Francisco",
    country: "United States",
    tier: "Enterprise",
    mrr: 5000,
    signupDate: "2023-01-15",
    lastActivity: "2024-12-28",
    industry: "Software Development",
    employees: "1000-5000",
    tags: ["high-value", "tech-savvy", "growth"]
  }
  // ... 14 more customers
];
```

**Activity**: Review the customer schema and identify key fields for display

### Task 1.3: Customer Card Specification (5 minutes)

Write a specification for the customer display card:

**Create**: `workshop/specs/customer-card-spec.md`

```markdown
# Customer Card Component Specification

## Context
Account managers need a quick overview of customer information to make 
informed decisions about engagement and prioritization.

## Requirements

### Functional Requirements
- [ ] Display customer name prominently
- [ ] Show tier badge (Enterprise/Growth/Startup)
- [ ] Display MRR with currency formatting
- [ ] Show last activity date (relative time)
- [ ] Display industry and employee count
- [ ] Show tags as colored badges
- [ ] Make entire card clickable to select customer

### Visual Design
- Clean card layout with white background
- Tier badge with color coding:
  - Enterprise: Blue
  - Growth: Green  
  - Startup: Orange
- Tags as small rounded badges
- Hover state with subtle shadow
- Selected state with border highlight

### Data Requirements
- Customer name (required)
- Tier (required)
- MRR in USD (required)
- Last activity date (required)
- Industry (optional)
- Employee count (optional)
- Tags array (optional)

## Acceptance Criteria
- [ ] Card displays all required information clearly
- [ ] Responsive design works on mobile and desktop
- [ ] Click handler works for customer selection
- [ ] Loading and error states handled gracefully
- [ ] Accessible via keyboard navigation
```

### Task 1.4: Generate Customer Card Component (10 minutes)

Use AI to generate the component from your specification:

**Prompt for AI**:
```
Generate a React component based on the specification in workshop/specs/customer-card-spec.md. 

Requirements:
- Use Tailwind CSS for styling
- Include TypeScript interfaces
- Implement all functional requirements
- Add proper accessibility attributes
- Include hover and selected states
- Format MRR as currency
- Show relative time for last activity

The component should accept:
- customer: Customer object
- isSelected: boolean
- onSelect: (customer) => void callback
```

**Expected File**: `src/components/CustomerCard.jsx`

### Task 1.5: Customer Selector Implementation (5 minutes)

Create a customer selector component:

**Specification**: Display all customers in a scrollable list with search functionality

**Generate with AI**:
```
Create a CustomerSelector component that:
- Displays list of customers using CustomerCard
- Implements search by name or domain
- Tracks selected customer state
- Uses localStorage to persist selection
- Shows customer count and search results count

Props:
- customers: Customer[]
- selectedCustomer: Customer
- onCustomerSelect: (customer) => void
```

**Expected File**: `src/components/CustomerSelector.jsx`

## Validation Checklist

After completing the tasks, verify:

- [ ] **Basic Display**: Customer cards show all required information
- [ ] **Selection**: Clicking a card selects the customer
- [ ] **Search**: Typing filters the customer list
- [ ] **Persistence**: Selected customer persists after page refresh
- [ ] **Responsive**: Works on both desktop and mobile
- [ ] **Accessibility**: Can navigate with keyboard

## Common Issues & Solutions

### Issue: Tailwind classes not applying
**Solution**: Verify `tailwind.config.js` includes your component paths:
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // ...
}
```

### Issue: Mock data not loading
**Solution**: Check import path and export syntax:
```javascript
import { mockCustomers } from '../data/mock-customers';
```

### Issue: localStorage errors
**Solution**: Add error handling for localStorage access:
```javascript
const getStoredCustomer = () => {
  try {
    const stored = localStorage.getItem('selectedCustomer');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};
```

## Phase 1 Success Criteria

✅ **Component Structure**: Clean, reusable components created
✅ **State Management**: Customer selection working with persistence  
✅ **Data Display**: All customer information displayed correctly
✅ **User Interaction**: Search and selection functioning
✅ **Visual Design**: Professional appearance with Tailwind CSS

## Code Quality Checks

Run these commands to verify your implementation:

```bash
# Type checking (if using TypeScript)
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Test the components
npm test CustomerCard
```

## Phase 1 Completion

When you've successfully completed all tasks:

1. **Demo your work**: Show customer selection and search working
2. **Review code quality**: Ensure clean, readable components
3. **Validate against spec**: Check all acceptance criteria met
4. **Document learnings**: Note any challenges or insights

**Time Check**: This phase should take ~30 minutes. If over time, focus on core functionality first.

---

**Next Phase**: [Phase 2: API Integration](./phase2-api-integration.md)

## Additional Resources

- **Tailwind CSS Cheat Sheet**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **React Hooks Reference**: [react.dev/reference/react](https://react.dev/reference/react)
- **localStorage Guide**: [developer.mozilla.org/docs/Web/API/Window/localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)