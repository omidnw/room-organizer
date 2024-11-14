import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../contexts/ThemeContext";
import ThemePreview from "../ThemePreview";

const themes = [
	{
		id: "light",
		name: "Light Theme",
		description: "Clean and professional for daily use",
	},
	{
		id: "dark",
		name: "Dark Theme",
		description: "Modern and sleek dark mode",
	},
	{
		id: "midnight",
		name: "Midnight Theme",
		description: "Deep and rich dark theme",
	},
	{
		id: "sunset",
		name: "Sunset Theme",
		description: "Warm and vibrant colors",
	},
];

function ThemeSection() {
	const { currentTheme, setTheme } = useTheme();

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold text-textPrimary">Theme</h3>
					<p className="text-sm text-textSecondary">
						Choose your preferred theme
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{themes.map((theme) => (
					<motion.button
						key={theme.id}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => setTheme(theme.id)}
						className={`p-4 rounded-lg border transition-all ${
							currentTheme === theme.id
								? "border-primary bg-primary/5"
								: "border-border hover:border-primary"
						}`}
					>
						<ThemePreview theme={theme.id} />
						<div className="mt-4 text-left">
							<h4
								className={`font-medium ${
									currentTheme === theme.id
										? "text-primary"
										: "text-textPrimary"
								}`}
							>
								{theme.name}
							</h4>
							<p className="text-sm text-textSecondary">{theme.description}</p>
						</div>
					</motion.button>
				))}
			</div>
		</div>
	);
}

export default ThemeSection;
