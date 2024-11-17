import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";
import { useUI } from "../../contexts/UIContext";

interface StatBoxProps {
	title: string;
	value: number | string;
	icon: LucideIcon;
	isCurrency?: boolean;
}

function StatBox({ title, value, icon: Icon, isCurrency }: StatBoxProps) {
	const { formatCurrency } = useSettings();
	const { compactMode } = useUI();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`glass-effect-strong ${compactMode ? "p-4" : "p-6"} rounded-lg border border-border`}
		>
			<div className="flex items-center justify-between">
				<div>
					<p
						className={`${compactMode ? "text-xs" : "text-sm"} text-textSecondary`}
					>
						{title}
					</p>
					<p
						className={`${compactMode ? "text-xl" : "text-2xl"} font-semibold text-textPrimary mt-1`}
					>
						{isCurrency ? formatCurrency(Number(value)) : value}
					</p>
				</div>
				<div
					className={`${compactMode ? "w-10 h-10" : "w-12 h-12"} rounded-lg bg-primary/10 flex items-center justify-center`}
				>
					<Icon
						className={`${compactMode ? "w-5 h-5" : "w-6 h-6"} text-primary`}
					/>
				</div>
			</div>
		</motion.div>
	);
}

export default StatBox;
