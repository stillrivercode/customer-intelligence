# Customer Intelligence Dashboard Workshop - Run of Show

**Workshop Title**: Document Driven Development with AI - Building a Customer Intelligence Dashboard  
**Duration**: 2-3 hours  
**Format**: Interactive hands-on workshop  
**Target Audience**: Developers, Product Managers, Technical Leaders

---

## Pre-Workshop Setup (15 minutes before start)

### Instructor Checklist
- [ ] **Technology Setup**
  - Verify internet connection and screen sharing
  - Test workshop API connectivity
  - Prepare backup scenarios for API failures
  - Have example outputs ready for reference

- [ ] **Materials Preparation** 
  - Clone and test the repository locally
  - Verify all workshop links are accessible
  - Prepare final solution code for reference
  - Test export functionality with sample data

- [ ] **Participant Preparation**
  - Send setup instructions 24 hours prior
  - Confirm Node.js 18+ installations
  - No API accounts needed (using workshop proxy)
  - Share repository access and initial setup

---

## Workshop Opening (20 minutes)

### Welcome & Introductions (5 minutes)
- **Facilitator introduction** and workshop overview
- **Quick participant introductions**: Name, role, experience with React/AI development
- **Learning objectives** and success criteria review

### Workshop Context Setting (10 minutes)
**Presentation slides covering:**

1. **The DDD Philosophy** (3 minutes)
   - "Write specifications first, let AI generate the implementation"
   - Traditional development vs. AI-assisted development workflows
   - Real-world productivity gains: specification → working code in minutes

2. **Workshop Business Context** (4 minutes)
   - Customer Success challenges in modern B2B SaaS
   - The intelligence gap: scattered data, manual analysis, reactive approach
   - Vision: Proactive, data-driven customer health management

3. **Technical Stack & Architecture** (3 minutes)
   - React 18 + TypeScript for robust frontend development
   - Workshop API for real-world data (zero setup)
   - Progressive complexity: Basic display → API integration → Intelligence layer → Production features

### Live Demo - End State Preview (5 minutes)
**Show the completed dashboard:**
- Customer selection with health scores
- Real-time domain and market intelligence
- Geographic insights and engagement optimization
- Alert system with actionable recommendations
- Data export capabilities

*"This is what we'll build together in the next 2-3 hours using DDD methodology"*

---

## Phase 1: Basic Dashboard Foundation (35 minutes)

### Phase Introduction (5 minutes)
**Learning Focus:**
- Understanding the DDD specification-to-code workflow
- Building React components from detailed requirements
- Implementing customer data display and selection

**Key Success Metric:** Working customer selector with persistent state in 30 minutes

### Hands-on Development (25 minutes)

#### Task 1.1: Environment Setup (5 minutes)
**Instructor leads, participants follow:**
```bash
# Verify environment
node --version && npm --version
npm run dev
# Open http://localhost:5173
```

**Troubleshoot common issues:**
- Node version compatibility
- Port conflicts
- Dependency installation problems

#### Task 1.2: Mock Data Exploration (5 minutes)
**Guided review of customer schema:**
- Examine `src/data/mock-customers.js`
- Identify key fields for display (name, tier, MRR, industry)
- Discuss real-world API integration points

#### Task 1.3: Component Specification Writing (5 minutes)
**Collaborative specification creation:**
- Guide participants through `workshop/specs/customer-card-spec.md`
- Emphasize detailed requirements drive better AI code generation
- Show examples of functional vs visual requirements

#### Task 1.4: AI-Generated Component Development (10 minutes)
**Live AI code generation session:**
- Use the provided AI prompt for CustomerCard component
- Generate React component with TypeScript and Tailwind CSS
- Demonstrate iterative refinement based on specification

**Expected outcomes:**
- `src/components/CustomerCard.jsx` - Professional customer display cards
- `src/components/CustomerSelector.jsx` - Filterable customer list with search
- localStorage integration for selection persistence

### Phase 1 Validation & Q&A (5 minutes)
**Group validation checklist:**
- [ ] Customer cards display all required information
- [ ] Search functionality filters customers
- [ ] Selected customer persists after page refresh
- [ ] Responsive design works on different screen sizes

**Common troubleshooting:**
- Tailwind CSS configuration issues
- Component prop passing errors
- localStorage access problems

---

## Phase 2: API Integration & Real Data (50 minutes)

