import React, { createContext, useContext, useState, useEffect } from "react";

interface UIContextType {
	animations: boolean;
	setAnimations: (value: boolean) => void;
	compactMode: boolean;
	setCompactMode: (value: boolean) => void;
	blurStrength: number;
	setBlurStrength: (value: number) => void;
	surfaceOpacity: number;
	setSurfaceOpacity: (value: number) => void;
	shadowStrength: number;
	setShadowStrength: (value: number) => void;
	animationSpeed: number;
	setAnimationSpeed: (value: number) => void;
	fontSize: number;
	setFontSize: (value: number) => void;
	fontFamily: string;
	setFontFamily: (value: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
	// Initialize states with localStorage values or defaults
	const [animations, setAnimations] = useState(() => {
		const saved = localStorage.getItem("animations");
		return saved ? JSON.parse(saved) : true;
	});

	const [compactMode, setCompactMode] = useState(() => {
		const saved = localStorage.getItem("compactMode");
		return saved ? JSON.parse(saved) : false;
	});

	const [blurStrength, setBlurStrength] = useState(() => {
		const saved = localStorage.getItem("blurStrength");
		return saved ? Number(saved) : 12;
	});

	const [surfaceOpacity, setSurfaceOpacity] = useState(() => {
		const saved = localStorage.getItem("surfaceOpacity");
		return saved ? Number(saved) : 95;
	});

	const [shadowStrength, setShadowStrength] = useState(() => {
		const saved = localStorage.getItem("shadowStrength");
		return saved ? Number(saved) : 5;
	});

	const [animationSpeed, setAnimationSpeed] = useState(() => {
		const saved = localStorage.getItem("animationSpeed");
		return saved ? Number(saved) : 300;
	});

	const [fontSize, setFontSize] = useState(() => {
		const saved = localStorage.getItem("fontSize");
		return saved ? Number(saved) : 16;
	});

	const [fontFamily, setFontFamily] = useState(() => {
		const saved = localStorage.getItem("fontFamily");
		return saved ? saved : "Inter";
	});

	// Update CSS variables and localStorage when settings change
	useEffect(() => {
		localStorage.setItem("animations", JSON.stringify(animations));
		localStorage.setItem("compactMode", JSON.stringify(compactMode));
		localStorage.setItem("blurStrength", String(blurStrength));
		localStorage.setItem("surfaceOpacity", String(surfaceOpacity));
		localStorage.setItem("shadowStrength", String(shadowStrength));
		localStorage.setItem("animationSpeed", String(animationSpeed));
		localStorage.setItem("fontSize", String(fontSize));
		localStorage.setItem("fontFamily", fontFamily);

		// Update CSS variables
		document.documentElement.style.setProperty(
			"--blur-strength",
			`${blurStrength}px`
		);
		document.documentElement.style.setProperty(
			"--surface-opacity",
			`${surfaceOpacity / 100}`
		);
		document.documentElement.style.setProperty(
			"--shadow-strength",
			`${shadowStrength / 100}`
		);
		document.documentElement.style.setProperty(
			"--animation-speed",
			animations ? `${animationSpeed}ms` : "0ms"
		);
		document.documentElement.style.setProperty(
			"--base-font-size",
			`${fontSize}px`
		);
		document.documentElement.style.setProperty("--font-family", fontFamily);

		// Add or remove compact mode class
		if (compactMode) {
			document.documentElement.classList.add("compact-mode");
		} else {
			document.documentElement.classList.remove("compact-mode");
		}
	}, [
		animations,
		compactMode,
		blurStrength,
		surfaceOpacity,
		shadowStrength,
		animationSpeed,
		fontSize,
		fontFamily,
	]);

	return (
		<UIContext.Provider
			value={{
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
				setFontFamily,
			}}
		>
			{children}
		</UIContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI() {
	const context = useContext(UIContext);
	if (context === undefined) {
		throw new Error("useUI must be used within a UIProvider");
	}
	return context;
}
