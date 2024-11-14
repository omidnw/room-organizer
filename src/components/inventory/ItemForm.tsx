import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemFormSchema, ItemFormData } from "../../types/inventory";
import { useSettings } from "../../hooks/useSettings";

interface ItemFormProps {
	onSubmit: (data: ItemFormData) => Promise<void>;
	initialData?: Partial<ItemFormData>;
	categories: { id: string; name: string }[];
	isSubmitting?: boolean;
	categorySelect?: (props: {
		value: string;
		onChange: (value: string) => void;
		error?: string;
	}) => React.ReactNode;
}

function ItemForm({
	onSubmit,
	initialData,
	categories,
	isSubmitting,
	categorySelect,
}: ItemFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm<ItemFormData>({
		resolver: zodResolver(ItemFormSchema),
		defaultValues: {
			...initialData,
			purchaseDate:
				initialData?.purchaseDate || new Date().toISOString().split("T")[0],
		},
	});

	const categoryId = watch("categoryId");
	const { currency } = useSettings();

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* Name */}
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-textPrimary mb-1"
				>
					Name
				</label>
				<input
					type="text"
					id="name"
					{...register("name")}
					className="w-full px-4 py-2 bg-background border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors"
				/>
				{errors.name && (
					<p className="mt-1 text-sm text-error">{errors.name.message}</p>
				)}
			</div>

			{/* Category */}
			<div>
				{categorySelect ? (
					categorySelect({
						value: categoryId,
						onChange: (value) => setValue("categoryId", value),
						error: errors.categoryId?.message,
					})
				) : (
					<>
						<label
							htmlFor="categoryId"
							className="block text-sm font-medium text-textPrimary mb-1"
						>
							Category
						</label>
						<select
							id="categoryId"
							{...register("categoryId")}
							className="w-full px-4 py-2 bg-background border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors"
						>
							<option value="">Select a category</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
						{errors.categoryId && (
							<p className="mt-1 text-sm text-error">
								{errors.categoryId.message}
							</p>
						)}
					</>
				)}
			</div>

			{/* Quantity and Price Row */}
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label
						htmlFor="quantity"
						className="block text-sm font-medium text-textPrimary mb-1"
					>
						Quantity
					</label>
					<input
						type="number"
						id="quantity"
						{...register("quantity", { valueAsNumber: true })}
						className="w-full px-4 py-2 bg-background border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors"
					/>
					{errors.quantity && (
						<p className="mt-1 text-sm text-error">{errors.quantity.message}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="price"
						className="block text-sm font-medium text-textPrimary mb-1"
					>
						Price ({currency})
					</label>
					<div className="relative">
						<input
							type="number"
							id="price"
							step="0.01"
							{...register("price", { valueAsNumber: true })}
							className="w-full pl-8 pr-4 py-2 bg-background border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors"
						/>
						<span className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary">
							{new Intl.NumberFormat(undefined, { style: "currency", currency })
								.format(1)
								.charAt(0)}
						</span>
					</div>
					{errors.price && (
						<p className="mt-1 text-sm text-error">{errors.price.message}</p>
					)}
				</div>
			</div>

			{/* Purchase Date */}
			<div>
				<label
					htmlFor="purchaseDate"
					className="block text-sm font-medium text-textPrimary mb-1"
				>
					Purchase Date
				</label>
				<input
					type="date"
					id="purchaseDate"
					{...register("purchaseDate")}
					className="w-full px-4 py-2 bg-background border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors"
				/>
				{errors.purchaseDate && (
					<p className="mt-1 text-sm text-error">
						{errors.purchaseDate.message}
					</p>
				)}
			</div>

			{/* Description */}
			<div>
				<label
					htmlFor="description"
					className="block text-sm font-medium text-textPrimary mb-1"
				>
					Description
				</label>
				<textarea
					id="description"
					{...register("description")}
					rows={3}
					className="w-full px-4 py-2 bg-background border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors"
				/>
			</div>

			{/* Notes */}
			<div>
				<label
					htmlFor="notes"
					className="block text-sm font-medium text-textPrimary mb-1"
				>
					Notes
				</label>
				<textarea
					id="notes"
					{...register("notes")}
					rows={2}
					className="w-full px-4 py-2 bg-background border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors"
				/>
			</div>

			{/* Submit Button */}
			<div className="flex justify-end">
				<button
					type="submit"
					disabled={isSubmitting}
					className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
				>
					{isSubmitting ? "Saving..." : "Save Item"}
				</button>
			</div>
		</form>
	);
}

export default ItemForm;
