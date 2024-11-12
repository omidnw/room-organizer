import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Palette, Bell, Layout } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/ui/Card';
import ThemeSection from '../components/settings/sections/ThemeSection';
import NotificationSection from '../components/settings/sections/NotificationSection';
import AppearanceSection from '../components/settings/sections/AppearanceSection';

type SettingsSection = 'theme' | 'notifications' | 'appearance';

interface SettingsTab {
  id: SettingsSection;
  label: string;
  icon: typeof SettingsIcon;
  description: string;
}

const settingsTabs: SettingsTab[] = [
  {
    id: 'theme',
    label: 'Theme',
    icon: Palette,
    description: 'Customize the look and feel',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Configure notification preferences',
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Layout,
    description: 'Adjust the app layout and animations',
  },
];

function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('theme');
  const [animations, setAnimations] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'theme':
        return <ThemeSection />;
      case 'notifications':
        return <NotificationSection />;
      case 'appearance':
        return (
          <AppearanceSection
            animations={animations}
            setAnimations={setAnimations}
            compactMode={compactMode}
            setCompactMode={setCompactMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow p-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-textPrimary mb-2">Settings</h2>
            <p className="text-textSecondary">Customize your experience</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <Card className="md:col-span-1 h-fit">
              <nav className="p-2">
                {settingsTabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveSection(tab.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      activeSection === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-textSecondary hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">{tab.label}</p>
                      <p className="text-sm opacity-80">{tab.description}</p>
                    </div>
                  </motion.button>
                ))}
              </nav>
            </Card>

            {/* Settings Content */}
            <Card className="md:col-span-3">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                {renderSection()}
              </motion.div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Settings;