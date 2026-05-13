/**
 * Home Page
 * Main landing page component
 */

export const Home = () => {
  return (
    <>
      <section id="center">
        <div>
          <h1>Enterprise React App</h1>
          <p>
            This project has been restructured to follow enterprise-level best practices.
          </p>
          <p className="mt-4 text-gray-600">
            ✅ Proper folder structure
            <br />
            ✅ Centralized API layer (axios)
            <br />
            ✅ Zustand state management
            <br />
            ✅ TypeScript strict mode
            <br />
            ✅ Global error handling
            <br />
            ✅ Environment management
          </p>
        </div>
      </section>

      <section id="next-steps">
        <div id="docs">
          <h2>Documentation</h2>
          <p>Learn more about the architecture</p>
          <ul>
            <li>
              <a href="https://vitejs.dev/" target="_blank" rel="noreferrer">
                Vite Documentation
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noreferrer">
                React Documentation
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <h2>Getting Started</h2>
          <p>Start building your application</p>
          <ul>
            <li>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://tailwindcss.com" target="_blank" rel="noreferrer">
                Tailwind CSS
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
