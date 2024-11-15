import { registerSW } from "virtual:pwa-register";

export function registerServiceWorker() {
	const updateSW = registerSW({
		onNeedRefresh() {
			// Automatically update service worker when new version is available
			updateSW(true).catch(console.error);
		},
		onOfflineReady() {
			console.log("App ready to work offline");
		},
		onRegisteredSW(swScriptUrl, registration) {
			// Log successful registration
			console.log('Service Worker registered with:', swScriptUrl);
			
			// Ensure the registration is active
			if (registration && registration.active) {
				console.log('Service Worker is active');
			}
		},
		onRegisterError(error) {
			console.error('Service Worker registration failed:', error);
		},
		immediate: true
	});
}