### Phase Introduction (5 minutes)
**Learning Focus:**
- Production-ready API integration patterns
- Rate limiting and error handling strategies
- Real-world data display and processing

**Key Success Metric:** Live domain data and website status displaying in 45 minutes

### API Setup & Rate Limiting (10 minutes)

#### Task 2.1: Zero Setup Required (3 minutes)
**Instant start:**
```bash
# No API keys needed!
# Workshop uses https://api.stillriver.info/
```

**Benefits discussion:**
- Zero friction startup
- No account creation barriers
- Production patterns without setup overhead

#### Task 2.2: Rate Limiter Implementation (7 minutes)
**Live coding session:**
- Explain rate limiting as production best practice
- Generate `src/utils/rateLimiter.js` using AI
- Demonstrate queue management and request throttling

### Service Layer Development (15 minutes)

#### Task 2.3: API Service Creation (15 minutes)
**Collaborative development:**
- Specify workshop API service layer requirements
- Generate `src/services/workshopApi.js` with error handling
- Integration with rate limiter and axios client
- Live testing with browser network tab

**Key endpoints implemented:**
- `/whois` for domain registration data
- `/urllookup` for website availability
- Foundation for news, city, and timezone endpoints

### Widget Development (15 minutes)

#### Task 2.4: Domain Health Widget (10 minutes)
**Specification-driven development:**
- Create detailed widget specification
- AI-generate React component with API integration
- Implement loading states and error boundaries
- Real-time data display for customer domains

#### Task 2.5: Dashboard Integration (5 minutes)
**Live integration demo:**
- Add widget to main dashboard layout
- Test with different customer domains
- Demonstrate responsive grid system

### Phase 2 Testing & Validation (5 minutes)
**Interactive testing session:**
- Test with GitHub, Spotify, Wikipedia customers
- Observe different domain ages and statuses
- Validate error handling by temporarily removing API key
- Check rate limiting in browser network tab

**Troubleshooting clinic:**
- CORS and API key validation
- Rate limiter debugging
- Environment variable loading issues

---

## Mid-Workshop Break (15 minutes)

**Informal networking and discussion:**
- Share early impressions of DDD methodology
- Discuss real-world applications in participants' organizations
- Address any technical questions from Phases 1-2

---

## Phase 3: Intelligence Layer & Business Logic (50 minutes)

### Phase Introduction (5 minutes)
**Learning Focus:**
- Complex business logic implementation
- Multi-source data integration and analysis
- Health scoring algorithms and trend analysis

**Key Success Metric:** Working health score calculator with market intelligence in 45 minutes

### Health Score Algorithm Development (20 minutes)

#### Task 3.1: Algorithm Specification (5 minutes)
**Detailed business logic definition:**
- Review `workshop/specs/health-score-algorithm.md`
- Explain weighting factors and calculation methodology
- Discuss real-world customer success metrics

#### Task 3.2: Calculator Implementation (15 minutes)
**Complex AI code generation:**
- Generate `src/utils/healthCalculator.js` with full algorithm
- Implement domain stability, website health, market presence scoring
- Add trend analysis and confidence scoring
- Live testing with different customer scenarios

### Market Intelligence Development (20 minutes)

#### Task 3.3: News Analysis Widget (10 minutes)
**Advanced API integration:**
- Specify market intelligence requirements
- Generate news fetching and sentiment analysis
- Implement article categorization and relevance scoring

#### Task 3.4: Geographic Insights Widget (10 minutes)
**Location-based business intelligence:**
- City demographics and business environment data
- Timezone optimization for communication planning
- Holiday calendar integration

### Dashboard Orchestration (5 minutes)
**System integration:**
- Combine all widgets into unified health dashboard
- Implement coordinated data fetching and loading states
- Add summary health score with trend indicators

**Live demonstration:**
- Show complete health analysis for multiple customers
- Explain score calculation breakdown
- Discuss practical business applications

---

## Phase 4: Production Features & Polish (45 minutes)

### Phase Introduction (5 minutes)
**Learning Focus:**
- Enterprise-grade features and patterns
- Performance optimization techniques
- Production deployment considerations

**Key Success Metric:** Production-ready dashboard with alerts, export, and real-time updates

### Advanced Features Development (25 minutes)

#### Task 4.1: Real-time Updates System (8 minutes)
**Live implementation:**
- Generate real-time update hooks and components
- Implement automatic refresh with visual indicators
- Add pause/resume functionality for user control

