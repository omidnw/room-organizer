# Room Organizer

A modern web application for organizing and managing your room inventory, built with React, TypeScript, and Vite.

## Features

- **Inventory Management**: Add, edit, and organize items in your room with detailed information like name, category, quantity, and price.
- **Category System**: Create nested categories and subcategories to organize items efficiently.
- **Reports & Analytics**: View category-wise distribution, total inventory value, and item counts through interactive charts.
- **Search & Filter**: Quickly find items using the search functionality and filter by categories.
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices.
- **Theme Customization**: Choose between Light, Dark, Midnight, and Sunset themes.
- **Data Management**: Export/import data for backup and transfer between devices.
- **Localization**: Support for multiple languages and currency formats.

## Deployment

The application is deployed on GitHub Pages at: https://yourusername.github.io/room-organizer/

### Manual Deployment

To deploy the application to GitHub Pages manually:

1. Build the application:
   ```bash
   yarn build
   ```

2. Deploy to GitHub Pages:
   ```bash
   yarn deploy
   ```

### Automatic Deployment

The application automatically deploys to GitHub Pages when changes are pushed to the main branch, using GitHub Actions.

## Tech Stack

- React 18 with TypeScript
- Vite for fast development and building
- Framer Motion for smooth animations
- Chart.js for analytics visualization
- Tailwind CSS for styling
- IndexedDB for local data storage
- i18next for internationalization
- Workbox for PWA capabilities

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/room-organizer.git
   cd room-organizer
   ```

2. Install dependencies using Yarn:

   ```bash
   yarn
   ```

3. Start the development server:

   ```bash
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to view the application.

## Screenshots

### Home Page

![Home Page](./docs/images/Home.png)

### Help Center

![Help Center](./docs/images/HelpCenter.png)

### Item View

![Item View](./docs/images/ItemView.png)

### Reports

![Reports](./docs/images/Reports.png)

### Reports with Details

![Reports with Details](./docs/images/ReportsWithDetails.png)

### Settings

![Settings](./docs/images/Settings.png)
