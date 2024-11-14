// src/App.tsx

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";

function App() {
	return (
		<ThemeProvider>
			<NotificationProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/inventory" element={<Inventory />} />
						<Route path="/inventory/categories" element={<Inventory />}>
							<Route
								path="new"
								element={<Inventory mode="create" type="category" />}
							/>
							<Route path=":id" element={<Inventory />} />
							<Route
								path=":id/edit"
								element={<Inventory mode="edit" type="category" />}
							/>
							<Route
								path=":id/delete"
								element={<Inventory mode="delete" type="category" />}
							/>
						</Route>
						<Route path="/inventory/items" element={<Inventory />}>
							<Route
								path="new"
								element={<Inventory mode="create" type="item" />}
							/>
							<Route path=":id" element={<Inventory />} />
							<Route
								path=":id/edit"
								element={<Inventory mode="edit" type="item" />}
							/>
							<Route
								path=":id/delete"
								element={<Inventory mode="delete" type="item" />}
							/>
						</Route>
						<Route path="/settings" element={<Settings />} />
						<Route path="/reports" element={<div>Reports Coming Soon</div>} />
						<Route path="/help" element={<div>Help Coming Soon</div>} />
						<Route
							path="/privacy"
							element={<div>Privacy Policy Coming Soon</div>}
						/>
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
