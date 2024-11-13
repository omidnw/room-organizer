import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, Settings } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/ui/Card';
import ItemCard from '../components/inventory/ItemCard';
import ItemFilters from '../components/inventory/ItemFilters';
import CreateItemModal from '../components/inventory/modals/CreateItemModal';
import EditItemModal from '../components/inventory/modals/EditItemModal';
import DeleteItemModal from '../components/inventory/modals/DeleteItemModal';
import CreateCategoryModal from '../components/categories/modals/CreateCategoryModal';
import { ItemFormData, Item, Category } from '../types/inventory';
import { itemOperations, categoryOperations } from '../utils/db/operations';
import { useNotification } from '../contexts/NotificationContext';
import { useSettings } from '../hooks/useSettings';

interface InventoryProps {
  mode?: 'create' | 'edit' | 'delete';
}

const ITEMS_PER_PAGE = 10;

function Items({ mode }: InventoryProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotification();
  const { formatCurrency } = useSettings();

  // State management
  const [view, setView] = useState<'categories' | 'items'>('categories');
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [isQuickCategoryModalOpen, setIsQuickCategoryModalOpen] = useState(false);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const loadedCategories = await categoryOperations.getAll();
        setCategories(loadedCategories);

        // Get item counts for each category
        const counts: Record<string, number> = {};
        for (const category of loadedCategories) {
          const items = await itemOperations.getByCategory(category.id);
          counts[category.id] = items.length;
        }
        setItemCounts(counts);

        // If category is specified in URL, select it and show items
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
          setSelectedCategory(categoryFromUrl);
          setView('items');
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        showNotification('error', 'Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [searchParams, showNotification]);

  // Load items when category is selected or search changes
  useEffect(() => {
    if (view === 'items' && selectedCategory) {
      const loadItems = async () => {
        try {
          setIsLoading(true);
          let loadedItems: Item[];

          if (search) {
            // Search within the selected category
            loadedItems = await itemOperations.searchInCategory(selectedCategory, search, {
              page,
              limit: ITEMS_PER_PAGE
            });
          } else {
            // Load items for selected category with pagination
            loadedItems = await itemOperations.getByCategory(selectedCategory, {
              page,
              limit: ITEMS_PER_PAGE
            });
          }

          if (page === 1) {
            setItems(loadedItems);
          } else {
            setItems(prev => [...prev, ...loadedItems]);
          }

          setHasMore(loadedItems.length === ITEMS_PER_PAGE);
        } catch (error) {
          console.error('Error loading items:', error);
          showNotification('error', 'Failed to load items');
        } finally {
          setIsLoading(false);
        }
      };

      loadItems();
    }
  }, [selectedCategory, search, page, view, showNotification]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setView('items');
    setPage(1);
    navigate(`?category=${categoryId}`);
  };

  const handleBackToCategories = () => {
    setView('categories');
    setSelectedCategory('');
    setItems([]);
    setPage(1);
    navigate('/items');
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  // Get current item for edit/delete
  const currentItem = id ? items.find(item => item.id === id) : undefined;

  // Calculate total value
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Form handlers
  const handleCreate = async (data: ItemFormData) => {
    setIsSubmitting(true);
    try {
      const newItem = await itemOperations.create(data);
      setItems(prev => [newItem, ...prev]);
      navigate('/items');
    } catch (error) {
      console.error('Error creating item:', error);
      showNotification('error', 'Failed to create item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (itemId: string, data: ItemFormData) => {
    setIsSubmitting(true);
    try {
      const updatedItem = await itemOperations.update(itemId, data);
      setItems(prev => prev.map(item => item.id === itemId ? updatedItem : item));
      navigate('/items');
    } catch (error) {
      console.error('Error updating item:', error);
      showNotification('error', 'Failed to update item');
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
      navigate('/items');
    } catch (error) {
      console.error('Error deleting item:', error);
      showNotification('error', 'Failed to delete item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset pagination when search changes
    setItems([]); // Clear existing items
  };

  // Add handler for quick category creation
  const handleQuickCategoryCreate = async (data: CategoryFormData) => {
    try {
      const newCategory = await categoryOperations.create(data);
      setCategories(prev => [...prev, newCategory]);
      setItemCounts(prev => ({ ...prev, [newCategory.id]: 0 }));
      showNotification('success', `Category "${data.name}" created successfully`);
      setIsQuickCategoryModalOpen(false);
    } catch (error) {
      console.error('Error creating category:', error);
      showNotification('error', 'Failed to create category');
    }
  };

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
              <div className="flex items-center">
                {view === 'items' && (
                  <button
                    onClick={handleBackToCategories}
                    className="mr-4 text-textSecondary hover:text-primary transition-colors"
                  >
                    ← Back to Categories
                  </button>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-textPrimary">
                    {view === 'categories' ? 'Categories' : 'Items'}
                  </h2>
                  <p className="text-textSecondary">
                    {view === 'categories' 
                      ? 'Select a category to view items'
                      : `Viewing items in ${categories.find(c => c.id === selectedCategory)?.name}`
                    }
                  </p>
                </div>
              </div>
            </motion.div>

            {view === 'items' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/items/new')}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Item
              </motion.button>
            )}
          </div>

          {/* Categories View */}
          {view === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Regular Categories */}
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleCategoryClick(category.id)}
                  className="cursor-pointer"
                >
                  <Card className="h-full hover:border-primary transition-colors">
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
                    </div>
                  </Card>
                </motion.div>
              ))}

              {/* Quick Add Category Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full border-dashed hover:border-primary transition-colors">
                  <div className="p-6 flex flex-col h-full justify-center items-center text-center space-y-4">
                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsQuickCategoryModalOpen(true)}
                        className="p-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Plus className="w-6 h-6" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/categories')}
                        className="p-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Settings className="w-6 h-6" />
                      </motion.button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-textPrimary">
                        Manage Categories
                      </h3>
                      <p className="text-sm text-textSecondary mt-1">
                        Add new or manage existing categories
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Items View */}
          {view === 'items' && (
            <>
              {/* Search */}
              <div className="mb-8">
                <ItemFilters
                  search={search}
                  onSearchChange={handleSearch}
                />
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={() => navigate(`/items/${item.id}/edit`)}
                    onDelete={() => navigate(`/items/${item.id}/delete`)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && !isLoading && items.length > 0 && (
                <div className="flex justify-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLoadMore}
                    className="px-6 py-2 bg-surface border border-border rounded-lg text-textPrimary hover:border-primary transition-colors"
                  >
                    Load More
                  </motion.button>
                </div>
              )}

              {/* Empty State */}
              {items.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-textSecondary">
                    {search 
                      ? 'No items found matching your search in this category'
                      : 'No items found in this category'
                    }
                  </p>
                </div>
              )}

              {/* Loading State for Load More */}
              {isLoading && page > 1 && (
                <div className="text-center mt-8">
                  <p className="text-textSecondary">Loading more items...</p>
                </div>
              )}

              {/* Initial Loading State */}
              {isLoading && page === 1 && (
                <div className="text-center py-12">
                  <p className="text-textSecondary">Loading items...</p>
                </div>
              )}
            </>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-textSecondary">
                Loading {view === 'categories' ? 'categories' : 'items'}...
              </p>
            </div>
          )}

          {/* Modals */}
          <CreateItemModal
            isOpen={mode === 'create'}
            categories={categories}
            onSubmit={handleCreate}
            isSubmitting={isSubmitting}
          />

          {currentItem && (
            <>
              <EditItemModal
                isOpen={mode === 'edit'}
                itemId={id!}
                initialData={currentItem}
                categories={categories}
                onSubmit={handleEdit}
                isSubmitting={isSubmitting}
              />

              <DeleteItemModal
                isOpen={mode === 'delete'}
                itemName={currentItem.name}
                onConfirm={handleDelete}
                isSubmitting={isSubmitting}
              />
            </>
          )}

          {/* Quick Add Category Modal */}
          <CreateCategoryModal
            isOpen={isQuickCategoryModalOpen}
            onSubmit={handleQuickCategoryCreate}
            isSubmitting={isSubmitting}
            onClose={() => setIsQuickCategoryModalOpen(false)}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Items; 