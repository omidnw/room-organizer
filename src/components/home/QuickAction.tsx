import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useUI } from "../../contexts/UIContext";

interface QuickActionProps {
	title: string;
	description?: string;
	icon: LucideIcon;
	href: string;
}

function QuickAction({
	title,
	description,
	icon: Icon,
	href,
}: QuickActionProps) {
	const { compactMode } = useUI();

	return (
		<Link to={href}>
			<motion.div
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				className={`glass-effect ${compactMode ? "p-4" : "p-6"} rounded-lg border border-border hover:border-primary transition-colors cursor-pointer`}
			>
				<div className="flex flex-col items-center text-center">
					<div
						className={`${compactMode ? "w-10 h-10" : "w-12 h-12"} rounded-lg bg-primary/10 flex items-center justify-center mb-3`}
					>
						<Icon
							className={`${compactMode ? "w-5 h-5" : "w-6 h-6"} text-primary`}
						/>
					</div>
					<p
						className={`${compactMode ? "text-xs" : "text-sm"} font-medium text-textPrimary`}
					>
						{title}
					</p>
					{description && (
						<p
							className={`${compactMode ? "text-[10px]" : "text-xs"} text-textSecondary mt-1`}
						>
							{description}
						</p>
					)}
				</div>
			</motion.div>
		</Link>
	);
}

export default QuickAction;
