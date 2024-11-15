import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";

function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<>
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className={`fixed top-0 left-0 right-0 h-16 border-b border-border z-30 ${
					isMenuOpen ? "bg-surface" : "bg-surface/80 backdrop-blur-sm"
				}`}
			>
				<div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
					<Link to="/">
						<motion.div
							whileHover={{ scale: 1.05 }}
							className="flex items-center space-x-3"
						>
							<img
								src={
									window.location.origin.includes("github.io")
										? "/room-organizer/assets/home-organizer/images/logo.png"
										: window.location.origin +
											"/assets/home-organizer/images/logo.png"
								}
								alt="Home Organizer Logo"
								className="w-8 h-8"
							/>
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
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
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
