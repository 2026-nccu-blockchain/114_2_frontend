# Project Structure Documentation

## Overview
This is an enterprise-level React application with TypeScript, built with Vite and Tailwind CSS.

## Directory Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components (Button, Modal, etc.)
│   ├── layout/           # Layout components (Header, Sidebar, etc.)
│   ├── features/         # Feature-specific components
│   └── ErrorBoundary.tsx # Global error boundary
│
├── pages/                # Page/route components
│   └── Home.tsx
│
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useAsync.ts       # Async operations hook
│   └── index.ts          # Exports
│
├── services/             # API service layer
│   ├── api.ts            # Axios configuration
│   ├── auth.api.ts       # Authentication API
│   ├── user.api.ts       # User API
│   └── index.ts          # Exports
│
├── store/                # Zustand state management
│   ├── authStore.ts      # Authentication state
│   ├── uiStore.ts        # UI state
│   └── index.ts          # Exports
│
├── types/                # TypeScript type definitions
│   ├── api.ts            # API response types
│   ├── common.ts         # Common types
│   └── index.ts          # Exports
│
├── utils/                # Utility functions
│   ├── errorHandler.ts   # Error handling
│   ├── timing.ts         # Debounce, throttle, etc.
│   ├── classNames.ts     # CSS class utilities
│   └── index.ts          # Exports
│
├── constants/            # Application constants
│   └── index.ts
│
├── styles/               # Global styles
│   └── index.css         # Tailwind imports and custom styles
│
├── __tests__/            # Test files
│
├── App.tsx               # Root app component
├── main.tsx              # Application entry point
└── vite-env.d.ts         # Vite environment types
```

## Configuration Files

- **.env** - Environment variables (development)
- **.env.example** - Environment variables template
- **.env.production** - Production environment variables
- **vite.config.ts** - Vite configuration with path aliases
- **tsconfig.json** - TypeScript root configuration
- **tsconfig.app.json** - Application TypeScript configuration
- **tsconfig.node.json** - Node environment TypeScript configuration
- **eslint.config.js** - ESLint configuration (strict mode)
- **.prettierrc.json** - Prettier code formatting
- **tailwind.config.ts** - Tailwind CSS configuration
- **postcss.config.js** - PostCSS configuration
- **.gitignore** - Git ignore patterns

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Development

```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check
```

### Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## API Integration

### Using the API Client

```typescript
import { userApi } from '@/services'

// Get user profile
const profile = await userApi.getProfile()

// Get specific user
const user = await userApi.getUser('user-id')

// List users with pagination
const users = await userApi.listUsers(1, 20)
```

### Authentication Example

```typescript
import { useAuth } from '@/hooks'

function LoginComponent() {
  const { login, isLoading, error } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    const success = await login({ email, password })
    if (success) {
      // Redirect to dashboard
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleLogin(email, password)
    }}>
      {error && <p className="text-red-500">{error}</p>}
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

## State Management

Using Zustand for lightweight state management:

```typescript
import { useAuthStore } from '@/store'

function Component() {
  const { user, isAuthenticated, login, logout } = useAuthStore()

  // Use auth state and actions
}
```

## Error Handling

Global error handling is provided through:

1. **Error Boundary** - Catches React rendering errors
2. **API Error Handling** - Centralized in axios interceptors
3. **Utility Functions** - `handleError()`, `getErrorMessage()`

```typescript
import { handleError, getErrorMessage } from '@/utils'

try {
  // Some async operation
} catch (error) {
  const userMessage = getErrorMessage(error)
  // Display to user
}
```

## Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Configured with strict rules
- **Prettier**: Automatic code formatting
- **Path Aliases**: Easy imports with @ prefix

## Development Standards

### Import Paths

Use path aliases for cleaner imports:

```typescript
// ✅ Good
import { useAuth } from '@/hooks'
import { userApi } from '@/services'
import type { IUser } from '@/types'

// ❌ Avoid
import { useAuth } from '../../../hooks'
import { userApi } from '../../../services'
```

### Component Structure

```typescript
/**
 * Component description
 */

import { useState } from 'react'
import { Button } from '@/components/common'

interface Props {
  // Component props
}

export const MyComponent = ({ prop }: Props) => {
  // Component logic
  return <div>JSX</div>
}
```

### API Service Pattern

```typescript
// src/services/example.api.ts
import { apiClient } from './api'
import type { ApiResponse } from '@/types'

export const exampleApi = {
  getExample: async () => {
    const response = await apiClient.get<ApiResponse<ExampleType>>('/example')
    return response.data
  },
}
```

## Environment Variables

Create `.env` file from `.env.example`:

```
VITE_API_URL=https://example.com
VITE_APP_NAME=Platform
VITE_LOG_LEVEL=debug
VITE_ENABLE_MONITORING=false
```

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## Next Steps

1. ✅ Project structure and configuration complete
2. ⬜ Add unit tests with Vitest
3. ⬜ Implement Git hooks with husky
4. ⬜ Set up CI/CD with GitHub Actions
5. ⬜ Add E2E tests with Cypress
6. ⬜ Implement authentication pages
7. ⬜ Add component library documentation

## Contributing

Please follow the established code structure and TypeScript patterns. Run linter and type check before committing.

```bash
npm run lint:fix
npm run type-check
```

## License

Private project

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
