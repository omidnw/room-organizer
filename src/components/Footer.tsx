import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUI } from "../contexts/UIContext";

function Footer() {
	const { animations, animationSpeed } = useUI();

	return (
		<motion.footer
			initial={animations ? { y: 100 } : undefined}
			animate={animations ? { y: 0 } : undefined}
			transition={{ duration: animationSpeed / 1000 }}
			className="bg-surface/80 backdrop-blur-[var(--blur-strength)] border-t border-border py-6 mt-auto"
		>
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
					<motion.div
						whileHover={animations ? { scale: 1.02 } : undefined}
						transition={{ duration: animationSpeed / 2000 }}
						className="text-sm text-textSecondary"
					>
						© {new Date().getFullYear()} Room Organizer. All rights reserved.
					</motion.div>
					<div className="flex space-x-6">
						<motion.div
							whileHover={animations ? { y: -2 } : undefined}
							transition={{ duration: animationSpeed / 2000 }}
						>
							<Link
								to="/help"
								className="text-sm text-textSecondary hover:text-primary transition-colors"
							>
								Help
							</Link>
						</motion.div>
						<motion.div
							whileHover={animations ? { y: -2 } : undefined}
							transition={{ duration: animationSpeed / 2000 }}
						>
							<Link
								to="/privacy"
								className="text-sm text-textSecondary hover:text-primary transition-colors"
							>
								Privacy
							</Link>
						</motion.div>
						<motion.div
							whileHover={animations ? { y: -2 } : undefined}
							transition={{ duration: animationSpeed / 2000 }}
						>
							<Link
								to="/settings"
								className="text-sm text-textSecondary hover:text-primary transition-colors"
							>
								Settings
							</Link>
						</motion.div>
						<motion.div
							whileHover={animations ? { y: -2 } : undefined}
							transition={{ duration: animationSpeed / 2000 }}
						>
							<a
								href="https://github.com/omidnw/room-organizer"
								className="text-sm text-textSecondary hover:text-primary transition-colors"
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub Repo
							</a>
						</motion.div>
					</div>
				</div>
			</div>
		</motion.footer>
	);
}

export default Footer;
