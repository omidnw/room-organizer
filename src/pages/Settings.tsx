import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Settings as SettingsIcon,
	Palette,
	Bell,
	Layout,
	Globe,
	Database,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/ui/Card";
import ThemeSection from "../components/settings/sections/ThemeSection";
import NotificationSection from "../components/settings/sections/NotificationSection";
import AppearanceSection from "../components/settings/sections/AppearanceSection";
import LocalizationSection from "../components/settings/sections/LocalizationSection";
import DataManagementSection from "../components/settings/sections/DataManagementSection";

type SettingsSection =
	| "theme"
	| "notifications"
	| "appearance"
	| "localization"
	| "data";

interface SettingsProps {
	defaultSection?: SettingsSection;
}

interface SettingsTab {
	id: SettingsSection;
	label: string;
	icon: typeof SettingsIcon;
	description: string;
	path: string;
}

const settingsTabs: SettingsTab[] = [
	{
		id: "theme",
		label: "Theme",
		icon: Palette,
		description: "Customize the look and feel",
		path: "/settings/theme",
	},
	{
		id: "notifications",
		label: "Notifications",
		icon: Bell,
		description: "Configure notification preferences",
		path: "/settings/notifications",
	},
	{
		id: "appearance",
		label: "Appearance",
		icon: Layout,
		description: "Adjust the app layout and animations",
		path: "/settings/appearance",
	},
	{
		id: "localization",
		label: "Localization",
		icon: Globe,
		description: "Configure timezone settings",
		path: "/settings/localization",
	},
	{
		id: "data",
		label: "Data Management",
		icon: Database,
		description: "Backup and restore your data",
		path: "/settings/data",
	},
];

function Settings({ defaultSection = "theme" }: SettingsProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const [activeSection, setActiveSection] =
		useState<SettingsSection>(defaultSection);
	const [animations, setAnimations] = useState(true);
	const [compactMode, setCompactMode] = useState(false);

	// Update active section based on URL
	useEffect(() => {
		const path = location.pathname.split("/").pop() as SettingsSection;
		if (path && settingsTabs.some((tab) => tab.id === path)) {
			setActiveSection(path);
		} else if (location.pathname === "/settings") {
			setActiveSection(defaultSection);
		}
	}, [location, defaultSection]);

	const handleSectionChange = (section: SettingsSection) => {
		setActiveSection(section);
		const tab = settingsTabs.find((t) => t.id === section);
		if (tab) {
			navigate(tab.path);
		}
	};

	const renderSection = () => {
		switch (activeSection) {
			case "theme":
				return <ThemeSection />;
			case "notifications":
				return <NotificationSection />;
			case "appearance":
				return (
					<AppearanceSection
						animations={animations}
						setAnimations={setAnimations}
						compactMode={compactMode}
						setCompactMode={setCompactMode}
					/>
				);
			case "localization":
				return <LocalizationSection />;
			case "data":
				return <DataManagementSection />;
			default:
				return null;
		}
	};

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
						<h2 className="text-3xl font-bold text-textPrimary mb-2">
							Settings
						</h2>
						<p className="text-textSecondary">Customize your experience</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						{/* Settings Navigation */}
						<Card className="md:col-span-1 h-fit">
							<nav className="p-2">
								{settingsTabs.map((tab) => (
									<motion.button
										key={tab.id}
										whileHover={{ x: 4 }}
										onClick={() => handleSectionChange(tab.id)}
										className={`w-full flex items-center p-3 rounded-lg transition-colors ${
											activeSection === tab.id
												? "bg-primary/10 text-primary"
												: "text-textSecondary hover:text-primary hover:bg-primary/5"
										}`}
									>
										<tab.icon className="w-5 h-5 mr-3" />
										<div className="text-left">
											<p className="font-medium">{tab.label}</p>
											<p className="text-sm opacity-80">{tab.description}</p>
										</div>
									</motion.button>
								))}
							</nav>
						</Card>

						{/* Settings Content */}
						<Card className="md:col-span-3">
							<motion.div
								key={activeSection}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="p-6"
							>
								{renderSection()}
							</motion.div>
						</Card>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default Settings;
