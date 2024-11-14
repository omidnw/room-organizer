import { useEffect, useState } from "react";
import { Package, Grid, Clock, BarChart2, Settings } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatBox from "../components/home/StatBox";
import QuickAction from "../components/home/QuickAction";
import RecentInventory from "../components/home/RecentInventory";
import { itemOperations, categoryOperations } from "../utils/db/operations";

function Home() {
	const [stats, setStats] = useState({
		totalItems: 0,
		totalCategories: 0,
		totalValue: 0,
	});

	useEffect(() => {
		const loadStats = async () => {
			try {
				const [items, categories] = await Promise.all([
					itemOperations.getAll(),
					categoryOperations.getAll(),
				]);

				const totalValue = items.reduce(
					(sum, item) => sum + item.price * item.quantity,
					0
				);

				setStats({
					totalItems: items.length,
					totalCategories: categories.length,
					totalValue,
				});
			} catch (error) {
				console.error("Error loading stats:", error);
			}
		};

		loadStats();
	}, []);

	const quickActions = [
		{
			title: "Browse Inventory",
			description: "View and manage your inventory",
			icon: Grid,
			href: "/inventory",
		},
		{
			title: "Recent Items",
			description: "View recently added items",
			icon: Clock,
			href: "/inventory/items",
		},
		{
			title: "Reports",
			description: "View inventory reports",
			icon: BarChart2,
			href: "/reports",
		},
		{
			title: "Settings",
			description: "Configure app settings",
			icon: Settings,
			href: "/settings",
		},
	];

	return (
		<div className="flex flex-col min-h-screen bg-background">
			<Header />
			<main className="flex-grow p-8 mt-16">
				<div className="max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-8"
					>
						<h2 className="text-2xl font-bold text-textPrimary">
							Welcome Back
						</h2>
						<p className="text-textSecondary">
							Here's an overview of your home inventory
						</p>
					</motion.div>

					{/* Stats Grid */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
					>
						<StatBox
							title="Total Items"
							value={stats.totalItems}
							icon={Package}
						/>
						<StatBox
							title="Categories"
							value={stats.totalCategories}
							icon={Grid}
						/>
						<StatBox
							title="Total Value"
							value={stats.totalValue}
							icon={BarChart2}
							isCurrency
						/>
					</motion.div>

					{/* Quick Actions */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="mb-8"
					>
						<h3 className="text-lg font-semibold text-textPrimary mb-4">
							Quick Actions
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{quickActions.map((action, index) => (
								<motion.div
									key={action.title}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 * (index + 1) }}
								>
									<QuickAction
										title={action.title}
										description={action.description}
										icon={action.icon}
										href={action.href}
									/>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Recent Activity */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<h3 className="text-lg font-semibold text-textPrimary mb-4">
							Recent Activity
						</h3>
						<RecentInventory limit={5} />
					</motion.div>
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default Home;
