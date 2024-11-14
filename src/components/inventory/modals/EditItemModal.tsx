import React from "react";
import Modal from "../../ui/Modal";
import ItemForm from "../ItemForm";
import { Item, ItemFormData } from "../../../types/inventory";

interface EditItemModalProps {
	isOpen: boolean;
	onClose: () => void;
	item: Item;
	onSubmit: (id: string, data: ItemFormData) => Promise<void>;
	categories: { id: string; name: string }[];
}

function EditItemModal({
	isOpen,
	onClose,
	item,
	onSubmit,
	categories,
}: EditItemModalProps) {
	const handleSubmit = async (data: ItemFormData) => {
		await onSubmit(item.id, data);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Edit Item">
			<ItemForm
				onSubmit={handleSubmit}
				categories={categories}
				initialData={item}
			/>
		</Modal>
	);
}

export default EditItemModal;
