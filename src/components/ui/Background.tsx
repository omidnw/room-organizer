import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { backgrounds, getBackgroundsForTheme } from "../../config/backgrounds";
import { useTheme } from "../../contexts/ThemeContext";

interface Particle {
	id: number;
	x: number;
	y: number;
	scale: number;
	rotation: number;
	opacity: number;
}

function Background() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [particles, setParticles] = useState<Particle[]>([]);
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const { currentTheme, backgroundType } = useTheme();

	// Get available backgrounds for current theme
	const availableBackgrounds = getBackgroundsForTheme(currentTheme);
	const background =
		availableBackgrounds.find((bg) => bg.id === backgroundType) ||
		availableBackgrounds[0];

	useEffect(() => {
		if (!containerRef.current || !background) return;

		const container = containerRef.current;
		const { width, height } = container.getBoundingClientRect();

		const newParticles: Particle[] = Array.from({
			length: background.particleCount,
		}).map((_, i) => ({
			id: i,
			x: Math.random() * width,
			y: Math.random() * height,
			scale: Math.random() * 0.5 + 0.5,
			rotation: Math.random() * 360,
			opacity: Math.random() * 0.5 + 0.3,
		}));

		setParticles(newParticles);

		const handleMouseMove = (e: MouseEvent) => {
			const rect = container.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			mouseX.set(x);
			mouseY.set(y);
		};

		container.addEventListener("mousemove", handleMouseMove);
		return () => container.removeEventListener("mousemove", handleMouseMove);
	}, [background?.particleCount, currentTheme, backgroundType]);

	if (!background) return null;

	return (
		<div
			ref={containerRef}
			className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]"
		>
			{particles.map((particle) => (
				<motion.div
					key={particle.id}
					className={`absolute ${background.className}`}
					initial={{
						x: particle.x,
						y: particle.y,
						scale: particle.scale,
						rotate: particle.rotation,
						opacity: particle.opacity,
					}}
					animate={{
						x: [particle.x - 20, particle.x + 20, particle.x],
						y: [particle.y - 20, particle.y + 20, particle.y],
						rotate: [
							particle.rotation,
							particle.rotation + 180,
							particle.rotation + 360,
						],
					}}
					transition={{
						duration: Math.random() * 10 + 10,
						repeat: Infinity,
						ease: "linear",
					}}
					drag
					dragConstraints={containerRef}
					dragElastic={0.2}
					whileHover={{ scale: 1.2 }}
				>
					<background.icon className="w-8 h-8" />
				</motion.div>
			))}
		</div>
	);
}

export default Background;
