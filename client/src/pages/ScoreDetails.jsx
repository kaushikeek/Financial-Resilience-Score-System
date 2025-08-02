import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import MainLayout from "../layouts/MainLayout";
import { useLocation } from "react-router-dom";
const ScoreDetails = () => {
	const [scoreData, setScoreData] = useState(null);
	const [loading, setLoading] = useState(true);
	const location = useLocation();
	const fetchScore = async () => {
		setLoading(true);

		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError || !user) {
			console.error("User not logged in:", userError);
			setLoading(false);
			return;
		}

		try {
			const res = await fetch(
				`http://localhost:8000/api/score?user_id=${user.id}`
			);
			const data = await res.json();

			if (res.ok && data.score !== null) {
				let parsedBreakdown = data.breakdown;
				if (typeof data.breakdown === "string") {
					try {
						parsedBreakdown = JSON.parse(data.breakdown);
					} catch (e) {
						console.warn("Failed to parse breakdown:", e);
						parsedBreakdown = null;
					}
				}
				setScoreData({
					score: data.score,
					breakdown: parsedBreakdown,
					created_at: data.created_at,
				});
			} else {
				setScoreData(null);
			}
		} catch (error) {
			console.error("Failed to fetch score:", error);
			setScoreData(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchScore();
	}, [location.search]);

	const INFO_MAP = {
		income:
			"Your total inflow of money over the evaluated period. A higher income improves your financial capacity.",
		expenses:
			"Your total spending during the period. Keeping expenses lower than income contributes to financial health.",
		savings_rate:
			"The percentage of your income that you save. A higher savings rate indicates better financial discipline.",
		transaction_count:
			"The total number of financial transactions recorded. Can reflect your financial activity and stability.",
	};

	const [tooltip, setTooltip] = useState({ index: null, visible: false });
	return (
		<MainLayout>
			<div className="min-h-screen bg-gradient-to-br from-white to-emerald-50 py-12 px-6">
				<div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
					<h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
						Your Financial Resilience Score
					</h1>

					{loading ? (
						<p className="text-center text-gray-500">Loading score...</p>
					) : scoreData ? (
						<>
							<div className="text-center mb-10">
								<p className="text-6xl font-extrabold text-emerald-600">
									{scoreData.score?.toFixed
										? scoreData.score.toFixed(2)
										: scoreData.score}
								</p>
								{scoreData.created_at && (
									<p className="text-sm text-gray-400 mt-2">
										Last updated:{" "}
										{new Date(scoreData.created_at).toLocaleString()}
									</p>
								)}
							</div>

							<h2 className="text-xl font-semibold text-gray-700 mb-4">
								Score Breakdown
							</h2>

							{scoreData.breakdown ? (
								<ul className="space-y-4">
									{Object.entries(scoreData.breakdown).map(
										([label, value], index) => (
											<li
												key={index}
												className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 border-gray-200">
												<span className="text-gray-800 font-medium flex items-center gap-2">
													<div
														className="relative"
														onMouseEnter={() =>
															setTooltip({ index, visible: true })
														}
														onMouseLeave={() =>
															setTooltip({ index: null, visible: false })
														}>
														<FaInfoCircle className="text-gray-500" />
														{tooltip.visible && tooltip.index === index && (
															<div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 w-64 p-2 text-sm bg-white border border-gray-300 rounded shadow">
																{INFO_MAP[label] || "No information available."}
															</div>
														)}
													</div>
													{label
														.replace(/_/g, " ")
														.replace(/\b\w/g, (l) => l.toUpperCase())}
												</span>
												<span className="font-bold text-indigo-700">
													{typeof value === "number" ? value.toFixed(2) : value}
												</span>
											</li>
										)
									)}
								</ul>
							) : (
								<p className="text-center text-gray-500 italic">
									No breakdown available for this score.
								</p>
							)}

							<div className="mt-8 flex justify-center">
								<button
									onClick={fetchScore}
									className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
									Refresh
								</button>
							</div>
						</>
					) : (
						<p className="text-center text-red-500">
							No score available for your account.
						</p>
					)}
				</div>
			</div>
		</MainLayout>
	);
};

export default ScoreDetails;
