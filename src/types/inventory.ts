import { z } from 'zod';

// Category Schema
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  color: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Item Form Schema (for create/update)
export const ItemFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  categoryId: z.string().min(1, 'Category is required'),
  quantity: z.number().min(0, 'Quantity must be 0 or greater'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  description: z.string().optional(),
  notes: z.string().optional(),
  image: z.string().optional(),
});

// Full Item Schema (includes system fields)
export const ItemSchema = ItemFormSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Category = z.infer<typeof CategorySchema>;
export type Item = z.infer<typeof ItemSchema>;
export type ItemFormData = z.infer<typeof ItemFormSchema>; 