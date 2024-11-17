import React from "react";
import Toggle from "../../ui/Toggle";
import { motion } from "framer-motion";
import { useTheme } from "../../../contexts/ThemeContext";
import { useUI } from "../../../contexts/UIContext";
import { RotateCcw, Palette, Settings } from "lucide-react";
import Select from "../../ui/Select";


function AppearanceSection() {
	const { themeConfig } = useTheme();
	const {
		animations,
		setAnimations,
		compactMode,
		setCompactMode,
		blurStrength,
		setBlurStrength,
		surfaceOpacity,
		setSurfaceOpacity,
		shadowStrength,
		setShadowStrength,
		animationSpeed,
		setAnimationSpeed,
		fontSize,
		setFontSize,
		fontFamily,
		setFontFamily
	} = useUI();

	// Reset to theme defaults
	const resetToDefaults = () => {
		const defaults = themeConfig.ui;
		setBlurStrength(defaults.blurStrength);
		setSurfaceOpacity(defaults.surfaceOpacity);
		setShadowStrength(defaults.shadowStrength);
		setAnimationSpeed(defaults.animationSpeed);
		setFontSize(16);
		setFontFamily("Inter");
	};

	return (
		<div className={`space-y-${compactMode ? "6" : "8"}`}>
			<motion.div
				initial={animations ? { opacity: 0, y: 20 } : undefined}
				animate={animations ? { opacity: 1, y: 0 } : undefined}
				transition={{ duration: animationSpeed / 1000 }}
				className="glass-effect p-4 rounded-lg"
			>
				<h3 className="text-lg font-semibold text-textPrimary">Appearance</h3>
				<p className="text-sm text-textSecondary">
					Customize the app's appearance and behavior
				</p>
			</motion.div>

			{/* Visual Effects */}
			<div className={`space-y-${compactMode ? "4" : "6"}`}>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Palette className="w-5 h-5 text-primary" />
						<h4 className="text-md font-medium text-textPrimary">
							Visual Effects
						</h4>
					</div>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={resetToDefaults}
						className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
					>
						<RotateCcw className="w-4 h-4" />
						<span className="text-sm">Reset to Theme Defaults</span>
					</motion.button>
				</div>

				{/* Sliders */}
				<motion.div 
					className={`glass-effect ${compactMode ? "p-4" : "p-6"} rounded-lg space-y-6`}
					initial={animations ? { opacity: 0, y: 20 } : undefined}
					animate={animations ? { opacity: 1, y: 0 } : undefined}
					transition={{ duration: animationSpeed / 1000, delay: 0.1 }}
				>
					{/* Blur Strength */}
					<div className="space-y-2">
						<label className="text-sm text-textSecondary">Blur Strength</label>
						<input
							type="range"
							min="0"
							max="24"
							value={blurStrength}
							onChange={(e) => setBlurStrength(Number(e.target.value))}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-textSecondary">
							<span>None</span>
							<span>Strong</span>
						</div>
					</div>

					{/* Surface Opacity */}
					<div className="space-y-2">
						<label className="text-sm text-textSecondary">
							Surface Opacity
						</label>
						<input
							type="range"
							min="80"
							max="100"
							value={surfaceOpacity}
							onChange={(e) => setSurfaceOpacity(Number(e.target.value))}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-textSecondary">
							<span>More Transparent</span>
							<span>More Solid</span>
						</div>
					</div>

					{/* Shadow Strength */}
					<div className="space-y-2">
						<label className="text-sm text-textSecondary">
							Shadow Strength
						</label>
						<input
							type="range"
							min="0"
							max="20"
							value={shadowStrength}
							onChange={(e) => setShadowStrength(Number(e.target.value))}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-textSecondary">
							<span>None</span>
							<span>Strong</span>
						</div>
					</div>

					{/* Font Size - Disabled */}
					<div className="opacity-50 cursor-not-allowed">
						<Select
							label="Base Font Size"
							value={fontSize.toString()}
							options={[
								{ value: "16", label: "Default (16px)" }
							]}
							disabled
						/>
						<p className="text-xs text-textSecondary mt-1">Font size customization coming in next version</p>
					</div>

					{/* Font Family - Disabled */}
					<div className="opacity-50 cursor-not-allowed">
						<Select
							label="Font Family"
							value="Inter"
							options={[
								{ value: "Inter", label: "Inter (Default)" }
							]}
							disabled
						/>
						<p className="text-xs text-textSecondary mt-1">Font family selection coming in next version</p>
					</div>
				</motion.div>
			</div>

			{/* Animation & Behavior */}
			<div className={`space-y-${compactMode ? "4" : "6"}`}>
				<div className="flex items-center gap-2">
					<Settings className="w-5 h-5 text-primary" />
					<h4 className="text-md font-medium text-textPrimary">
						Animation & Behavior
					</h4>
				</div>

				<motion.div 
					className={`glass-effect ${compactMode ? "p-4" : "p-6"} rounded-lg space-y-6`}
					initial={animations ? { opacity: 0, y: 20 } : undefined}
					animate={animations ? { opacity: 1, y: 0 } : undefined}
					transition={{ duration: animationSpeed / 1000, delay: 0.2 }}
				>
					{/* Animation Speed - only shown if animations are enabled */}
					{animations && (
						<div className="space-y-2">
							<label className="text-sm text-textSecondary">
								Animation Speed
							</label>
							<input
								type="range"
								min="100"
								max="500"
								value={animationSpeed}
								onChange={(e) => setAnimationSpeed(Number(e.target.value))}
								className="w-full"
							/>
							<div className="flex justify-between text-xs text-textSecondary">
								<span>Faster</span>
								<span>Slower</span>
							</div>
						</div>
					)}

					{/* Toggles */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium text-textPrimary">Enable Animations</p>
								<p className="text-sm text-textSecondary">
									Toggle all motion animations
								</p>
							</div>
							<Toggle checked={animations} onChange={setAnimations} />
						</div>

						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium text-textPrimary">Compact Mode</p>
								<p className="text-sm text-textSecondary">
									Reduce spacing and size of elements
								</p>
							</div>
							<Toggle checked={compactMode} onChange={setCompactMode} />
						</div>
					</div>
				</motion.div>
			</div>

			{/* Preview */}
			<motion.div 
				className={`space-y-${compactMode ? "2" : "4"}`}
				initial={animations ? { opacity: 0, y: 20 } : undefined}
				animate={animations ? { opacity: 1, y: 0 } : undefined}
				transition={{ duration: animationSpeed / 1000, delay: 0.3 }}
			>
				<h4 className="text-md font-medium text-textPrimary">Preview</h4>
				<div
					className={`glass-effect ${compactMode ? "p-4" : "p-6"} rounded-lg space-y-4`}
				>
					<div
						className={`glass-effect-strong ${compactMode ? "p-2" : "p-4"} rounded-lg`}
					>
						<h5
							className={`text-textPrimary font-medium ${compactMode ? "text-sm" : "text-base"}`}
							style={{ fontFamily }}
						>
							Strong Glass Effect
						</h5>
						<p
							className={`text-textSecondary ${compactMode ? "text-xs" : "text-sm"}`}
							style={{ fontFamily }}
						>
							With stronger blur and shadow
						</p>
					</div>
					<div className={`glass-effect ${compactMode ? "p-2" : "p-4"} rounded-lg`}>
						<h5
							className={`text-textPrimary font-medium ${compactMode ? "text-sm" : "text-base"}`}
							style={{ fontFamily }}
						>
							Regular Glass Effect
						</h5>
						<p
							className={`text-textSecondary ${compactMode ? "text-xs" : "text-sm"}`}
							style={{ fontFamily }}
						>
							With standard blur and shadow
						</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

export default AppearanceSection;
