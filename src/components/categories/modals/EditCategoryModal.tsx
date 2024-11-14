import React from "react";
import Modal from "../../ui/Modal";
import CategoryForm from "../CategoryForm";
import { Category, CategoryFormData } from "../../../types/inventory";

interface EditCategoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	category: Category;
	onSubmit: (id: string, data: CategoryFormData) => Promise<void>;
}

function EditCategoryModal({
	isOpen,
	onClose,
	category,
	onSubmit,
}: EditCategoryModalProps) {
	const handleSubmit = async (data: CategoryFormData) => {
		await onSubmit(category.id, data);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Edit Category">
			<CategoryForm onSubmit={handleSubmit} initialData={category} />
		</Modal>
	);
}

export default EditCategoryModal;
