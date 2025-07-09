# Migration Guide: CLI Tools to React Application

## Overview

This migration represents a significant architectural shift from a CLI-based workflow template generator to a Customer Intelligence React application.

## What Changed

### Removed Components
- **CLI Tools** (`cli/` directory) - Complete removal of command-line interface tools
- **API Ninjas Integration** - Replaced with Stillriver API proxy service
- **API Key Requirements** - Eliminated authentication requirements

### Added Components
- **React Dashboard** - Basic customer intelligence dashboard
- **TypeScript Support** - Modern type-safe development
- **Stillriver API Integration** - Public proxy service for data access

## Breaking Changes

### 1. CLI Tools Removal
**Impact**: High - Complete removal of CLI functionality

**Before**:
```bash
# CLI tools were available for project management
./cli/index.js create-project
./cli/configuration-manager.js
```

**After**:
```bash
# No CLI tools available - focus on React application
cd app/
npm run dev
```

**Migration Path**:
- CLI functionality is no longer supported
- Users should transition to the React application interface
- Project management now happens through standard npm commands

### 2. API Integration Change
**Impact**: Medium - Different API service with different capabilities

**Before**:
```javascript
// API Ninjas with authentication
const response = await fetch('https://api.api-ninjas.com/v1/whois', {
  headers: {
    'X-Api-Key': process.env.API_NINJAS_KEY
  }
});
```

**After**:
```javascript
// Stillriver API without authentication
const response = await fetch('https://api.stillriver.info/whois?domain=example.com');
```

**Migration Path**:
- Remove API key environment variables
- Update base URLs in application code
- Test endpoints to ensure compatibility

### 3. Environment Configuration
**Impact**: Low - Simplified configuration

**Before**:
```bash
# Required API key setup
VITE_API_NINJAS_KEY=your_key_here
```

**After**:
```bash
# No API key required
# Other environment variables remain unchanged
```

## Migration Steps

### For Existing Users

1. **Backup Current Setup**
   ```bash
   git branch backup-cli-version
   ```

2. **Update Dependencies**
   ```bash
   cd app/
   npm install
   ```

3. **Remove Old Environment Variables**
   - Remove `VITE_API_NINJAS_KEY` from `.env` files
   - Keep other environment variables (OpenRouter, GitHub tokens)

4. **Test New Application**
   ```bash
   npm run dev
   npm run test
   npm run build
   ```

### For New Users

1. **Clone Repository**
   ```bash
   git clone https://github.com/stillrivercode/customer-intelligence.git
   cd customer-intelligence
   ```

2. **Install Dependencies**
   ```bash
   ./install.sh
   ```

3. **Start Development**
   ```bash
   cd app/
   npm run dev
   ```

## Security Considerations

### Removed Security Controls
- **API Key Authentication** - No longer required, reduces credential management
- **Request Signing** - Not available with public proxy service

### New Security Considerations
- **Unverified Proxy Service** - Stillriver API reliability unknown
- **Public API Access** - No authentication barrier for API requests
- **Third-party Dependency** - Reliance on external proxy service

### Recommendations
1. **Implement Client-side Validation** - Validate all API responses
2. **Add Rate Limiting** - Implement additional client-side rate limiting
3. **Monitor API Usage** - Track API calls and errors
4. **Error Handling** - Robust error handling for API failures

## Rollback Plan

If migration issues occur:

1. **Revert to Previous Version**
   ```bash
   git checkout backup-cli-version
   ```

2. **Restore CLI Environment**
   ```bash
   npm install
   # Restore previous .env configuration
   ```

3. **Report Issues**
   - Create GitHub issue with migration problems
   - Contact admin@stillriver.info for API issues

## Support

### Getting Help
- **Documentation**: Check updated README.md and specifications
- **GitHub Issues**: Report migration problems
- **API Support**: Contact admin@stillriver.info for Stillriver API issues

### Known Issues
- **Stillriver API Reliability** - Service availability not guaranteed
- **Missing Functionality** - Some CLI features may not have React equivalents
- **Testing Coverage** - New React components need comprehensive testing

## Timeline

### Immediate (v2.0)
- ✅ CLI tools removed
- ✅ Basic React application available
- ✅ Documentation updated

### Short-term (v2.1)
- 🔄 API integration verification
- 🔄 Comprehensive testing
- 🔄 Error handling improvements

### Long-term (v3.0)
- 📅 Advanced customer intelligence features
- 📅 Performance optimization
- 📅 Production deployment options

---

**Last Updated**: 2025-07-09  
**Migration Support**: Create GitHub issue for assistance