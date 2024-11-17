import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useUI } from "../../contexts/UIContext";

interface FAQItemProps {
	question: string;
	answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { animations, animationSpeed, compactMode } = useUI();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: animationSpeed / 1000 }}
			className="glass-effect border-b border-border last:border-0"
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`w-full ${compactMode ? "py-4" : "py-6"} flex items-center justify-between text-left`}
			>
				<span
					className={`font-medium text-textPrimary ${compactMode ? "text-sm" : "text-base"} text-justify max-w-[90%]`}
				>
					{question}
				</span>
				<motion.div
					initial={false}
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: animationSpeed / 1000 }}
					className="ml-4"
				>
					<ChevronDown
						className={`${compactMode ? "w-4 h-4" : "w-5 h-5"} text-textSecondary`}
					/>
				</motion.div>
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: animationSpeed / 1000 }}
						className="overflow-hidden"
					>
						<p
							className={`${compactMode ? "px-4 pb-4 text-sm" : "px-6 pb-6 text-base"} text-textSecondary text-justify`}
						>
							{answer}
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

export default FAQItem;
