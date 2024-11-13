import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import Modal from '../../ui/Modal';
import ItemForm from '../ItemForm';
import Select from '../../ui/Select';
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
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotification();

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  // Get the selected category from URL if it exists
  const selectedCategory = searchParams.get('category') || '';

  const handleSubmit = async (data: ItemFormData) => {
    try {
      await onSubmit(data);
      showNotification('success', `Item "${data.name}" created successfully`);
      // Navigate back to the category view if we came from there
      navigate(selectedCategory ? `/items?category=${selectedCategory}` : '/items');
    } catch (error) {
      console.error('Error creating item:', error);
      showNotification('error', `Failed to create item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => navigate(selectedCategory ? `/items?category=${selectedCategory}` : '/items')}
      title="Add New Item"
    >
      <ItemForm
        onSubmit={handleSubmit}
        categories={categories}
        isSubmitting={isSubmitting}
        initialData={{ categoryId: selectedCategory }}
        categorySelect={(props) => (
          <Select
            {...props}
            icon={Package}
            label="Category"
            placeholder="Select a category"
            options={categoryOptions}
            error={props.error}
            required
          />
        )}
      />
    </Modal>
  );
}

export default CreateItemModal; 