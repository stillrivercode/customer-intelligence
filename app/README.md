# Customer Intelligence Dashboard

A React application for the Customer Intelligence Dashboard, built with modern development tools.

## Tech Stack

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and development server
- **Vitest**: Testing framework
- **React Testing Library**: Component testing
- **ESLint**: Code linting

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start on `http://localhost:5173`.

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run coverage
```

### Code Quality

```bash
# Lint code
npm run lint
```

## Project Structure

```
app/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx      # Main dashboard component
│   │   └── Dashboard.test.tsx # Dashboard tests
│   ├── test/
│   │   └── setup.ts           # Test setup configuration
│   ├── App.tsx                # Root app component
│   ├── App.css                # App styles
│   ├── App.test.tsx           # App tests
│   └── main.tsx               # App entry point
├── public/                    # Static assets
├── dist/                      # Build output
├── package.json
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── README.md
```

## Components

### App Component

The root application component that renders the Dashboard.

### Dashboard Component

The main dashboard component with the following features:

- Displays customer intelligence dashboard title
- Shows welcome message
- Contains placeholder stat cards for:
  - Total Customers
  - Active Sessions
  - Conversion Rate
- Responsive design with mobile-friendly layout
- Customizable title prop
- CSS class customization support

## Development Guidelines

- Use TypeScript for all new components
- Write tests for all components using Vitest and React Testing Library
- Follow React best practices with functional components and hooks
- Use CSS modules or styled components for component-specific styling
- Ensure responsive design for mobile devices

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run coverage` - Run tests with coverage report
- `npm run lint` - Lint code with ESLint