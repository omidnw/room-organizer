import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			workbox: {
				globPatterns: [
					"**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}",
					"assets/**/*",
				],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "google-fonts-cache",
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
					{
						urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "google-fonts-webfonts",
							expiration: {
								maxEntries: 30,
								maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
				],
				cleanupOutdatedCaches: true,
				sourcemap: true,
				navigateFallback: "/index.html",
				navigateFallbackDenylist: [/^\/api\//],
				skipWaiting: true,
				clientsClaim: true,
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
			},
			manifest: {
				name: "Room Organizer",
				short_name: "Organizer",
				description: "Manage your room inventory efficiently",
				theme_color: "#2563eb",
				background_color: "#ffffff",
				display: "standalone",
				orientation: "portrait",
				scope: "/",
				start_url: "/",
				icons: [
					{
						src: "assets/room-organizer/images/icons/icon-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "assets/room-organizer/images/icons/icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "assets/room-organizer/images/icons/icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
				shortcuts: [
					{
						name: "Inventory",
						url: "/inventory",
						icons: [{ src: "icons/inventory.png", sizes: "96x96" }],
					},
					{
						name: "Settings",
						url: "/settings",
						icons: [{ src: "icons/settings.png", sizes: "96x96" }],
					},
				],
				categories: ["productivity", "utilities"],
				screenshots: [
					{
						src: "assets/room-organizer/images/screenshots/home.png",
						sizes: "1280x720",
						type: "image/png",
					},
				],
			},
		}),
	],
	build: {
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom", "react-router-dom"],
					ui: ["framer-motion", "lucide-react"],
					db: ["idb", "idb-keyval"],
					charts: ["chart.js", "react-chartjs-2"],
					utils: [
						"date-fns",
						"date-fns-tz",
						"currency-codes",
						"countries-list",
					],
				},
			},
		},
	},
	base: "/room-organizer/",
});
