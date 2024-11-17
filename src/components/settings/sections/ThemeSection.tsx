import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../contexts/ThemeContext";
import { useUI } from "../../../contexts/UIContext";
import ThemePreview from "../ThemePreview";
import { getBackgroundsForTheme } from "../../../config/backgrounds";
import { themes } from "../../../config/themes";

function ThemeSection() {
	const { currentTheme, setTheme, backgroundType, setBackgroundType } =
		useTheme();

	const { animations, animationSpeed, compactMode } = useUI();

	// Get backgrounds available for current theme
	const availableBackgrounds = getBackgroundsForTheme(currentTheme);

	return (
		<div className={`space-y-${compactMode ? "6" : "10"}`}>
			{/* Theme Selection */}
			<div className={`space-y-${compactMode ? "4" : "6"}`}>
				<motion.div
					initial={animations ? { opacity: 0, y: 20 } : undefined}
					animate={animations ? { opacity: 1, y: 0 } : undefined}
					transition={{ duration: animationSpeed / 1000 }}
					className="flex items-center justify-between"
				>
					<div>
						<h3
							className={`${compactMode ? "text-lg" : "text-xl"} font-semibold text-theme-primary`}
						>
							Theme
						</h3>
						<p className="text-sm text-textSecondary">
							Choose your preferred theme
						</p>
					</div>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{Object.values(themes).map((theme) => (
						<motion.button
							key={theme.id}
							whileHover={animations ? { scale: 1.02 } : undefined}
							whileTap={animations ? { scale: 0.98 } : undefined}
							onClick={() => setTheme(theme.id)}
							className={`${compactMode ? "p-3" : "p-4"} rounded-lg border transition-theme ${
								currentTheme === theme.id
									? "border-theme-primary bg-theme-surface"
									: "border-theme-border hover:border-theme-primary"
							}`}
						>
							<ThemePreview theme={theme.id} />
							<div className="mt-4 text-left">
								<h4
									className={`font-medium ${
										currentTheme === theme.id
											? "text-theme-primary"
											: "text-textPrimary"
									}`}
								>
									{theme.name}
								</h4>
								<p className="text-sm text-textSecondary">
									{theme.description}
								</p>
							</div>
						</motion.button>
					))}
				</div>
			</div>

			{/* Background Selection */}
			<div className={`space-y-${compactMode ? "4" : "6"}`}>
				<motion.div
					initial={animations ? { opacity: 0, y: 20 } : undefined}
					animate={animations ? { opacity: 1, y: 0 } : undefined}
					transition={{ duration: animationSpeed / 1000 }}
					className="flex items-center justify-between"
				>
					<div>
						<h3
							className={`${compactMode ? "text-lg" : "text-xl"} font-semibold text-theme-primary`}
						>
							Theme Animation
						</h3>
						<p className="text-sm text-textSecondary">
							Choose an animation style that matches your current theme
						</p>
					</div>
				</motion.div>

				<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
					{availableBackgrounds.map((bg) => (
						<motion.button
							key={bg.id}
							whileHover={animations ? { scale: 1.05 } : undefined}
							whileTap={animations ? { scale: 0.95 } : undefined}
							onClick={() => setBackgroundType(bg.id)}
							className={`${compactMode ? "p-4" : "p-6"} rounded-lg border transition-theme ${
								backgroundType === bg.id
									? "border-theme-primary bg-theme-surface"
									: "border-theme-border hover:border-theme-primary"
							}`}
						>
							<div className="flex flex-col items-center space-y-3">
								<div
									className={`w-16 h-16 rounded-lg ${
										backgroundType === bg.id ? "bg-primary/10" : "bg-surface"
									} flex items-center justify-center`}
								>
									<bg.icon
										className={`w-8 h-8 ${
											backgroundType === bg.id
												? "text-primary"
												: "text-textSecondary"
										}`}
									/>
								</div>
								<span
									className={`text-sm font-medium ${
										backgroundType === bg.id
											? "text-primary"
											: "text-textSecondary"
									}`}
								>
									{bg.name}
								</span>
							</div>
						</motion.button>
					))}
				</div>

				{/* Live Preview */}
				<motion.div
					initial={animations ? { opacity: 0, y: 20 } : undefined}
					animate={animations ? { opacity: 1, y: 0 } : undefined}
					transition={{ duration: animationSpeed / 1000 }}
					className={`glass-effect ${compactMode ? "p-4" : "p-6"}`}
				>
					<div className="flex items-center justify-between mb-4">
						<span className="text-sm font-medium text-textSecondary">
							Live Preview
						</span>
					</div>
					<div className="h-40 rounded-lg border border-border relative overflow-hidden bg-background/50">
						<div className="absolute inset-0 flex items-center justify-center">
							{backgroundType && (
								<motion.div
									initial={animations ? { scale: 0.8, opacity: 0 } : undefined}
									animate={
										animations
											? {
													scale: [1, 1.1, 1],
													opacity: [1, 0.8, 1],
												}
											: undefined
									}
									transition={{
										duration: 2,
										repeat: Infinity,
										ease: "easeInOut",
									}}
									className="flex items-center justify-center"
								>
									{React.createElement(
										availableBackgrounds.find((bg) => bg.id === backgroundType)
											?.icon || availableBackgrounds[0].icon,
										{
											className: "w-12 h-12 text-primary",
										}
									)}
								</motion.div>
							)}
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default ThemeSection;
