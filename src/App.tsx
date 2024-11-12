import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Inventory from './pages/Inventory';
import Categories from './pages/Categories';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/inventory">
              <Route index element={<Inventory />} />
              <Route path="new" element={<Inventory mode="create" />} />
              <Route path=":id/edit" element={<Inventory mode="edit" />} />
              <Route path=":id/delete" element={<Inventory mode="delete" />} />
            </Route>
            <Route path="/categories">
              <Route index element={<Categories />} />
              <Route path="new" element={<Categories mode="create" />} />
              <Route path=":id/edit" element={<Categories mode="edit" />} />
              <Route path=":id/delete" element={<Categories mode="delete" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
