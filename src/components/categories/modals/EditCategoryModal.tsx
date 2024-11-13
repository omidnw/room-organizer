import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import Modal from '../../ui/Modal';
import CategoryForm from '../CategoryForm';
import { CategoryFormData } from '../../../types/inventory';
import { useNotification } from '../../../contexts/NotificationContext';

interface EditCategoryModalProps {
  isOpen: boolean;
  categoryId: string;
  initialData: CategoryFormData;
  onSubmit: (id: string, data: CategoryFormData) => Promise<void>;
  isSubmitting: boolean;
}

function EditCategoryModal({ 
  isOpen, 
  categoryId, 
  initialData, 
  onSubmit, 
  isSubmitting 
}: EditCategoryModalProps) {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      await onSubmit(categoryId, data);
      showNotification('success', `Category "${data.name}" updated successfully`);
    } catch (error) {
      console.error('Error updating category:', error);
      showNotification('error', `Failed to update category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => navigate('/categories')}
      title="Edit Category"
    >
      <CategoryForm
        onSubmit={handleSubmit}
        initialData={initialData}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}

export default EditCategoryModal; 