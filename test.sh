#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Check if Homebrew is installed, install if not
if ! command -v brew &>/dev/null; then
  echo "Homebrew not found. Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
  echo "Homebrew is already installed."
fi

# Install Node.js and npm if not already installed
if ! command -v node &>/dev/null; then
  echo "Node.js not found. Installing Node.js and npm..."
  brew install node
else
  echo "Node.js is already installed."
fi

# Install Yarn
if ! command -v yarn &>/dev/null; then
  echo "Yarn not found. Installing Yarn..."
  brew install yarn
else
  echo "Yarn is already installed."
fi

# Create project directory
# echo "Creating project directory..."
# mkdir -p home-inventory-app
# cd home-inventory-app

# Initialize a new React project with Vite
echo "Initializing new React TypeScript project with Vite..."
yarn create vite . --template react-ts

# Install project dependencies
echo "Installing project dependencies..."
yarn add react-router-dom@latest framer-motion tailwindcss postcss autoprefixer \
  date-fns zod lucide-react @testing-library/react @testing-library/jest-dom \
  jest react-i18next react-hook-form workbox-webpack-plugin @types/jest

# Install development dependencies
echo "Installing development dependencies..."
yarn add -D @types/react @types/react-dom @types/node typescript@latest @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser eslint eslint-plugin-react eslint-plugin-react-hooks \
  prettier eslint-config-prettier eslint-plugin-prettier vite-plugin-pwa ts-node \
  @testing-library/user-event @testing-library/dom ts-jest

# Initialize Tailwind CSS
echo "Initializing Tailwind CSS..."
npx tailwindcss init -p

# Create basic project structure
echo "Creating project structure..."
mkdir -p src/{components,pages,hooks,utils,contexts,styles,types}

# Create a basic index.css with Tailwind directives
echo "Creating index.css with Tailwind directives..."
cat <<EOF >src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# Update vite.config.js to include PWA plugin
echo "Updating vite.config.ts..."
cat <<EOF >vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Home Inventory App',
        short_name: 'Inventory',
        description: 'A home inventory management application',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
EOF

# Initialize Git repository
# echo "Initializing Git repository..."
# git init
# git add .
# git commit -m "Initial commit"

echo "Project setup complete! You can now start developing your Home Inventory App."
echo "To start the development server, run: yarn dev"
