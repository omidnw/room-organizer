import React, { createContext, useContext, useState, useEffect } from "react";
import {
	getThemeConfig,
	getDefaultUISettings,
	getThemeBackground,
} from "../config/themes";
import { ThemeConfig } from "../config/themes";

interface ThemeContextType {
	currentTheme: string;
	setTheme: (theme: string) => void;
	backgroundType: string;
	setBackgroundType: (type: string) => void;
	themeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [currentTheme, setCurrentTheme] = useState(() => {
		const saved = localStorage.getItem("theme");
		return saved || "light";
	});

	const [backgroundType, setBackgroundType] = useState(() => {
		const saved = localStorage.getItem("backgroundType");
		return saved || getThemeBackground(currentTheme);
	});

	const themeConfig = getThemeConfig(currentTheme);

	// Apply theme settings
	useEffect(() => {
		// Save to localStorage
		localStorage.setItem("theme", currentTheme);
		localStorage.setItem("backgroundType", backgroundType);

		// Apply theme class
		document.body.className = `theme-${currentTheme}`;

		// Apply theme colors as CSS variables
		Object.entries(themeConfig.colors).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--color-${key}`, value);
			// Also set RGB values for opacity support
			const rgb = hexToRgb(value);
			if (rgb) {
				document.documentElement.style.setProperty(
					`--color-${key}-rgb`,
					`${rgb.r}, ${rgb.g}, ${rgb.b}`
				);
			}
		});

		// Apply UI settings
		const uiSettings = getDefaultUISettings(currentTheme);
		Object.entries(uiSettings).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--${key}`, `${value}`);
		});
	}, [currentTheme, backgroundType, themeConfig]);

	const handleThemeChange = (theme: string) => {
		setCurrentTheme(theme);
		// Set default background for new theme if needed
		const defaultBackground = getThemeBackground(theme);
		if (defaultBackground !== backgroundType) {
			setBackgroundType(defaultBackground);
		}
	};

	return (
		<ThemeContext.Provider
			value={{
				currentTheme,
				setTheme: handleThemeChange,
				backgroundType,
				setBackgroundType,
				themeConfig,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			}
		: null;
}
