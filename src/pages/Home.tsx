import { useEffect, useState } from "react";
import { Package, Grid, Clock, BarChart2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatBox from "../components/home/StatBox";
import QuickAction from "../components/home/QuickAction";
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
			title: "Browse Categories",
			description: "View and manage your categories",
			icon: Grid,
			href: "/items",
		},
		{
			title: "Add New Item",
			description: "Add a new item to your inventory",
			icon: Package,
			href: "/items/new",
		},
		{
			title: "Recent Items",
			description: "View recently added items",
			icon: Clock,
			href: "/items",
		},
		{
			title: "Reports",
			description: "View inventory reports",
			icon: BarChart2,
			href: "/reports",
		},
	];

	return (
		<div className="flex flex-col min-h-screen bg-background">
			<Header />
			<main className="flex-grow p-8 mt-16">
				<div className="max-w-6xl mx-auto">
					<div className="mb-8">
						<h2 className="text-2xl font-bold text-textPrimary">
							Welcome Back
						</h2>
						<p className="text-textSecondary">
							Here's an overview of your room inventory
						</p>
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
					</div>

					{/* Quick Actions */}
					<div className="mb-8">
						<h3 className="text-lg font-semibold text-textPrimary mb-4">
							Quick Actions
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{quickActions.map((action) => (
								<QuickAction
									key={action.title}
									title={action.title}
									description={action.description}
									icon={action.icon}
									href={action.href}
								/>
							))}
						</div>
					</div>

					{/* Recent Activity */}
					<div>
						<h3 className="text-lg font-semibold text-textPrimary mb-4">
							Recent Activity
						</h3>
						<div className="bg-surface rounded-lg border border-border p-6">
							<p className="text-textSecondary text-center">
								No recent activity to show
							</p>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default Home;
