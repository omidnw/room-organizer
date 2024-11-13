import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Home from './pages/Home';
import Items from './pages/Inventory';
import Categories from './pages/Categories';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items">
              <Route index element={<Items />} />
              <Route path="new" element={<Items mode="create" />} />
              <Route path=":id/edit" element={<Items mode="edit" />} />
              <Route path=":id/delete" element={<Items mode="delete" />} />
            </Route>
            <Route path="/categories">
              <Route index element={<Categories />} />
              <Route path="new" element={<Categories mode="create" />} />
              <Route path=":id/edit" element={<Categories mode="edit" />} />
              <Route path=":id/delete" element={<Categories mode="delete" />} />
            </Route>
            <Route path="/settings" element={<Settings />} />
            <Route path="/reports" element={<div>Reports Coming Soon</div>} />
            <Route path="/help" element={<div>Help Coming Soon</div>} />
            <Route path="/privacy" element={<div>Privacy Policy Coming Soon</div>} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-screen bg-background">
                <h1 className="text-4xl font-bold text-textPrimary mb-4">404</h1>
                <p className="text-textSecondary mb-8">Page not found</p>
                <a 
                  href="/"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Go Home
                </a>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
