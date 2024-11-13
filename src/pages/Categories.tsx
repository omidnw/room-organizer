import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/ui/Card';
import CategoryFilters from '../components/categories/CategoryFilters';
import CreateCategoryModal from '../components/categories/modals/CreateCategoryModal';
import EditCategoryModal from '../components/categories/modals/EditCategoryModal';
import DeleteCategoryModal from '../components/categories/modals/DeleteCategoryModal';
import { Category, CategoryFormData } from '../types/inventory';
import { categoryOperations, itemOperations } from '../utils/db/operations';
import { useNotification } from '../contexts/NotificationContext';

interface CategoriesProps {
  mode?: 'create' | 'edit' | 'delete';
}

function Categories({ mode }: CategoriesProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showNotification } = useNotification();

  const [categories, setCategories] = useState<Category[]>([]);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedCategories = search 
          ? await categoryOperations.search(search)
          : await categoryOperations.getAll();
        setCategories(loadedCategories);

        // Get item counts for each category
        const counts: Record<string, number> = {};
        for (const category of loadedCategories) {
          const items = await itemOperations.getByCategory(category.id);
          counts[category.id] = items.length;
        }
        setItemCounts(counts);
      } catch (error) {
        console.error('Error loading categories:', error);
        showNotification('error', 'Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [search, showNotification]);

  // Get current category for edit/delete
  const currentCategory = id ? categories.find(cat => cat.id === id) : undefined;

  // Form handlers
  const handleCreate = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const newCategory = await categoryOperations.create(data);
      setCategories(prev => [...prev, newCategory]);
      setItemCounts(prev => ({ ...prev, [newCategory.id]: 0 }));
      navigate('/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      showNotification('error', 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (categoryId: string, data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const updatedCategory = await categoryOperations.update(categoryId, data);
      setCategories(prev => prev.map(cat => cat.id === categoryId ? updatedCategory : cat));
      navigate('/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      showNotification('error', 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await categoryOperations.delete(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setItemCounts(prev => {
        const newCounts = { ...prev };
        delete newCounts[id];
        return newCounts;
      });
      navigate('/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      showNotification('error', 'Failed to delete category');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/items')}
                  className="p-2 rounded-lg hover:bg-surface text-textSecondary hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </motion.button>
                <div>
                  <h2 className="text-2xl font-bold text-textPrimary">Categories</h2>
                  <p className="text-textSecondary">Manage your room categories</p>
                </div>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/categories/new')}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Category
            </motion.button>
          </div>

          {/* Search Filters */}
          <div className="mb-8">
            <CategoryFilters
              search={search}
              onSearchChange={setSearch}
            />
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category.color || 'var(--color-primary)' }}
                      >
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm text-textSecondary">
                        {itemCounts[category.id] || 0} items
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-textPrimary mb-2">
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className="text-textSecondary text-sm mb-4 flex-grow">
                        {category.description}
                      </p>
                    )}

                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => navigate(`/categories/${category.id}/edit`)}
                        className="px-3 py-1 text-sm text-textSecondary hover:text-primary transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => navigate(`/categories/${category.id}/delete`)}
                        className="px-3 py-1 text-sm text-error hover:text-error/80 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {categories.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-textSecondary">
                {search ? 'No categories found matching your search' : 'No categories found'}
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-textSecondary">Loading categories...</p>
            </div>
          )}

          {/* Modals */}
          <CreateCategoryModal
            isOpen={mode === 'create'}
            onSubmit={handleCreate}
            isSubmitting={isSubmitting}
          />

          {currentCategory && (
            <>
              <EditCategoryModal
                isOpen={mode === 'edit'}
                categoryId={id!}
                initialData={currentCategory}
                onSubmit={handleEdit}
                isSubmitting={isSubmitting}
              />

              <DeleteCategoryModal
                isOpen={mode === 'delete'}
                categoryName={currentCategory.name}
                itemCount={itemCounts[currentCategory.id] || 0}
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

export default Categories; 