import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/styles.css'
import App from './App'
import { registerServiceWorker } from './utils/sw'
import { dbHelpers } from './utils/db/operations'
import { runMigrations } from './utils/db/migrations'

// Initialize database and run migrations
Promise.all([
  dbHelpers.initialize(),
  runMigrations(),
])
.then(() => {
  console.log('Database initialized successfully');
})
.catch((error) => {
  console.error('Failed to initialize database:', error);
});

// Register service worker
registerServiceWorker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
