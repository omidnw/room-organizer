/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "var(--color-primary)",
				secondary: "var(--color-secondary)",
				background: "var(--color-background)",
				textPrimary: "var(--color-text-primary)",
				textSecondary: "var(--color-text-secondary)",
				white: "var(--color-white)",
			},
		},
	},
	plugins: [],
};
