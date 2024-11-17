import {
	// Light Theme Icons
	Sun,
	Cloud,
	CloudSun,
	Sparkles,
	Star,
	// Dark Theme Icons
	Moon,
	MoonStar,
	CloudMoon,
	CircleDot,
	Orbit,
	// Midnight Theme Icons
	Stars,
	Infinity,
	Snowflake,
	Flower2,
	Sparkle,
	// Sunset Theme Icons
	Sunset,
	Sunrise,
	CloudSunRain,
	Waves,
	Mountain,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface BackgroundConfig {
	id: string;
	name: string;
	icon: LucideIcon;
	className: string;
	particleCount: number;
	themes: string[];
}

export const backgrounds: BackgroundConfig[] = [
	// Default Icons (Available in all themes)
	{
		id: "sparkles",
		name: "Sparkles",
		icon: Sparkles,
		className: "text-primary",
		particleCount: 50,
		themes: ["light", "dark", "midnight", "sunset"],
	},
	{
		id: "star",
		name: "Stars",
		icon: Star,
		className: "text-primary",
		particleCount: 100,
		themes: ["light", "dark", "midnight", "sunset"],
	},
	{
		id: "waves",
		name: "Waves",
		icon: Waves,
		className: "text-primary",
		particleCount: 30,
		themes: ["light", "dark", "midnight", "sunset"],
	},

	// Light Theme Specific
	{
		id: "sun",
		name: "Sunshine",
		icon: Sun,
		className: "text-primary",
		particleCount: 40,
		themes: ["light"],
	},
	{
		id: "cloud-sun",
		name: "Sunny Clouds",
		icon: CloudSun,
		className: "text-primary",
		particleCount: 35,
		themes: ["light"],
	},
	{
		id: "cloud",
		name: "Clouds",
		icon: Cloud,
		className: "text-primary",
		particleCount: 25,
		themes: ["light"],
	},

	// Dark Theme Specific
	{
		id: "moon",
		name: "Moon",
		icon: Moon,
		className: "text-primary",
		particleCount: 40,
		themes: ["dark"],
	},
	{
		id: "moon-star",
		name: "Moon & Star",
		icon: MoonStar,
		className: "text-primary",
		particleCount: 45,
		themes: ["dark"],
	},
	{
		id: "cloud-moon",
		name: "Night Clouds",
		icon: CloudMoon,
		className: "text-primary",
		particleCount: 35,
		themes: ["dark"],
	},

	// Midnight Theme Specific
	{
		id: "stars-group",
		name: "Star Group",
		icon: Stars,
		className: "text-primary",
		particleCount: 80,
		themes: ["midnight"],
	},
	{
		id: "infinity",
		name: "Infinity",
		icon: Infinity,
		className: "text-primary",
		particleCount: 45,
		themes: ["midnight"],
	},
	{
		id: "sparkle",
		name: "Sparkle",
		icon: Sparkle,
		className: "text-primary",
		particleCount: 60,
		themes: ["midnight"],
	},

	// Sunset Theme Specific
	{
		id: "sunset",
		name: "Sunset",
		icon: Sunset,
		className: "text-primary",
		particleCount: 40,
		themes: ["sunset"],
	},
	{
		id: "sunrise",
		name: "Sunrise",
		icon: Sunrise,
		className: "text-primary",
		particleCount: 40,
		themes: ["sunset"],
	},
	{
		id: "cloud-sun-rain",
		name: "Rainy Day",
		icon: CloudSunRain,
		className: "text-primary",
		particleCount: 50,
		themes: ["sunset"],
	},
];

// Helper function to get available backgrounds for a theme
export const getBackgroundsForTheme = (theme: string) => {
	// Get both theme-specific and default backgrounds
	return backgrounds.filter(
		(bg) => bg.themes.includes(theme) || bg.themes.includes("all")
	);
};

// Helper function to get default background for a theme
export const getDefaultBackgroundForTheme = (theme: string) => {
	const themeBackgrounds = getBackgroundsForTheme(theme);
	return themeBackgrounds[0]?.id || "sparkles";
};
