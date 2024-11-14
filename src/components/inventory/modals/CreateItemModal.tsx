import React from "react";
import Modal from "../../ui/Modal";
import ItemForm from "../ItemForm";
import { ItemFormData } from "../../../types/inventory";

interface CreateItemModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: ItemFormData) => Promise<void>;
	categories: { id: string; name: string }[];
	currentCategory?: { id: string; name: string } | null;
}

function CreateItemModal({
	isOpen,
	onClose,
	onSubmit,
	categories,
	currentCategory,
}: CreateItemModalProps) {
	const handleSubmit = async (data: ItemFormData) => {
		await onSubmit(data);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Add New Item">
			<ItemForm
				onSubmit={handleSubmit}
				categories={categories}
				initialData={{ categoryId: currentCategory?.id || "" }}
			/>
		</Modal>
	);
}

export default CreateItemModal;