#### Task 4.2: Data Export System (8 minutes)
**Practical business functionality:**
- Multi-format export (JSON, CSV, PDF simulation)
- Customer report generation
- Batch processing for multiple customers

#### Task 4.3: Alert & Recommendation Engine (9 minutes)
**Intelligent automation:**
- Risk detection algorithms
- Actionable recommendation generation
- Alert management and prioritization

### Performance Optimization (10 minutes)

#### Task 4.4: Production Optimizations (10 minutes)
**Live optimization session:**
- React.memo implementation for expensive components
- Intelligent caching strategies
- Bundle size optimization techniques
- Performance monitoring integration

### System Integration & Polish (5 minutes)
**Final dashboard assembly:**
- Professional layout with proper navigation
- Settings panel for user customization
- Error boundaries and graceful degradation
- Help system and user onboarding

---

## Workshop Wrap-up & Next Steps (20 minutes)

### Results Demonstration (10 minutes)
**Participant showcase:**
- Volunteer demonstrations of completed dashboards
- Compare different implementation approaches
- Celebrate successful completions and troubleshoot remaining issues

### Learning Reflection & Discussion (7 minutes)
**Facilitated discussion:**

1. **DDD Methodology Assessment** (3 minutes)
   - "How did specification-first development feel compared to traditional coding?"
   - Productivity gains observed during workshop
   - Quality and consistency of AI-generated code

2. **Business Value Discussion** (2 minutes)
   - Real-world applicability in participant organizations
   - ROI estimation for similar implementations
   - Integration challenges and opportunities

3. **Technical Insights** (2 minutes)
   - React patterns and API integration learnings
   - Performance optimization takeaways
   - Production deployment considerations

### Next Steps & Resources (3 minutes)
**Actionable follow-ups:**

1. **For Individual Learning:**
   - Advanced React patterns exploration
   - AI integration experimentation
   - DDD methodology practice with personal projects

2. **For Organizational Implementation:**
   - Pilot project identification
   - Team training planning
   - Integration assessment with existing systems

3. **Additional Resources:**
   - Workshop repository for continued experimentation
   - DDD methodology documentation
   - Community resources and support channels

---

## Post-Workshop Follow-up

### Immediate Actions (Within 24 hours)
- [ ] Send workshop materials and final code to all participants
- [ ] Share feedback survey link for continuous improvement
- [ ] Provide additional resources document with deeper learning paths

### One-Week Follow-up
- [ ] Optional office hours session for technical questions
- [ ] Share participant success stories and implementations
- [ ] Gather feedback on real-world application attempts

### One-Month Follow-up
- [ ] Case study development from participant implementations
- [ ] Advanced workshop planning based on interest and feedback
- [ ] Community building for ongoing DDD methodology support

---

## Instructor Notes & Tips

### Critical Success Factors
1. **Pre-workshop preparation is essential** - verify all technical setup works
2. **Balance talking vs. hands-on time** - 70% doing, 30% explanation
3. **Have backup plans** for API failures or technical issues
4. **Encourage questions and experimentation** throughout the workshop

### Common Challenges & Solutions
- **API rate limiting hits**: Have cached responses ready
- **Different experience levels**: Pair programming and buddy system
- **Time management**: Focus on core features, make advanced features optional
- **Technical issues**: Have instructor solutions ready for quick recovery

### Energy Management
- **Keep energy high** with frequent small wins and celebrations
- **Use breaks strategically** to prevent fatigue
- **Vary instruction methods** - live coding, group work, individual tasks
- **End on a high note** with working demonstrations and clear next steps

---

## Required Materials Checklist

### Technical Infrastructure
- [ ] Stable internet connection and backup
- [ ] Screen sharing setup with high-resolution display
- [ ] Code editor with syntax highlighting
- [ ] Browser with developer tools

### Workshop Materials
- [ ] Participant setup guide (sent 24 hours prior)
- [ ] Repository access for all participants
- [ ] Backup code solutions for each phase
- [ ] Troubleshooting guide for common issues
- [ ] Feedback forms and evaluation materials

### Presentation Materials
- [ ] Opening slides with context and objectives
- [ ] Technical architecture diagrams
- [ ] Business value proposition visuals
- [ ] Success metrics and ROI calculations
- [ ] Next steps and resource recommendations

---

This run of show provides a comprehensive blueprint for delivering an engaging, educational, and practical workshop that demonstrates the power of Document Driven Development while building a genuinely useful customer intelligence dashboard.