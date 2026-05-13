/**
 * Main App Component
 * Root component with routing and error boundary
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Home } from '@/pages/Home'
import '@/styles/index.css'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<div className="text-center p-8">404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App

