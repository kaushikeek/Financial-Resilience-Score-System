import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import MainLayout from "../layouts/MainLayout";
const mockScoreData = {
	score: 76,
	category: "Stable",
	explanation: [
		{ label: "Emergency Savings", value: "+15", impact: "positive" },
		{ label: "Debt-to-Income Ratio", value: "-10", impact: "negative" },
		{ label: "Spending Trends", value: "+5", impact: "positive" },
		{ label: "Investment Health", value: "+8", impact: "positive" },
		{ label: "Credit Utilization", value: "-7", impact: "negative" },
	],
};

const ScoreDetails = () => {
	const [scoreData, setScoreData] = useState(null);

	useEffect(() => {
		// Simulate fetching score from backend
		setTimeout(() => {
			setScoreData(mockScoreData);
		}, 500);
	}, []);

	return (
		<MainLayout>
			<div className="min-h-screen bg-gradient-to-br from-white to-emerald-50 py-12 px-6">
				<div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
					<h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
						Your Financial Resilience Score
					</h1>

					{scoreData ? (
						<>
							<div className="text-center mb-10">
								<p className="text-6xl font-extrabold text-emerald-600">
									{scoreData.score}
								</p>
								<p className="text-gray-600 text-lg mt-2">
									Category:{" "}
									<span className="font-semibold">{scoreData.category}</span>
								</p>
							</div>

							<h2 className="text-xl font-semibold text-gray-700 mb-4">
								Score Breakdown
							</h2>
							<ul className="space-y-4">
								{scoreData.explanation.map((item, index) => (
									<li
										key={index}
										className={`flex items-center justify-between p-4 rounded-lg border ${
											item.impact === "positive"
												? "bg-green-50 border-green-200"
												: "bg-red-50 border-red-200"
										}`}>
										<span className="text-gray-800 font-medium flex items-center gap-2">
											<FaInfoCircle className="text-gray-500" />
											{item.label}
										</span>
										<span
											className={`font-bold ${
												item.impact === "positive"
													? "text-green-600"
													: "text-red-600"
											}`}>
											{item.value}
										</span>
									</li>
								))}
							</ul>
						</>
					) : (
						<p className="text-center text-gray-500">Loading score...</p>
					)}
				</div>
			</div>
		</MainLayout>
	);
};

export default ScoreDetails;
