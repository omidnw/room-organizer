import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	maxWidth?: string;
}

function Modal({
	isOpen,
	onClose,
	title,
	children,
	maxWidth = "max-w-2xl",
}: ModalProps) {
	// Handle escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
					/>

					{/* Modal Container */}
					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4">
							{/* Modal Content */}
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 20 }}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 30,
								}}
								className={`${maxWidth} w-full relative mx-auto bg-surface rounded-lg shadow-xl`}
								style={{ backgroundColor: "var(--color-surface)" }}
							>
								{/* Header */}
								<div className="flex items-center justify-between p-6 border-b border-border">
									<h2 className="text-xl font-semibold text-textPrimary">
										{title}
									</h2>
									<button
										onClick={onClose}
										className="p-2 rounded-lg hover:bg-background text-textSecondary hover:text-primary transition-colors"
										aria-label="Close modal"
									>
										<X size={20} />
									</button>
								</div>

								{/* Content */}
								<div className="p-6">{children}</div>
							</motion.div>
						</div>
					</div>
				</div>
			)}
		</AnimatePresence>
	);
}

export default Modal;
