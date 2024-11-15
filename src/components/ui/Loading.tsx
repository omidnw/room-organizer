import React from "react";
import { motion } from "framer-motion";

interface LoadingProps {
	size?: "small" | "medium" | "large";
	className?: string;
}

function Loading({ size = "medium", className = "" }: LoadingProps) {
	const sizeClasses = {
		small: "w-4 h-4",
		medium: "w-8 h-8",
		large: "w-12 h-12",
	};

	return (
		<div className={`flex flex-col items-center justify-center ${className}`}>
			<motion.div
				className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full`}
				animate={{ rotate: 360 }}
				transition={{
					duration: 1,
					repeat: Infinity,
					ease: "linear",
				}}
			/>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="mt-4 text-textSecondary text-sm"
			>
				Loading...
			</motion.div>
		</div>
	);
}

export default Loading;
