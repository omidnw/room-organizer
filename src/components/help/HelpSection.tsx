import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../ui/Card";
import { useUI } from "../../contexts/UIContext";

interface HelpSectionProps {
	title: string;
	description: string;
	icon: LucideIcon;
	children: React.ReactNode;
	relatedLinks?: Array<{
		text: string;
		to: string;
	}>;
}

function HelpSection({
	title,
	description,
	icon: Icon,
	children,
	relatedLinks,
}: HelpSectionProps) {
	const { animations, animationSpeed, compactMode } = useUI();

	return (
		<div className="flex flex-col">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: animationSpeed / 1000 }}
				className={`container-glass space-y-${compactMode ? "6" : "10"}`}
			>
				<motion.div
					initial={animations ? { opacity: 0, y: 20 } : undefined}
					animate={animations ? { opacity: 1, y: 0 } : undefined}
					transition={{ duration: animationSpeed / 1000 }}
					className={`glass-effect ${compactMode ? "p-4" : "p-6"} rounded-lg`}
				>
					<div className="flex items-center justify-between space-x-3">
						<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
							<Icon className="w-5 h-5 text-primary" />
						</div>
						<div className="flex-1">
							<h2
								className={`${compactMode ? "text-lg" : "text-xl"} font-semibold text-textPrimary text-justify`}
							>
								{title}
							</h2>
							<p
								className={`text-textSecondary ${compactMode ? "text-sm" : "text-base"} text-justify`}
							>
								{description}
							</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={animations ? { opacity: 0, y: 20 } : undefined}
					animate={animations ? { opacity: 1, y: 0 } : undefined}
					transition={{ duration: animationSpeed / 1000, delay: 0.1 }}
					className={`glass-effect ${compactMode ? "p-4" : "p-6"} space-y-${compactMode ? "4" : "6"}`}
				>
					{children}

					{/* Related Links Section */}
					{relatedLinks && relatedLinks.length > 0 && (
						<div
							className={`pt-${compactMode ? "3" : "4"} mt-${compactMode ? "3" : "4"} border-t border-border`}
						>
							<h3
								className={`${compactMode ? "text-sm" : "text-base"} font-medium text-textSecondary mb-2`}
							>
								Related Settings
							</h3>
							<div className="space-y-2">
								{relatedLinks.map((link, index) => (
									<motion.div
										key={index}
										initial={animations ? { opacity: 0, x: -10 } : undefined}
										animate={animations ? { opacity: 1, x: 0 } : undefined}
										transition={{
											duration: animationSpeed / 1000,
											delay: 0.1 * (index + 1),
										}}
									>
										<Link
											to={link.to}
											className="block text-primary hover:text-primary/80 text-sm transition-colors"
										>
											{link.text} →
										</Link>
									</motion.div>
								))}
							</div>
						</div>
					)}
				</motion.div>
			</motion.div>
		</div>
	);
}

export default HelpSection;
