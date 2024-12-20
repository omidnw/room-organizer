import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TwitterPicker } from "react-color";
import { motion } from "framer-motion";
import { CategoryFormData } from "../../types/inventory";
import { useUI } from "../../contexts/UIContext";
import { z } from "zod";

// Category form schema
const CategoryFormSchema = z.object({
	name: z.string().min(1, "Category name is required"),
	description: z.string().optional(),
	color: z.string().min(1, "Color is required"),
	isFolder: z.boolean().default(true),
});

interface CategoryFormProps {
	onSubmit: (data: CategoryFormData) => Promise<void>;
	initialData?: Partial<CategoryFormData>;
	isSubmitting?: boolean;
}

const defaultColors = [
	"#3B82F6", // Blue
	"#10B981", // Green
	"#F59E0B", // Amber
	"#8B5CF6", // Purple
	"#EC4899", // Pink
	"#EF4444", // Red
	"#14B8A6", // Teal
	"#F97316", // Orange
];

function CategoryForm({
	onSubmit,
	initialData,
	isSubmitting,
}: CategoryFormProps) {
	const { animations, animationSpeed, compactMode } = useUI();
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<CategoryFormData>({
		resolver: zodResolver(CategoryFormSchema),
		defaultValues: {
			name: initialData?.name || "",
			description: initialData?.description || "",
			color: initialData?.color || defaultColors[0],
			isFolder: initialData?.isFolder ?? true,
		},
	});

	const currentColor = watch("color");

	const handleColorChange = (color: { hex: string }) => {
		setValue("color", color.hex);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={`space-y-${compactMode ? "4" : "6"}`}
		>
			{/* Name */}
			<motion.div
				initial={animations ? { opacity: 0, y: 20 } : undefined}
				animate={animations ? { opacity: 1, y: 0 } : undefined}
				transition={{ duration: animationSpeed / 1000 }}
			>
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
					className="w-full px-4 py-2 bg-background/50 backdrop-blur-[var(--blur-strength)] border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors"
					placeholder="Enter category name"
				/>
				{errors.name && (
					<p className="mt-1 text-sm text-error">{errors.name.message}</p>
				)}
			</motion.div>

			{/* Description */}
			<motion.div
				initial={animations ? { opacity: 0, y: 20 } : undefined}
				animate={animations ? { opacity: 1, y: 0 } : undefined}
				transition={{ duration: animationSpeed / 1000, delay: 0.1 }}
			>
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
					className="w-full px-4 py-2 bg-background/50 backdrop-blur-[var(--blur-strength)] border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors"
					placeholder="Enter category description (optional)"
				/>
			</motion.div>

			{/* Color Picker */}
			<motion.div
				initial={animations ? { opacity: 0, y: 20 } : undefined}
				animate={animations ? { opacity: 1, y: 0 } : undefined}
				transition={{ duration: animationSpeed / 1000, delay: 0.2 }}
			>
				<label className="block text-sm font-medium text-textPrimary mb-3">
					Color
				</label>
				<div className="space-y-4">
					<div
						className="h-10 rounded-lg border border-border"
						style={{ backgroundColor: currentColor }}
					/>
					<TwitterPicker
						color={currentColor}
						colors={defaultColors}
						onChange={handleColorChange}
						className="!bg-surface !shadow-none"
						styles={{
							default: {
								card: {
									backgroundColor: "var(--color-surface)",
									border: "1px solid var(--color-border)",
									backdropFilter: "blur(var(--blur-strength))",
								},
								input: {
									backgroundColor: "var(--color-background)",
									color: "var(--color-text-primary)",
									border: "1px solid var(--color-border)",
								},
							},
						}}
					/>
				</div>
				{errors.color && (
					<p className="mt-1 text-sm text-error">{errors.color.message}</p>
				)}
			</motion.div>

			{/* Is Folder Checkbox */}
			<motion.div
				initial={animations ? { opacity: 0, y: 20 } : undefined}
				animate={animations ? { opacity: 1, y: 0 } : undefined}
				transition={{ duration: animationSpeed / 1000, delay: 0.3 }}
			>
				<label className="flex items-center">
					<input
						type="checkbox"
						{...register("isFolder")}
						className="form-checkbox h-5 w-5 text-primary"
					/>
					<span className="ml-2 text-sm text-textPrimary">Is Folder</span>
				</label>
			</motion.div>

			{/* Submit Button */}
			<motion.div
				initial={animations ? { opacity: 0, y: 20 } : undefined}
				animate={animations ? { opacity: 1, y: 0 } : undefined}
				transition={{ duration: animationSpeed / 1000, delay: 0.4 }}
				className="flex justify-end"
			>
				<button
					type="submit"
					disabled={isSubmitting}
					className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
				>
					{isSubmitting ? "Saving..." : "Save Category"}
				</button>
			</motion.div>
		</form>
	);
}

export default CategoryForm;
