import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import Modal from '../../ui/Modal';
import ItemForm from '../ItemForm';
import Select from '../../ui/Select';
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
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotification();

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  // Get the current category from URL if it exists
  const currentCategory = searchParams.get('category') || initialData.categoryId;

  const handleSubmit = async (data: ItemFormData) => {
    try {
      await onSubmit(itemId, data);
      showNotification('success', `Item "${data.name}" updated successfully`);
      // Navigate back to the category view if we came from there
      navigate(currentCategory ? `/items?category=${currentCategory}` : '/items');
    } catch (error) {
      console.error('Error updating item:', error);
      showNotification('error', `Failed to update item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => navigate(currentCategory ? `/items?category=${currentCategory}` : '/items')}
      title="Edit Item"
    >
      <ItemForm
        onSubmit={handleSubmit}
        initialData={initialData}
        categories={categories}
        isSubmitting={isSubmitting}
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

export default EditItemModal; 