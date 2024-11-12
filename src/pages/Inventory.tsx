import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ItemCard from '../components/inventory/ItemCard';
import ItemFilters from '../components/inventory/ItemFilters';
import CreateItemModal from '../components/inventory/modals/CreateItemModal';
import EditItemModal from '../components/inventory/modals/EditItemModal';
import DeleteItemModal from '../components/inventory/modals/DeleteItemModal';
import { ItemFormData, Item } from '../types/inventory';
import { itemOperations, categoryOperations } from '../utils/db/operations';

interface InventoryProps {
  mode?: 'create' | 'edit' | 'delete';
}

function Inventory({ mode }: InventoryProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Determine the current mode from the URL if not provided via props
  const currentMode = mode || (location.pathname.includes('/new') ? 'create' : 
    location.pathname.includes('/edit') ? 'edit' : 
    location.pathname.includes('/delete') ? 'delete' : undefined);
  
  // State management
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedItems, loadedCategories] = await Promise.all([
          itemOperations.getAll(),
          categoryOperations.getAll(),
        ]);
        setItems(loadedItems);
        setCategories(loadedCategories);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Get current item for edit/delete
  const currentItem = id ? items.find(item => item.id === id) : undefined;

  // Form handlers
  const handleCreate = async (data: ItemFormData) => {
    setIsSubmitting(true);
    try {
      const newItem = await itemOperations.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setItems(prev => [...prev, newItem]);
      navigate('/inventory');
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (itemId: string, data: ItemFormData) => {
    setIsSubmitting(true);
    try {
      const updatedItem = await itemOperations.update(itemId, data);
      setItems(prev => prev.map(item => item.id === itemId ? updatedItem : item));
      navigate('/inventory');
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await itemOperations.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
      navigate('/inventory');
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || item.categoryId === category;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow p-8 mt-16">
          <div className="flex justify-center items-center h-full">
            <p className="text-textSecondary">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow p-8 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-textPrimary">Inventory</h2>
              <p className="text-textSecondary">Manage your items</p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/inventory/new')}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Item
            </motion.button>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <ItemFilters
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              categories={categories.map(cat => ({
                id: cat.id,
                name: cat.name
              }))}
            />
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ItemCard
                  item={item}
                  onEdit={() => navigate(`/inventory/${item.id}/edit`)}
                  onDelete={() => navigate(`/inventory/${item.id}/delete`)}
                />
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-textSecondary">No items found</p>
            </div>
          )}

          {/* Modals */}
          <CreateItemModal
            isOpen={currentMode === 'create'}
            categories={categories}
            onSubmit={handleCreate}
            isSubmitting={isSubmitting}
          />

          {currentItem && (
            <>
              <EditItemModal
                isOpen={currentMode === 'edit'}
                itemId={id!}
                initialData={currentItem}
                categories={categories}
                onSubmit={handleEdit}
                isSubmitting={isSubmitting}
              />

              <DeleteItemModal
                isOpen={currentMode === 'delete'}
                itemName={currentItem.name}
                onConfirm={handleDelete}
                isSubmitting={isSubmitting}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Inventory; 