import React from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Package,
  FolderTree,
  Settings,
  BarChart2,
  Palette,
  Bell,
  Layout,
  Globe,
  Database,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HelpSection from "../components/help/HelpSection";
import FAQItem from "../components/help/FAQItem";

function Help() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow p-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-textPrimary mb-2">Help Center</h1>
              <p className="text-textSecondary">
                Find answers to common questions and learn how to use Room Organizer
              </p>
            </div>

            <HelpSection
              title="Getting Started"
              description="Learn the basics of Room Organizer"
              icon={HelpCircle}
              relatedLinks={[
                { text: "Configure your preferences", to: "/settings" },
                { text: "Manage your data", to: "/settings/data" }
              ]}
            >
              <div className="space-y-4">
                <FAQItem
                  question="How do I add items to my inventory?"
                  answer="You can add items by clicking the 'Add Item' button in the inventory page. Fill in the item details such as name, category, quantity, and price."
                />
                <FAQItem
                  question="How do I organize items into categories?"
                  answer="Create categories from the inventory page by clicking 'Add Category'. You can create nested categories for better organization."
                />
                <FAQItem
                  question="Can I backup my data?"
                  answer="Yes, you can export your data from the Settings > Data Management page. This creates a backup file that you can later import if needed."
                />
              </div>
            </HelpSection>

            <HelpSection
              title="Managing Inventory"
              description="Learn about inventory management features"
              icon={Package}
              relatedLinks={[
                { text: "Go to Inventory", to: "/inventory" }
              ]}
            >
              <div className="space-y-4">
                <FAQItem
                  question="How do I edit or delete items?"
                  answer="Each item card has edit and delete buttons. Click edit to modify item details or delete to remove the item from your inventory."
                />
                <FAQItem
                  question="Can I track item prices and quantities?"
                  answer="Yes, you can set both price and quantity for each item. The system will automatically calculate the total value."
                />
              </div>
            </HelpSection>

            <HelpSection
              title="Categories"
              description="Understanding category management"
              icon={FolderTree}
              relatedLinks={[
                { text: "Manage Categories", to: "/inventory/categories" }
              ]}
            >
              <div className="space-y-4">
                <FAQItem
                  question="How do categories work?"
                  answer="Categories help organize your items. You can create main categories and subcategories, forming a tree structure for better organization."
                />
                <FAQItem
                  question="Can I move items between categories?"
                  answer="Yes, you can move items by editing them and selecting a different category from the dropdown menu."
                />
              </div>
            </HelpSection>

            <HelpSection
              title="Reports and Analytics"
              description="Understanding your inventory data"
              icon={BarChart2}
              relatedLinks={[
                { text: "View Reports", to: "/reports" }
              ]}
            >
              <div className="space-y-4">
                <FAQItem
                  question="What reports are available?"
                  answer="You can view category-wise distribution, total inventory value, and item counts through the Reports section."
                />
                <FAQItem
                  question="How do I read the charts?"
                  answer="Charts show the distribution of items across categories and their values. Hover over chart elements to see detailed information."
                />
              </div>
            </HelpSection>

            <HelpSection
              title="Settings and Preferences"
              description="Customizing your experience"
              icon={Settings}
              relatedLinks={[
                { text: "Theme Settings", to: "/settings/theme" },
                { text: "Notification Settings", to: "/settings/notifications" },
                { text: "Appearance Settings", to: "/settings/appearance" },
                { text: "Localization Settings", to: "/settings/localization" },
                { text: "Data Management", to: "/settings/data" }
              ]}
            >
              <div className="space-y-4">
                <FAQItem
                  question="How do I change the theme?"
                  answer="Go to Settings > Theme to choose between different color themes for the application. You can select from Light, Dark, Midnight, or Sunset themes."
                />
                <FAQItem
                  question="Can I customize notifications?"
                  answer="Yes, in Settings > Notifications you can configure notification preferences and positions. Choose where notifications appear and how long they stay visible."
                />
                <FAQItem
                  question="How do I manage my data?"
                  answer="In Settings > Data Management, you can export your data as a backup, import existing data, or reset your database. Make sure to backup regularly to prevent data loss."
                />
                <FAQItem
                  question="Can I change the currency format?"
                  answer="Yes, visit Settings > Localization to configure your timezone and currency preferences. This affects how dates and monetary values are displayed throughout the app."
                />
              </div>
            </HelpSection>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Help; 