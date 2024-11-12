import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../ui/Modal';
import CategoryForm from '../CategoryForm';
import { CategoryFormData } from '../../../types/inventory';
import { useNotification } from '../../../contexts/NotificationContext';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isSubmitting: boolean;
}

function CreateCategoryModal({ isOpen, onSubmit, isSubmitting }: CreateCategoryModalProps) {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      await onSubmit(data);
      showNotification('success', `Category "${data.name}" created successfully`);
    } catch (error) {
      console.error('Error creating category:', error);
      showNotification('error', `Failed to create category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => navigate('/categories')}
      title="Add New Category"
    >
      <CategoryForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}

export default CreateCategoryModal; 