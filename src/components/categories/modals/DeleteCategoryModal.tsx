import React from "react";
import Modal from "../../ui/Modal";
import { Category } from "../../../types/inventory";

interface DeleteCategoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	category: Category;
	itemCount: number;
	onConfirm: (id: string) => Promise<void>;
}

function DeleteCategoryModal({
	isOpen,
	onClose,
	category,
	itemCount,
	onConfirm,
}: DeleteCategoryModalProps) {
	const handleDelete = async () => {
		await onConfirm(category.id);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Delete Category">
			<p>Are you sure you want to delete "{category.name}"?</p>
			{itemCount > 0 && (
				<p className="text-red-500 mt-2">
					Warning: This category contains {itemCount} item(s). Deleting it will
					also delete all its items.
				</p>
			)}
			<div className="mt-4 flex justify-end space-x-2">
				<button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
					Cancel
				</button>
				<button
					onClick={handleDelete}
					className="px-4 py-2 bg-red-500 text-white rounded"
				>
					Delete
				</button>
			</div>
		</Modal>
	);
}

export default DeleteCategoryModal;
