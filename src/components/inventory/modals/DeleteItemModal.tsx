import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from '../../ui/Modal';
import { useNotification } from '../../../contexts/NotificationContext';

interface DeleteItemModalProps {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

function DeleteItemModal({ isOpen, itemName, onConfirm, isSubmitting }: DeleteItemModalProps) {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleDelete = async () => {
    try {
      await onConfirm();
      showNotification('success', `Item "${itemName}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting item:', error);
      showNotification('error', `Failed to delete item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => navigate('/inventory')}
      title="Delete Item"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        <p className="text-textPrimary">
          Are you sure you want to delete <span className="font-semibold">"{itemName}"</span>? 
          This action cannot be undone.
        </p>

        <div className="flex items-center justify-end space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 text-textPrimary hover:bg-background rounded-lg transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Deleting...' : 'Delete Item'}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteItemModal; 