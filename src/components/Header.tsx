import React from 'react';
import HamburgerMenu from './HamburgerMenu';

function Header() {
  return (
    <header className="bg-primary text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Home Inventory App</h1>
      <HamburgerMenu />
    </header>
  );
}

export default Header; 