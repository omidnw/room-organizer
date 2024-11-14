import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark" | "midnight" | "sunset";

interface ThemeContextType {
	currentTheme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
		const savedTheme = localStorage.getItem("theme");
		return (savedTheme as Theme) || "light";
	});

	useEffect(() => {
		// Remove previous theme classes
		document.documentElement.classList.remove(
			"theme-light",
			"theme-dark",
			"theme-midnight",
			"theme-sunset"
		);
		// Add new theme class
		document.documentElement.classList.add(`theme-${currentTheme}`);
		// Save to localStorage
		localStorage.setItem("theme", currentTheme);
	}, [currentTheme]);

	const setTheme = (theme: Theme) => {
		setCurrentTheme(theme);
	};

	return (
		<ThemeContext.Provider value={{ currentTheme, setTheme }}>
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
