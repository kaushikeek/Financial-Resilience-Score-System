// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import { FaChartLine, FaUpload, FaRobot, FaTrophy } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import MainLayout from "../layouts/MainLayout";
const Dashboard = () => {
	return (
		<MainLayout>
			<div className="min-h-screen bg-gradient-to-br from-white to-emerald-50 py-12 px-6 pl-64">
				<h1 className="text-3xl font-bold text-emerald-700 mb-8 text-center">
					Your Financial Dashboard
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					<div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
						<h2 className="text-2xl font-semibold text-indigo-600 mb-4">
							Resilience Score
						</h2>
						<div className="text-4xl font-bold text-emerald-700 mb-2">78</div>
						<p className="text-gray-600 text-sm">
							Based on latest uploaded data
						</p>
						<Link
							to="/score-details"
							className="inline-block mt-4 text-indigo-600 hover:underline text-sm">
							View Details →
						</Link>
					</div>

					<div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
						<h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
							<FaChartLine /> Trends
						</h2>
						<div className="text-sm text-gray-700">
							Visualize your expenses and resilience score trajectory.
						</div>
						<Link
							to="/forecast"
							className="inline-block mt-4 text-indigo-600 hover:underline text-sm">
							View Forecast →
						</Link>
					</div>

					<div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
						<h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
							<FaUpload /> Upload Data
						</h2>
						<p className="text-sm text-gray-700">
							Upload your bank or financial statements to get updated insights.
						</p>
						<Link
							to="/upload"
							className="inline-block mt-4 text-indigo-600 hover:underline text-sm">
							Upload Now →
						</Link>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-12">
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
							className="inline-block mt-4 text-indigo-600 hover:underline text-sm">
							Chat Now →
						</Link>
					</div>

					<div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
						<h2 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
							<FaTrophy /> Gamify Progress
						</h2>
						<p className="text-sm text-gray-700">
							Track your badges, progress, and earn points as you improve.
						</p>
						<Link
							to="/gamification"
							className="inline-block mt-4 text-indigo-600 hover:underline text-sm">
							View Progress →
						</Link>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Dashboard;
