// src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";

function App() {
	return (
		<ThemeProvider>
			<NotificationProvider>
				<BrowserRouter basename="/room-organizer">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/inventory" element={<Inventory />} />
						<Route path="/inventory/categories" element={<Inventory />}>
							<Route path="new" element={<Inventory />} />
							<Route path=":id" element={<Inventory />} />
							<Route path=":id/edit" element={<Inventory />} />
							<Route path=":id/delete" element={<Inventory />} />
						</Route>
						<Route path="/inventory/items" element={<Inventory />}>
							<Route path="new" element={<Inventory />} />
							<Route path=":id" element={<Inventory />} />
							<Route path=":id/edit" element={<Inventory />} />
							<Route path=":id/delete" element={<Inventory />} />
						</Route>
						<Route path="/settings" element={<Settings />}>
							<Route index element={<Settings defaultSection="theme" />} />
							<Route
								path="theme"
								element={<Settings defaultSection="theme" />}
							/>
							<Route
								path="notifications"
								element={<Settings defaultSection="notifications" />}
							/>
							<Route
								path="appearance"
								element={<Settings defaultSection="appearance" />}
							/>
							<Route
								path="localization"
								element={<Settings defaultSection="localization" />}
							/>
							<Route path="data" element={<Settings defaultSection="data" />} />
						</Route>
						<Route path="/reports" element={<Reports />} />
						<Route path="/reports/categories" element={<Reports />} />
						<Route path="/reports/categories/:id" element={<Reports />} />
						<Route path="/privacy" element={<Privacy />} />
						<Route path="/help" element={<Help />} />
						<Route
							path="*"
							element={
								<div className="flex flex-col items-center justify-center min-h-screen bg-background">
									<h1 className="text-4xl font-bold text-textPrimary mb-4">
										404
									</h1>
									<p className="text-textSecondary mb-8">Page not found</p>
									<a
										href="/"
										className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
									>
										Go Home
									</a>
								</div>
							}
						/>
					</Routes>
				</BrowserRouter>
			</NotificationProvider>
		</ThemeProvider>
	);
}

export default App;
