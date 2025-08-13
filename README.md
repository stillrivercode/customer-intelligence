# Customer Intelligence Dashboard

A comprehensive B2B SaaS customer health monitoring dashboard that demonstrates **Document Driven Development (DDD)** methodology through hands-on workshops. Built with modern React, TypeScript, and real-world API integrations.

## 🎯 Workshop Overview

This project serves as the primary example for Stillriver Software Solutions' **Document Driven Development Workshop Series**, delivered in partnership with **[ThisDot](https://www.thisdot.co/)**. Participants build a production-ready customer intelligence platform while learning to leverage AI for specification-driven code generation.

### Key Learning Objectives

- ✅ **Master DDD methodology** - Specification-first development approach
- ✅ **AI-assisted coding** - Generate production code from detailed specifications  
- ✅ **Real-world integration** - Connect to external APIs with proper error handling
- ✅ **Business intelligence** - Build meaningful customer health scoring algorithms
- ✅ **Modern React patterns** - Hooks, context, performance optimization
- ✅ **Production readiness** - Testing, security, deployment considerations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Basic React/TypeScript knowledge

### Installation

```bash
# Clone the repository
git clone https://github.com/stillrivercode/customer-intelligence.git
cd customer-intelligence

# Run automated setup (installs dependencies, sets up workflows)
./install.sh

# No environment setup needed for basic functionality

# Start development server
npm run dev
```

### No API Key Required
The Stillriver API is a public proxy service - no API key or registration needed. Just start the development server and begin building!

## 📚 Workshop Structure

### Progressive Learning Path

| Phase | Duration | Focus | Key Skills |
|-------|----------|-------|------------|
| **[Phase 1](./workshop/phases/phase1-basic-dashboard.md)** | 30 min | Basic Dashboard | React components, mock data, localStorage |
| **[Phase 2](./workshop/phases/phase2-api-integration.md)** | 45 min | API Integration | Rate limiting, error handling, real data |
| **[Phase 3](./workshop/phases/phase3-intelligence-layer.md)** | 45 min | Intelligence Layer | Health scoring, sentiment analysis, business logic |
| **[Phase 4](./workshop/phases/phase4-advanced-features.md)** | 60 min | Advanced Features | Real-time updates, alerts, performance optimization |

### Workshop Materials

- **[Workshop Guide](./workshop/README.md)** - Complete workshop navigation
- **[Technical Overview](./workshop/overview.md)** - Architecture and setup details
- **[API Reference](./workshop/resources/api-reference.md)** - Complete API integration guide
- **[Troubleshooting](./workshop/resources/troubleshooting.md)** - Common issues and solutions

## 🏗️ Architecture & Features

### Customer Intelligence Platform

**Core Widgets:**
- **Health Score Calculator** - Multi-factor customer health assessment
- **Market Intelligence Feed** - Automated news monitoring with sentiment analysis
- **Geographic Insights** - Location-based business intelligence
- **Engagement Optimizer** - Communication timing and channel recommendations

**Technical Stack:**
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite 6 with modern ES modules
- **API Integration**: Stillriver API (proxy for domain, news, geographic data)
- **State Management**: React Context with localStorage persistence
- **Testing**: Vitest with Happy DOM
- **Code Quality**: ESLint 9 (flat config), Prettier

### Business Value Demonstration

**Measurable Outcomes:**
- 📊 **Customer Health Scoring** - Automated risk assessment
- 📰 **Market Intelligence** - Real-time company news analysis  
- 🌍 **Geographic Context** - Location-based business insights
- 📞 **Engagement Optimization** - Data-driven communication strategies
- ⚡ **Performance** - Sub-2-second load times with intelligent caching

## 🎓 Document Driven Development (DDD)

### Methodology Overview

DDD transforms traditional development by putting **specifications first**:

1. **Write detailed specifications** for each component
2. **Generate code using AI** from these specifications
3. **Iterate and refine** through testing and validation
4. **Scale efficiently** with consistent patterns

### Workshop Benefits

**For Developers:**
- Learn cutting-edge AI-assisted development
- Master specification writing for better code quality
- Experience modern React and TypeScript patterns
- Build portfolio-worthy customer intelligence platform

**For Organizations:**
- Evaluate DDD methodology for team adoption
- Assess AI-powered development productivity gains
- Understand customer success platform architecture
- Pilot advanced development workflows

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # ESLint checking
npm run lint:fix         # Auto-fix linting issues
npm run format           # Prettier formatting
npm run type-check       # TypeScript validation

# Testing
npm run test             # Run tests with Vitest
npm run test:ui          # Visual test interface
npm run test:coverage    # Coverage report

