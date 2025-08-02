import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChartLine, FaUpload, FaRobot, FaTrophy } from "react-icons/fa";
import { supabase } from "../lib/supabase.js";
import MainLayout from "../layouts/MainLayout";

const Dashboard = () => {
	const [score, setScore] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchScore = async () => {
			setLoading(true);
			try {
				const { data, error } = await supabase
					.from("scores")
					.select("score")
					.order("created_at", { ascending: false })
					.limit(1)
					.single();

				if (error) throw error;
				setScore(data?.score || "N/A");
			} catch (err) {
				setError("Could not fetch score.");
			} finally {
				setLoading(false);
			}
		};

		fetchScore();
	}, []);

	return (
		<MainLayout>
			<div className="min-h-screen bg-gradient-to-br from-white to-emerald-50 py-12 px-6 pl-64">
				<h1 className="text-3xl font-bold text-emerald-700 mb-8 text-center">
					Your Financial Dashboard
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{/* Resilience Score Box */}
					<div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
						<h2 className="text-2xl font-semibold text-indigo-600 mb-4">
							Resilience Score
						</h2>
						<div className="text-4xl font-bold text-emerald-700 mb-2">
							{loading ? "Loading..." : error ? "—" : score}
						</div>
						<p className="text-gray-600 text-sm">
							Based on latest uploaded data
						</p>
						<Link
							to="/score-details"
							className="inline-block mt-4 text-indigo-600 hover:text-indigo-900 text-sm">
							View Details →
						</Link>
					</div>

					{/* Trends */}
					<div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
						<h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
							<FaChartLine /> Trends
						</h2>
						<p className="text-sm text-gray-700">
							Visualize your expenses and resilience score trajectory.
						</p>
						<Link
							to="/forecast"
							className="inline-block mt-4 text-indigo-600 hover:text-indigo-900 text-sm">
							View Forecast →
						</Link>
					</div>

					{/* Upload */}
					<div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
						<h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
							<FaUpload /> Upload Data
						</h2>
						<p className="text-sm text-gray-700">
							Upload your bank or financial statements to get updated insights.
						</p>
						<Link
							to="/upload"
							className="inline-block mt-4 text-indigo-600 hover:text-indigo-900 text-sm">
							Upload Now →
						</Link>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-12">
					{/* Chatbot */}
					<div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
						<h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
							<FaRobot /> AI Coach
						</h2>
						<p className="text-sm text-gray-700">
							Ask questions and get insights with your built-in financial
							assistant.
						</p>
						<Link
							to="/chatbot"
							className="inline-block mt-4 text-indigo-600 hover:text-indigo-900 text-sm">
							Chat Now →
						</Link>
					</div>

					{/* Gamification */}
					<div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
						<h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
							<FaTrophy /> Gamify Progress
						</h2>
						<p className="text-sm text-gray-700">
							Track your badges, progress, and earn points as you improve.
						</p>
						<Link
							to="/gamification"
							className="inline-block mt-4 text-indigo-600 hover:text-indigo-900 text-sm">
							View Progress →
						</Link>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Dashboard;
