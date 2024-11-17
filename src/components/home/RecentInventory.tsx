import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Item, Category } from "../../types/inventory";
import { itemOperations, categoryOperations } from "../../utils/db/operations";
import { useSettings } from "../../hooks/useSettings";
import { useUI } from "../../contexts/UIContext";

interface RecentInventoryProps {
	limit?: number;
}

function RecentInventory({ limit = 5 }: RecentInventoryProps) {
	const { compactMode } = useUI();
	const [recentItems, setRecentItems] = useState<Item[]>([]);
	const [recentCategories, setRecentCategories] = useState<Category[]>([]);
	const { formatCurrency } = useSettings();

	useEffect(() => {
		const loadRecentData = async () => {
			try {
				const [items, categories] = await Promise.all([
					itemOperations.getRecent(limit),
					categoryOperations.getRecent(limit),
				]);
				setRecentItems(items);
				setRecentCategories(categories);
			} catch (error) {
				console.error("Error loading recent data:", error);
			}
		};

		loadRecentData();
	}, [limit]);

	if (recentItems.length === 0 && recentCategories.length === 0) {
		return (
			<div className="bg-surface/80 backdrop-blur-sm rounded-lg border border-border p-6">
				<p className="text-textSecondary text-center">
					No recent activity to show
				</p>
			</div>
		);
	}

	return (
		<div className={`space-y-${compactMode ? "4" : "6"}`}>
			{recentItems.length > 0 && (
				<div>
					<div className="flex items-center justify-between mb-4">
						<h4
							className={`${compactMode ? "text-lg" : "text-xl"} font-semibold text-textPrimary`}
						>
							Recent Items
						</h4>
						<div className="h-px flex-grow bg-border/50 ml-4" />
					</div>
					<div className={`space-y-${compactMode ? "1.5" : "2"}`}>
						{recentItems.map((item) => (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className={`glass-effect ${compactMode ? "p-3" : "p-4"} rounded-lg border border-border hover:border-primary transition-colors`}
							>
								<Link to={`/inventory/categories/${item.categoryId}`}>
									<div className="flex items-center justify-between">
										<div>
											<p
												className={`${compactMode ? "text-xs" : "text-sm"} font-medium text-textPrimary`}
											>
												{item.name}
											</p>
											<p
												className={`${compactMode ? "text-[10px]" : "text-xs"} text-textSecondary mt-1`}
											>
												{item.description || "No description"}
											</p>
										</div>
										<div className="flex items-center space-x-4">
											<p
												className={`${compactMode ? "text-xs" : "text-sm"} text-textPrimary`}
											>
												{formatCurrency(item.price * item.quantity)}
											</p>
											<Clock
												className={`${compactMode ? "w-3 h-3" : "w-4 h-4"} text-textSecondary`}
											/>
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			)}

			{recentCategories.length > 0 && (
				<div>
					<div className="flex items-center justify-between mb-4">
						<h4 className="text-xl font-semibold text-textPrimary">
							Recent Categories
						</h4>
						<div className="h-px flex-grow bg-border/50 ml-4" />
					</div>
					<div className="space-y-2">
						{recentCategories.map((category) => (
							<motion.div
								key={category.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="glass-effect p-4 rounded-lg border border-border hover:border-primary transition-colors"
							>
								<Link to={`/inventory/categories/${category.id}`}>
									<div className="flex items-center justify-between">
										<div>
											<div className="flex items-center space-x-2">
												<div
													className="w-3 h-3 rounded-full"
													style={{ backgroundColor: category.color }}
												/>
												<p className="text-sm font-medium text-textPrimary">
													{category.name}
												</p>
											</div>
											<p className="text-xs text-textSecondary mt-1">
												{category.description || "No description"}
											</p>
										</div>
										<Clock className="w-4 h-4 text-textSecondary" />
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default RecentInventory;
