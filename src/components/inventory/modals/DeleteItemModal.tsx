import React from "react";
import Modal from "../../ui/Modal";
import { Item } from "../../../types/inventory";

interface DeleteItemModalProps {
	isOpen: boolean;
	onClose: () => void;
	item: Item;
	onConfirm: (id: string) => Promise<void>;
}

function DeleteItemModal({
	isOpen,
	onClose,
	item,
	onConfirm,
}: DeleteItemModalProps) {
	const handleDelete = async () => {
		await onConfirm(item.id);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Delete Item">
			<p>Are you sure you want to delete "{item.name}"?</p>
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

export default DeleteItemModal;
