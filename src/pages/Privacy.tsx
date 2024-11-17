import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/ui/Card";
import { useUI } from "../contexts/UIContext";

function Privacy() {
	const { compactMode } = useUI();

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className={`flex-grow ${compactMode ? "p-4" : "p-8"} mt-16`}>
				<div
					className={`max-w-4xl mx-auto container-glass ${compactMode ? "space-y-6" : "space-y-10"}`}
				>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={`glass-effect ${compactMode ? "p-4" : "p-6"} rounded-lg`}
					>
						<h1
							className={`${compactMode ? "text-2xl" : "text-3xl"} font-bold text-textPrimary mb-2`}
						>
							Privacy Policy
						</h1>
						<p className="text-textSecondary">
							Last updated: {new Date().toLocaleDateString()}
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<Card
							className={`glass-effect ${compactMode ? "p-4" : "p-6"} space-y-6`}
						>
							<section className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
										<Database className="w-5 h-5 text-primary" />
									</div>
									<h2
										className={`${compactMode ? "text-lg" : "text-xl"} font-semibold text-textPrimary`}
									>
										Data Storage
									</h2>
								</div>
								<p className="text-textSecondary">
									Room Organizer stores all your data locally on your device
									using IndexedDB. We do not collect, transmit, or store any of
									your personal information on external servers.
								</p>
							</section>

							<section className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
										<Lock className="w-5 h-5 text-primary" />
									</div>
									<h2
										className={`${compactMode ? "text-lg" : "text-xl"} font-semibold text-textPrimary`}
									>
										Data Security
									</h2>
								</div>
								<p className="text-textSecondary">
									Your data is securely stored in your browser's local storage.
									We recommend regularly backing up your data using the export
									feature in the settings.
								</p>
							</section>

							<section className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
										<Eye className="w-5 h-5 text-primary" />
									</div>
									<h2
										className={`${compactMode ? "text-lg" : "text-xl"} font-semibold text-textPrimary`}
									>
										Data Access
									</h2>
								</div>
								<p className="text-textSecondary">
									Only you have access to your data. The application runs
									entirely in your browser, and no one else can access your
									inventory information.
								</p>
							</section>

							<section className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
										<Shield className="w-5 h-5 text-primary" />
									</div>
									<h2
										className={`${compactMode ? "text-lg" : "text-xl"} font-semibold text-textPrimary`}
									>
										Your Rights
									</h2>
								</div>
								<p className="text-textSecondary">
									You have complete control over your data. You can export,
									delete, or modify your data at any time through the
									application's settings.
								</p>
							</section>
						</Card>
					</motion.div>
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default Privacy;
