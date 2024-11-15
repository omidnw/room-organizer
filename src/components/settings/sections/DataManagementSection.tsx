import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Upload, AlertCircle, Trash2 } from "lucide-react";
import { dbHelpers } from "../../../utils/db/operations";
import { useNotification } from "../../../contexts/NotificationContext";
import Modal from "../../ui/Modal";

function DataManagementSection() {
	const [isExporting, setIsExporting] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [mergeData, setMergeData] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const { showNotification } = useNotification();

	const handleExport = async () => {
		try {
			setIsExporting(true);
			const data = await dbHelpers.exportData();

			// Create and download file
			const blob = new Blob([JSON.stringify(data, null, 2)], {
				type: "application/json",
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `room-organizer-backup-${new Date().toISOString().split("T")[0]}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			showNotification("success", "Data exported successfully");
		} catch (error) {
			console.error("Export error:", error);
			showNotification("error", "Failed to export data");
		} finally {
			setIsExporting(false);
		}
	};

	const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			setIsImporting(true);
			const reader = new FileReader();

			reader.onload = async (e) => {
				try {
					const data = JSON.parse(e.target?.result as string);
					await dbHelpers.importData(data, { merge: mergeData });
					showNotification(
						"success",
						mergeData
							? "Data merged successfully"
							: "Data imported successfully (previous data removed)"
					);
				} catch (error) {
					console.error("Import error:", error);
					showNotification("error", "Failed to import data");
				} finally {
					setIsImporting(false);
				}
			};

			reader.readAsText(file);
		} catch (error) {
			console.error("Import error:", error);
			showNotification("error", "Failed to read import file");
			setIsImporting(false);
		}
	};

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			const success = await dbHelpers.deleteDatabase();

			if (success) {
				showNotification("success", "Database deleted successfully");
				// Reload the page after a short delay
				setTimeout(() => {
					window.location.reload();
				}, 500);
			} else {
				showNotification("error", "Failed to delete database");
				setIsDeleting(false);
				setShowDeleteModal(false);
			}
		} catch (error) {
			console.error("Delete error:", error);
			showNotification("error", "Failed to delete database");
			setIsDeleting(false);
			setShowDeleteModal(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-textPrimary">
					Data Management
				</h3>
				<p className="text-sm text-textSecondary">
					Backup and restore your data
				</p>
			</div>

			<div className="space-y-4">
				{/* Export Data */}
				<motion.div
					whileHover={{ scale: 1.01 }}
					className="p-4 rounded-lg border border-border bg-surface"
				>
					<div className="flex items-start justify-between">
						<div className="space-y-1">
							<h4 className="font-medium text-textPrimary">Export Data</h4>
							<p className="text-sm text-textSecondary">
								Download a backup of your data
							</p>
						</div>
						<button
							className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={handleExport}
							disabled={isExporting}
						>
							<Download className="w-4 h-4" />
							{isExporting ? "Exporting..." : "Export"}
						</button>
					</div>
				</motion.div>

				{/* Import Data */}
				<motion.div
					whileHover={{ scale: 1.01 }}
					className="p-4 rounded-lg border border-border bg-surface"
				>
					<div className="flex items-start justify-between">
						<div className="space-y-1">
							<h4 className="font-medium text-textPrimary">Import Data</h4>
							<p className="text-sm text-textSecondary">
								Restore data from a backup file
							</p>
							<div className="mt-2">
								<label className="flex items-center space-x-2">
									<input
										type="checkbox"
										checked={mergeData}
										onChange={(e) => setMergeData(e.target.checked)}
										className="rounded border-gray-300 text-primary focus:ring-primary"
									/>
									<span className="text-sm text-textSecondary">
										Merge with existing data
									</span>
								</label>
							</div>
						</div>
						<div>
							<input
								type="file"
								id="import-file"
								accept=".json"
								className="hidden"
								onChange={handleImport}
								disabled={isImporting}
							/>
							<button
								className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
								onClick={() => document.getElementById("import-file")?.click()}
								disabled={isImporting}
							>
								<Upload className="w-4 h-4" />
								{isImporting ? "Importing..." : "Import"}
							</button>
						</div>
					</div>
					{/* Warning */}
					<div className="mt-4">
						<div className="flex items-start space-x-3 p-3 rounded-lg bg-warning/10 border border-warning/20 min-h-[5.5rem]">
							<AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
							<div className="space-y-1 flex-1">
								<p className="text-sm font-medium text-warning">
									{mergeData ? "Merge Mode" : "Replace Mode"}
								</p>
								<p className="text-sm text-warning/90">
									{mergeData
										? "New data will be added while keeping existing records. Items with duplicate IDs will be skipped to prevent conflicts."
										: "This will completely replace your current data. Please ensure you have a backup of your existing data before proceeding."}
								</p>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Delete Database */}
				<motion.div
					whileHover={{ scale: 1.01 }}
					className="p-4 rounded-lg border border-error/20 bg-error/5"
				>
					<div className="flex items-start justify-between">
						<div className="space-y-1">
							<h4 className="font-medium text-error">Delete Database</h4>
							<p className="text-sm text-error/80">
								Permanently delete all data and reset the database
							</p>
						</div>
						<button
							className="flex items-center gap-2 px-4 py-2 rounded-lg bg-error text-white hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={() => setShowDeleteModal(true)}
							disabled={isDeleting}
						>
							<Trash2 className="w-4 h-4" />
							{isDeleting ? "Deleting..." : "Delete All"}
						</button>
					</div>
				</motion.div>
			</div>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				title="Delete Database"
				maxWidth="max-w-md"
			>
				<div className="space-y-4">
					<p className="text-textPrimary">
						Are you absolutely sure you want to delete all data? This action
						cannot be undone. Please make sure to create a backup before
						proceeding to avoid losing your data permanently.
					</p>
					<div className="flex justify-end space-x-3">
						<button
							className="px-4 py-2 rounded-lg bg-surface text-textPrimary hover:bg-surface/90"
							onClick={() => setShowDeleteModal(false)}
						>
							Cancel
						</button>
						<button
							className="px-4 py-2 rounded-lg bg-error text-white hover:bg-error/90"
							onClick={handleDelete}
							disabled={isDeleting}
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default DataManagementSection;
