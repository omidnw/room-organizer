import { backgrounds } from "./backgrounds";

export interface ThemeConfig {
	id: string;
	name: string;
	description: string;
	colors: {
		primary: string;
		secondary: string;
		accent: string;
		background: string;
		surface: string;
		textPrimary: string;
		textSecondary: string;
		border: string;
		error: string;
		success: string;
		warning: string;
	};
	ui: {
		blurStrength: number;
		surfaceOpacity: number;
		shadowStrength: number;
		animationSpeed: number;
	};
	defaultBackground: string;
	availableBackgrounds: string[];
}

export const themes: Record<string, ThemeConfig> = {
	light: {
		id: "light",
		name: "Light Theme",
		description: "Clean and professional for daily use",
		colors: {
			primary: "#007bff",
			secondary: "#28a745",
			accent: "#6c757d",
			background: "#ffffff",
			surface: "#f8f9fa",
			textPrimary: "#212529",
			textSecondary: "#495057",
			border: "#ced4da",
			error: "#dc3545",
			success: "#28a745",
			warning: "#f59e0b",
		},
		ui: {
			blurStrength: 12,
			surfaceOpacity: 95,
			shadowStrength: 5,
			animationSpeed: 300,
		},
		defaultBackground: "sparkles",
		availableBackgrounds: backgrounds
			.filter((bg) => bg.themes.includes("light"))
			.map((bg) => bg.id),
	},

	dark: {
		id: "dark",
		name: "Dark Theme",
		description: "Modern and sleek dark mode",
		colors: {
			primary: "#3b82f6",
			secondary: "#10b981",
			accent: "#60a5fa",
			background: "#111827",
			surface: "#1f2937",
			textPrimary: "#f9fafb",
			textSecondary: "#9ca3af",
			border: "#374151",
			error: "#ef4444",
			success: "#10b981",
			warning: "#f59e0b",
		},
		ui: {
			blurStrength: 16,
			surfaceOpacity: 90,
			shadowStrength: 8,
			animationSpeed: 300,
		},
		defaultBackground: "stars",
		availableBackgrounds: backgrounds
			.filter((bg) => bg.themes.includes("dark"))
			.map((bg) => bg.id),
	},

	midnight: {
		id: "midnight",
		name: "Midnight Theme",
		description: "Deep and rich dark theme",
		colors: {
			primary: "#8b5cf6",
			secondary: "#ec4899",
			accent: "#a78bfa",
			background: "#0f172a",
			surface: "#1e293b",
			textPrimary: "#f8fafc",
			textSecondary: "#94a3b8",
			border: "#334155",
			error: "#ef4444",
			success: "#10b981",
			warning: "#f59e0b",
		},
		ui: {
			blurStrength: 20,
			surfaceOpacity: 85,
			shadowStrength: 10,
			animationSpeed: 400,
		},
		defaultBackground: "infinity",
		availableBackgrounds: backgrounds
			.filter((bg) => bg.themes.includes("midnight"))
			.map((bg) => bg.id),
	},

	sunset: {
		id: "sunset",
		name: "Sunset Theme",
		description: "Warm and vibrant colors",
		colors: {
			primary: "#f59e0b",
			secondary: "#d97706",
			accent: "#fbbf24",
			background: "#fffbeb",
			surface: "#ffffff",
			textPrimary: "#78350f",
			textSecondary: "#92400e",
			border: "#fde68a",
			error: "#dc2626",
			success: "#059669",
			warning: "#f59e0b",
		},
		ui: {
			blurStrength: 14,
			surfaceOpacity: 92,
			shadowStrength: 6,
			animationSpeed: 350,
		},
		defaultBackground: "sunset",
		availableBackgrounds: backgrounds
			.filter((bg) => bg.themes.includes("sunset"))
			.map((bg) => bg.id),
	},
};

// Helper functions
export const getThemeConfig = (themeId: string): ThemeConfig => {
	return themes[themeId] || themes.light;
};

export const getDefaultUISettings = (themeId: string) => {
	return getThemeConfig(themeId).ui;
};

export const getThemeColors = (themeId: string) => {
	return getThemeConfig(themeId).colors;
};

export const getThemeBackground = (themeId: string) => {
	return getThemeConfig(themeId).defaultBackground;
};
