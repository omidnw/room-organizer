import { registerSW } from "virtual:pwa-register";

export function registerServiceWorker() {
	const updateSW = registerSW({
		onNeedRefresh() {
			// Silent update without user notification
			updateSW(true);
		},
		onOfflineReady() {
			console.log("App ready to work offline");
		},
		immediate: true,
		registerType: "autoUpdate",
		strategies: "injectManifest",
	});
}
