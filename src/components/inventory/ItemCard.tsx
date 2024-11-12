import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar, DollarSign } from 'lucide-react';
import Card from '../ui/Card';

interface ItemCardProps {
  item: {
    id: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    purchaseDate: string;
    image?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Item Image */}
        <div className="relative h-48 bg-background rounded-t-lg overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <span className="text-primary">No Image</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(item.id)}
              className="p-2 bg-surface/80 backdrop-blur-sm rounded-full text-textPrimary hover:text-primary transition-colors"
            >
              <Edit2 size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(item.id)}
              className="p-2 bg-surface/80 backdrop-blur-sm rounded-full text-textPrimary hover:text-error transition-colors"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>

        {/* Item Details */}
        <div className="p-4 flex-grow">
          <h3 className="text-lg font-semibold text-textPrimary mb-1">{item.name}</h3>
          <p className="text-sm text-textSecondary mb-4">{item.category}</p>
          
          <div className="space-y-2">
            <div className="flex items-center text-textSecondary">
              <DollarSign size={16} className="mr-2" />
              <span>{item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
            </div>
            <div className="flex items-center text-textSecondary">
              <Calendar size={16} className="mr-2" />
              <span>{new Date(item.purchaseDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Item Footer */}
        <div className="px-4 py-3 bg-background border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-textSecondary">Quantity</span>
            <span className="font-medium text-textPrimary">{item.quantity}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ItemCard; 