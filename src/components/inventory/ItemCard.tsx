import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import Card from '../ui/Card';

interface ItemCardProps {
  item: {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    price: number;
    purchaseDate: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  const { formatCurrency } = useSettings();

  return (
    <Card className="h-full">
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-textPrimary">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-textSecondary mt-1">{item.description}</p>
            )}
          </div>
        </div>

        <div className="flex-grow space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-textSecondary">Quantity:</span>
            <span className="text-sm text-textPrimary">{item.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-textSecondary">Price:</span>
            <span className="text-sm text-textPrimary">{formatCurrency(item.price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-textSecondary">Total Value:</span>
            <span className="text-sm text-textPrimary">{formatCurrency(item.price * item.quantity)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-textSecondary">Purchase Date:</span>
            <span className="text-sm text-textPrimary">
              {new Date(item.purchaseDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="p-2 text-textSecondary hover:text-primary transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="p-2 text-textSecondary hover:text-error transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </Card>
  );
}

export default ItemCard; 