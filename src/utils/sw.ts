import { registerSW } from "virtual:pwa-register";

export function registerServiceWorker() {
	if ("serviceWorker" in navigator) {
		const updateSW = registerSW({
			onNeedRefresh() {
				// Show update notification to user
				if (confirm("New version available! Update now?")) {
					updateSW(true).catch(console.error);
				}
			},
			onOfflineReady() {
				console.log("App ready to work offline");
			},
			onRegisteredSW(swScriptUrl, registration) {
				// Enable periodic sync if supported
				if (registration && "periodicSync" in registration) {
					try {
						(registration as any).periodicSync.register("sync-data", {
							minInterval: 24 * 60 * 60 * 1000, // 1 day
						});
					} catch (error) {
						console.error("Periodic sync could not be registered:", error);
					}
				}

				// Log successful registration
				console.log("Service Worker registered:", swScriptUrl);
			},
			onRegisterError(error) {
				console.error("Service Worker registration failed:", error);
			},
			immediate: true,
		});

		// Handle offline/online status
		window.addEventListener("online", () => {
			document.dispatchEvent(new CustomEvent("app-online"));
		});

		window.addEventListener("offline", () => {
			document.dispatchEvent(new CustomEvent("app-offline"));
		});
	}
}

// Check if app is installed
export function isAppInstalled(): boolean {
	return (
		window.matchMedia("(display-mode: standalone)").matches ||
		(window.navigator as any).standalone === true
	);
}
