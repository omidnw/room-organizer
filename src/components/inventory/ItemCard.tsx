import React from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, Package } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";
import { useUI } from "../../contexts/UIContext";
import Card from "../ui/Card";

interface ItemCardProps {
	item: {
		id: string;
		name: string;
		description?: string;
		quantity: number;
		price: number;
		purchaseDate: string;
	};
	onEdit: () => void;
	onDelete: () => void;
}

function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
	const { formatCurrency } = useSettings();
	const { compactMode } = useUI();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`glass-effect-strong ${compactMode ? "p-4" : "p-6"} rounded-lg border border-border h-full`}
		>
			<div className="flex flex-col h-full">
				<div className="flex justify-between items-start mb-4">
					<div className="flex items-center">
						<div
							className={`${compactMode ? "w-10 h-10" : "w-12 h-12"} rounded-lg bg-primary/10 flex items-center justify-center mr-3`}
						>
							<Package
								className={`${compactMode ? "w-5 h-5" : "w-6 h-6"} text-primary`}
							/>
						</div>
						<h3
							className={`${compactMode ? "text-lg" : "text-xl"} font-semibold text-textPrimary`}
						>
							{item.name}
						</h3>
					</div>
					<div className="flex space-x-2">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={onEdit}
							className="p-2 text-textSecondary hover:text-primary transition-colors"
						>
							<Edit2 className="w-4 h-4" />
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={onDelete}
							className="p-2 text-textSecondary hover:text-error transition-colors"
						>
							<Trash2 className="w-4 h-4" />
						</motion.button>
					</div>
				</div>

				<div className="flex-grow space-y-2">
					<div className="flex justify-between">
						<span
							className={`${compactMode ? "text-xs" : "text-sm"} text-textSecondary`}
						>
							Quantity:
						</span>
						<span
							className={`${compactMode ? "text-xs" : "text-sm"} text-textPrimary`}
						>
							{item.quantity}
						</span>
					</div>
					<div className="flex justify-between">
						<span
							className={`${compactMode ? "text-xs" : "text-sm"} text-textSecondary`}
						>
							Price:
						</span>
						<span
							className={`${compactMode ? "text-xs" : "text-sm"} text-textPrimary`}
						>
							{formatCurrency(item.price)}
						</span>
					</div>
					<div className="flex justify-between">
						<span
							className={`${compactMode ? "text-xs" : "text-sm"} text-textSecondary`}
						>
							Total Value:
						</span>
						<span
							className={`${compactMode ? "text-xs" : "text-sm"} text-textPrimary`}
						>
							{formatCurrency(item.price * item.quantity)}
						</span>
					</div>
					<div className="flex justify-between">
						<span
							className={`${compactMode ? "text-xs" : "text-sm"} text-textSecondary`}
						>
							Purchase Date:
						</span>
						<span
							className={`${compactMode ? "text-xs" : "text-sm"} text-textPrimary`}
						>
							{new Date(item.purchaseDate).toLocaleDateString()}
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default ItemCard;
