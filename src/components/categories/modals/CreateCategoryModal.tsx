import React from "react";
import Modal from "../../ui/Modal";
import CategoryForm from "../CategoryForm";
import { CategoryFormData } from "../../../types/inventory";

interface CreateCategoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: CategoryFormData) => Promise<void>;
	parentCategory?: { id: string; name: string } | null;
}

function CreateCategoryModal({
	isOpen,
	onClose,
	onSubmit,
	parentCategory,
}: CreateCategoryModalProps) {
	const handleSubmit = async (data: CategoryFormData) => {
		await onSubmit({
			...data,
			parentId: parentCategory?.id || undefined,
		});
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Add New Category">
			<CategoryForm onSubmit={handleSubmit} />
		</Modal>
	);
}

export default CreateCategoryModal;
