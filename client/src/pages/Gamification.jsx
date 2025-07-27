import { FaMedal, FaStar, FaChartLine, FaTrophy } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import MainLayout from "../layouts/MainLayout";

const Gamification = () => {
	const mockStats = {
		level: 3,
		points: 1450,
		badges: ["Budget Master", "Savings Champ", "Goal Setter"],
	};

	return (
		<MainLayout>
			<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-100 to-emerald-50 px-6 py-12">
				<h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-10">
					Your Financial Fitness Journey
				</h1>

				<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
					{/* Level */}
					<div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
						<FaChartLine className="text-4xl text-emerald-500 mx-auto mb-4" />
						<h2 className="text-xl font-semibold text-indigo-600">Level</h2>
						<p className="text-2xl font-bold text-gray-800">
							{mockStats.level}
						</p>
						<p className="text-sm text-gray-500 mt-1">Climb the ranks!</p>
					</div>

					{/* Points */}
					<div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
						<FaStar className="text-4xl text-yellow-500 mx-auto mb-4" />
						<h2 className="text-xl font-semibold text-indigo-600">Points</h2>
						<p className="text-2xl font-bold text-gray-800">
							{mockStats.points}
						</p>
						<p className="text-sm text-gray-500 mt-1">Earn as you learn.</p>
					</div>

					{/* Badges */}
					<div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
						<FaTrophy className="text-4xl text-pink-500 mx-auto mb-4" />
						<h2 className="text-xl font-semibold text-indigo-600">Badges</h2>
						<ul className="mt-2 space-y-2 text-sm text-gray-700">
							{mockStats.badges.map((badge, idx) => (
								<li
									key={idx}
									className="flex items-center justify-center gap-2">
									<FaMedal className="text-indigo-400" />
									<span>{badge}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* CTA */}
				<div className="mt-16 text-center">
					<p className="text-gray-700 mb-4">
						Complete actions like uploading statements, improving your score,
						and reaching goals to earn more!
					</p>
					<button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition">
						View Full Progress
					</button>
				</div>
			</div>
		</MainLayout>
	);
};

export default Gamification;
