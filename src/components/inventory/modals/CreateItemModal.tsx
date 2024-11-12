import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../ui/Modal';
import ItemForm from '../ItemForm';
import { ItemFormData } from '../../../types/inventory';
import { useNotification } from '../../../contexts/NotificationContext';

interface CreateItemModalProps {
  isOpen: boolean;
  categories: { id: string; name: string }[];
  onSubmit: (data: ItemFormData) => Promise<void>;
  isSubmitting: boolean;
}

function CreateItemModal({ isOpen, categories, onSubmit, isSubmitting }: CreateItemModalProps) {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (data: ItemFormData) => {
    try {
      await onSubmit({
        name: data.name,
        categoryId: data.categoryId,
        quantity: data.quantity,
        price: data.price,
        purchaseDate: data.purchaseDate,
        description: data.description,
        notes: data.notes,
        image: data.image,
      });
      showNotification('success', `Item "${data.name}" created successfully`);
    } catch (error) {
      console.error('Error creating item:', error);
      showNotification('error', `Failed to create item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => navigate('/inventory')}
      title="Add New Item"
    >
      <ItemForm
        onSubmit={handleSubmit}
        categories={categories}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}

export default CreateItemModal; 