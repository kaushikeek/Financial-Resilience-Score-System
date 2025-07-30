import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";

const Settings = () => {
	const [email, setEmail] = useState("");
	const [emailNotifications, setEmailNotifications] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	const [loading, setLoading] = useState(true);

	// Fetch user and settings on mount
	useEffect(() => {
		const fetchSettings = async () => {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();
			if (error || !user) {
				console.error("Error fetching user:", error);
				return;
			}
			setEmail(user.email);

			try {
				const res = await axios.get(`/api/settings/${user.id}`);
				const settings = res.data;
				setEmailNotifications(settings.email_notifications ?? false);
				setDarkMode(settings.dark_mode ?? false);
			} catch (err) {
				console.error("Error fetching settings:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchSettings();
	}, []);

	const handleSave = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		try {
			await axios.put(`/api/settings/${user.id}`, {
				email_notifications: emailNotifications,
				dark_mode: darkMode,
			});
			alert("Settings saved successfully!");
		} catch (err) {
			console.error("Error saving settings:", err);
			alert("Failed to save settings.");
		}
	};

	if (loading) {
		return (
			<MainLayout>
				<div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
					Loading settings...
				</div>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-100 py-12 px-6">
				<h1 className="text-3xl font-bold text-center text-indigo-700 mb-10">
					Account Settings
				</h1>

				<div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-8">
					{/* Account Info */}
					<div>
						<h2 className="text-xl font-semibold text-indigo-600 mb-4">
							Account Information
						</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-gray-600 text-sm mb-1">
									Email
								</label>
								<input
									type="email"
									value={email}
									disabled
									className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100"
								/>
							</div>
						</div>
					</div>

					{/* Preferences */}
					<div>
						<h2 className="text-xl font-semibold text-indigo-600 mb-4">
							Preferences
						</h2>
						<div className="flex items-center justify-between">
							<label className="text-gray-700">
								Enable Email Notifications
							</label>
							<input
								type="checkbox"
								checked={emailNotifications}
								onChange={() => setEmailNotifications(!emailNotifications)}
								className="toggle toggle-md"
							/>
						</div>
						<div className="flex items-center justify-between mt-4">
							<label className="text-gray-700">Dark Mode</label>
							<input
								type="checkbox"
								checked={darkMode}
								onChange={() => setDarkMode(!darkMode)}
								className="toggle toggle-md"
							/>
						</div>
					</div>

					{/* Save Button */}
					<div className="text-right">
						<button
							onClick={handleSave}
							className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition">
							Save Changes
						</button>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Settings;
