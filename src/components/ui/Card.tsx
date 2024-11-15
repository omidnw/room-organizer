import React from "react";
import { motion } from "framer-motion";

interface CardProps {
	title?: string;
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
	"data-category-id"?: string;
}

function Card({
	children,
	className = "",
	onClick,
	"data-category-id": categoryId,
	...props
}: CardProps) {
	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<section
			className={`bg-surface rounded-xl shadow-lg ${className}`}
			onClick={handleClick}
			data-category-id={categoryId}
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
			{...props}
		>
			{children}
		</section>
	);
}

export default Card;
