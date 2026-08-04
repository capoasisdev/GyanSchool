import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import './style.css'
import App from './App.jsx'
import { supabase } from './utils/supabaseClient'

// Fix for Supabase OAuth / Magic Link redirects with HashRouter.
// We import the supabase client first so it synchronously extracts and stores the session from the URL hash.
// Then we rewrite the hash to a clean path (#/learn) so React Router doesn't crash on unmatched routes.
if (window.location.hash && window.location.hash.includes('access_token=')) {
    const rawHash = window.location.hash.substring(1); // removes '#'
    if (!rawHash.startsWith('/')) {
        window.location.hash = '#/learn';
    }
}

const isCapacitorApp = !!window.Capacitor || window.location.search.includes('testApp=true') || window.location.hash.includes('testApp=true');
const Router = isCapacitorApp ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
