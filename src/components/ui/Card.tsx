import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

function Card({ title, children, className = '' }: CardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-xl shadow-lg p-6 ${className}`}
    >
      {title && (
        <h3 className="text-xl font-semibold text-textPrimary mb-4">{title}</h3>
      )}
      {children}
    </motion.section>
  );
}

export default Card; 