import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/styles.css'; // Import the new styles

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Welcome to the Home Inventory App
          </h2>
          <p className="text-lg mb-8">
            Manage your home inventory efficiently and effortlessly with our intuitive and user-friendly interface.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary transition">
              Get Started
            </button>
            <button className="bg-white text-primary border border-primary px-6 py-3 rounded-lg shadow-md hover:bg-gray-50 transition">
              Learn More
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home; 