# Analysis
npm run analyze          # Bundle size analysis
```

## ⚙️ GitHub Configuration

### Required Repository Secrets

To enable AI-powered workflows (code reviews, etc.), configure these secrets in your repository settings:

- **`OPENROUTER_API_KEY`** - Your API key from [OpenRouter](https://openrouter.ai) for AI code reviews
  - Required for the AI PR Review workflow to function
  - Get your key at: https://openrouter.ai/keys

### Optional Repository Variables

- **`AI_MODEL`** - The AI model to use for reviews (defaults to `anthropic/claude-3.5-sonnet`)
  - Example values: `google/gemini-2.5-pro`, `openai/gpt-4-turbo`
  - See available models at: https://openrouter.ai/models

### Setting Up Secrets and Variables

1. Go to your repository's Settings → Secrets and variables → Actions
2. Add `OPENROUTER_API_KEY` as a Repository Secret
3. (Optional) Add `AI_MODEL` as a Repository Variable

### Manual Review Triggers

The AI PR Review workflow can be triggered manually:
- **Add label**: `ai-review-needed` to any PR
- **Comment**: `/review` on any PR

## 📋 Component Specifications

### Detailed Technical Specs

- **[Customer Health Widget](./workshop/specs/customer-health-widget.md)** - Health scoring algorithm and implementation
- **[Market Intelligence Feed](./workshop/specs/market-intelligence-feed.md)** - News analysis and sentiment processing
- **[Geographic Insights](./workshop/specs/geographic-insights.md)** - Location-based business intelligence
- **[Engagement Optimizer](./workshop/specs/engagement-optimizer.md)** - Communication optimization algorithms

Each specification includes:
- Functional requirements and acceptance criteria
- Data sources and processing logic
- Visual design and user experience
- Performance requirements and optimization
- Testing strategies and validation

## 🔧 API Integration

### Stillriver API Endpoints Used

| Endpoint | Purpose | Dashboard Feature |
|----------|---------|-------------------|
| `/whois` | Domain registration info | Company stability metrics |
| `/urllookup` | Website availability | Uptime monitoring |
| `/news` | Company news | Market intelligence |
| `/city` | Demographics | Location insights |
| `/timezone` | Time zone data | Communication optimization |
| `/holidays` | Holiday calendar | Engagement planning |

**Features:**
- Rate limiting (varies by endpoint: 100-1000 req/hour)
- Intelligent caching with dynamic TTL
- Built-in proxy layer for reliability
- Graceful error handling
- Offline mode support

## 🎯 Success Metrics

### Workshop Completion Targets

- **90%** complete Phase 1 & 2 (basic functionality)
- **80%** complete Phase 3 (intelligence features)  
- **60%** attempt Phase 4 (advanced features)
- **4.5/5** average satisfaction rating

### Technical Achievements

- **< 2 seconds** initial dashboard load time
- **> 90%** API integration success rate
- **100%** health score calculation accuracy
- **> 95%** performance targets met

## 🔄 Recent Changes

### v2.0 Migration Note
- **CLI Tools Removed**: This version focuses on the React application workshop experience
- **API Simplified**: Switched to Stillriver API - no API keys needed for workshop simplicity
- **Setup Streamlined**: Run `./install.sh` and `npm run dev` to get started immediately

For workshop participants: The setup is now even easier with zero configuration required!

## 📈 Business Impact

### ROI Demonstration

**Time Savings:**
- Customer health reviews: 3 hours → 15 minutes
- Market research: 2 hours → automated
- Communication planning: 30 minutes → real-time

**Risk Reduction:**
- 20% improvement in churn prediction
- Early warning system for at-risk accounts
- Automated competitive intelligence

## 🆘 Support & Resources

### Workshop Support

- **Real-time Help**: Instructor guidance throughout
- **Comprehensive Docs**: Step-by-step guides for each phase  
- **Code Examples**: Working solutions provided
- **Troubleshooting**: Common issues documented with solutions

### Additional Resources

- **Performance Guide**: [Optimization techniques](./workshop/resources/performance.md)
- **API Documentation**: [Complete integration guide](./workshop/resources/api-reference.md)
- **Best Practices**: Modern React and TypeScript patterns

## 📄 License

MIT License - Free for educational and commercial use.

## 🤝 About Stillriver

This workshop is part of the **Document Driven Development Series** by [Stillriver Software Solutions LLC](https://stillriver.io), delivered in partnership with **[ThisDot](https://www.thisdot.co/)**. We specialize in AI-powered development methodologies that accelerate software delivery through specification-driven code generation.

**Ready to experience the future of development?**

```bash
git clone https://github.com/stillrivercode/customer-intelligence.git
cd customer-intelligence
./install.sh
npm run dev
```

---

**🎓 Start Your DDD Journey** - Begin with the [Workshop Guide](./workshop/README.md)