import React from "react";
import { motion } from "framer-motion";
import { Bell, ArrowRight } from "lucide-react";
import { useNotification } from "../../../contexts/NotificationContext";
import { useUI } from "../../../contexts/UIContext";
import type { NotificationPosition } from "../../ui/Notification";

const positions: {
	value: NotificationPosition;
	label: string;
	description: string;
}[] = [
	{
		value: "top-left",
		label: "Top Left",
		description: "Notifications appear in the top left corner",
	},
	{
		value: "top-right",
		label: "Top Right",
		description: "Notifications appear in the top right corner",
	},
	{
		value: "bottom-left",
		label: "Bottom Left",
		description: "Notifications appear in the bottom left corner",
	},
	{
		value: "bottom-right",
		label: "Bottom Right",
		description: "Notifications appear in the bottom right corner",
	},
];

const testNotifications = [
	{ type: "success", message: "This is a success notification" },
	{ type: "error", message: "This is an error notification" },
	{ type: "info", message: "This is an info notification" },
	{ type: "warning", message: "This is a warning notification" },
] as const;

function NotificationSection() {
	const { position, setPosition, showNotification } = useNotification();
	const { animations, animationSpeed, compactMode } = useUI();

	const handlePositionChange = (newPosition: NotificationPosition) => {
		setPosition(newPosition);
		showNotification(
			"success",
			`Notification position updated to ${newPosition}`
		);
	};

	return (
		<div className={`space-y-${compactMode ? "4" : "6"}`}>
			<motion.div
				initial={animations ? { opacity: 0, y: 20 } : undefined}
				animate={animations ? { opacity: 1, y: 0 } : undefined}
				transition={{ duration: animationSpeed / 1000 }}
			>
				<h3 className="text-lg font-semibold text-textPrimary">
					Notifications
				</h3>
				<p className="text-sm text-textSecondary">
					Configure notification settings
				</p>
			</motion.div>

			{/* Position Selection */}
			<motion.div
				initial={animations ? { opacity: 0, y: 20 } : undefined}
				animate={animations ? { opacity: 1, y: 0 } : undefined}
				transition={{ duration: animationSpeed / 1000, delay: 0.1 }}
				className={`glass-effect ${compactMode ? "p-4" : "p-6"} rounded-lg border border-border space-y-4`}
			>
				<h4 className="text-sm font-medium text-textPrimary">Position</h4>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{positions.map(({ value, label, description }) => (
						<motion.button
							key={value}
							whileHover={animations ? { scale: 1.02 } : undefined}
							whileTap={animations ? { scale: 0.98 } : undefined}
							onClick={() => handlePositionChange(value)}
							className={`flex items-center p-4 rounded-lg border transition-all ${
								position === value
									? "border-primary bg-primary/5 text-primary"
									: "border-border text-textSecondary hover:border-primary hover:text-primary hover:bg-primary/5"
							}`}
						>
							<div className="flex-1">
								<p className="font-medium">{label}</p>
								<p className="text-sm opacity-80">{description}</p>
							</div>
							{position === value && (
								<motion.div
									initial={animations ? { scale: 0 } : undefined}
									animate={animations ? { scale: 1 } : undefined}
									className="w-2 h-2 rounded-full bg-primary"
								/>
							)}
						</motion.button>
					))}
				</div>
			</motion.div>

			{/* Test Notifications */}
			<motion.div
				initial={animations ? { opacity: 0, y: 20 } : undefined}
				animate={animations ? { opacity: 1, y: 0 } : undefined}
				transition={{ duration: animationSpeed / 1000, delay: 0.2 }}
				className={`glass-effect ${compactMode ? "p-4" : "p-6"} rounded-lg border border-border space-y-4`}
			>
				<h4 className="text-sm font-medium text-textPrimary">
					Test Notifications
				</h4>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{testNotifications.map(({ type, message }) => (
						<motion.button
							key={type}
							whileHover={animations ? { scale: 1.02 } : undefined}
							whileTap={animations ? { scale: 0.98 } : undefined}
							onClick={() => showNotification(type, message)}
							className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary group transition-all"
						>
							<div className="flex items-center">
								<Bell className="w-5 h-5 mr-3 text-textSecondary group-hover:text-primary transition-colors" />
								<span className="text-textPrimary group-hover:text-primary transition-colors">
									Test {type} notification
								</span>
							</div>
							<ArrowRight className="w-4 h-4 text-textSecondary group-hover:text-primary transition-colors" />
						</motion.button>
					))}
				</div>
			</motion.div>
		</div>
	);
}

export default NotificationSection;
