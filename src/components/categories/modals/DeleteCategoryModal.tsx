import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from '../../ui/Modal';
import { useNotification } from '../../../contexts/NotificationContext';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  categoryName: string;
  itemCount: number;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

function DeleteCategoryModal({ 
  isOpen, 
  categoryName, 
  itemCount, 
  onConfirm, 
  isSubmitting 
}: DeleteCategoryModalProps) {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleDelete = async () => {
    try {
      await onConfirm();
      showNotification('success', `Category "${categoryName}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting category:', error);
      showNotification('error', `Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => navigate('/categories')}
      title="Delete Category"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-textPrimary">
            Are you sure you want to delete <span className="font-semibold">"{categoryName}"</span>?
          </p>
          {itemCount > 0 && (
            <p className="text-error">
              Warning: This category contains {itemCount} item{itemCount !== 1 ? 's' : ''}. 
              Deleting it will remove the category from these items.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/categories')}
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
            {isSubmitting ? 'Deleting...' : 'Delete Category'}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteCategoryModal; 