import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../ui/Card";

interface HelpSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  relatedLinks?: Array<{
    text: string;
    to: string;
  }>;
}

function HelpSection({ 
  title, 
  description, 
  icon: Icon, 
  children,
  relatedLinks 
}: HelpSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-textPrimary">{title}</h2>
          <p className="text-sm text-textSecondary">{description}</p>
        </div>
      </div>
      <Card className="p-6 space-y-6">
        {children}
        
        {/* Related Links Section */}
        {relatedLinks && relatedLinks.length > 0 && (
          <div className="pt-4 mt-4 border-t border-border">
            <h3 className="text-sm font-medium text-textSecondary mb-2">Related Settings</h3>
            <div className="space-y-2">
              {relatedLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="block text-primary hover:text-primary/80 text-sm"
                >
                  {link.text} →
                </Link>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export default HelpSection; 