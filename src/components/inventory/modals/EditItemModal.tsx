import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../ui/Modal';
import ItemForm from '../ItemForm';
import { ItemFormData } from '../../../types/inventory';
import { useNotification } from '../../../contexts/NotificationContext';

interface EditItemModalProps {
  isOpen: boolean;
  itemId: string;
  initialData: ItemFormData;
  categories: { id: string; name: string }[];
  onSubmit: (id: string, data: ItemFormData) => Promise<void>;
  isSubmitting: boolean;
}

function EditItemModal({ 
  isOpen, 
  itemId, 
  initialData, 
  categories, 
  onSubmit, 
  isSubmitting 
}: EditItemModalProps) {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (data: ItemFormData) => {
    try {
      await onSubmit(itemId, data);
      showNotification('success', `Item "${data.name}" updated successfully`);
    } catch (error) {
      console.error('Error updating item:', error);
      showNotification('error', `Failed to update item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => navigate('/inventory')}
      title="Edit Item"
    >
      <ItemForm
        onSubmit={handleSubmit}
        initialData={initialData}
        categories={categories}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}

export default EditItemModal; 