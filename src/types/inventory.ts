import { z } from 'zod';

// Category Schemas
export const CategoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().min(1, 'Color is required'),
  parentId: z.string().optional(),
  isFolder: z.boolean().default(false),
});

export const CategorySchema = CategoryFormSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  path: z.array(z.string()),
  level: z.number(),
});

// Item Schemas
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

export const ItemSchema = ItemFormSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Category = z.infer<typeof CategorySchema>;
export type CategoryFormData = z.infer<typeof CategoryFormSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type ItemFormData = z.infer<typeof ItemFormSchema>; 