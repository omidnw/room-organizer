import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/ui/Card';
import StatBox from '../components/home/StatBox';
import QuickAction from '../components/home/QuickAction';

function Home() {
  const navigate = useNavigate();
  
  const quickActions = [
    { title: 'Add Item', icon: 'plus', link: '/inventory/new' },
    { title: 'Categories', icon: 'grid', link: '/categories' },
    { title: 'Recent Items', icon: 'clock', link: '/inventory' },
    { title: 'Reports', icon: 'chart', link: '/reports' },
  ];

  const stats = [
    { label: 'Total Items', value: '0' },
    { label: 'Categories', value: '0' },
    { label: 'Total Value', value: '$0' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow p-8 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-textPrimary">Welcome Back</h2>
            <p className="text-textSecondary">Here's an overview of your inventory</p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <StatBox 
                key={stat.label} 
                label={stat.label} 
                value={stat.value} 
              />
            ))}
          </div>

          {/* Quick Actions */}
          <Card title="Quick Actions" className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <QuickAction
                  key={action.title}
                  title={action.title}
                  icon={action.icon}
                  link={action.link}
                />
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity" className="mb-8">
            <div className="text-center py-8 text-textSecondary">
              <p>No recent activity to show</p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home; 