import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";
import { useUI } from "../contexts/UIContext";
import { useTheme } from "../contexts/ThemeContext";

function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { animations, animationSpeed } = useUI();
	const { currentTheme } = useTheme();

	return (
		<>
			<motion.header
				initial={animations ? { y: -100 } : undefined}
				animate={animations ? { y: 0 } : undefined}
				transition={{ duration: animationSpeed / 1000 }}
				className={`fixed top-0 left-0 right-0 h-16 border-b border-border z-30 ${
					isMenuOpen ? "bg-surface" : "bg-surface/80 backdrop-blur-[var(--blur-strength)]"
				}`}
			>
				<div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
					<Link to="/">
						<motion.div
							whileHover={animations ? { scale: 1.05 } : undefined}
							transition={{ duration: animationSpeed / 2000 }}
							className="flex items-center space-x-3"
						>
							<div 
								className={`w-8 h-8 rounded-lg flex items-center justify-center ${
									(currentTheme === 'dark' || currentTheme === 'midnight')
										? 'bg-white' 
										: ''
								}`}
							>
								<img
									src={
										window.location.origin +
										"/room-organizer/assets/room-organizer/images/logo.png"
									}
									alt="Home Organizer Logo"
									className={`w-8 h-8 ${(currentTheme === 'dark' || currentTheme === 'midnight') ? 'invert' : ''}`}
								/>
							</div>
							<div className="flex flex-col">
								<h1 className="text-xl font-bold text-textPrimary leading-tight">
									Room Organizer
								</h1>
								<span className="text-xs text-textSecondary">
									Organize your room items
								</span>
							</div>
						</motion.div>
					</Link>

					<motion.button
						whileHover={animations ? { scale: 1.1 } : undefined}
						whileTap={animations ? { scale: 0.95 } : undefined}
						transition={{ duration: animationSpeed / 2000 }}
						onClick={() => setIsMenuOpen(true)}
						className="p-2 rounded-lg hover:bg-background text-textSecondary hover:text-primary transition-colors"
						aria-label="Open menu"
					>
						<Menu className="w-6 h-6" />
					</motion.button>
				</div>
			</motion.header>

			<HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
		</>
	);
}

export default Header;
