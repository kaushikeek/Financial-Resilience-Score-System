import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import MainLayout from "../layouts/MainLayout";

const ScoreDetails = () => {
	const [scoreData, setScoreData] = useState(null);
	const [loading, setLoading] = useState(true);

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

		const { data, error } = await supabase
			.from("scores")
			.select("*")
			.eq("user_id", user.id)
			.order("created_at", { ascending: false })
			.limit(1)
			.single();

		if (error) {
			console.error("Error fetching score:", error.message);
			setScoreData(null);
		} else {
			setScoreData(data);
		}

		setLoading(false);
	};

	useEffect(() => {
		fetchScore();
	}, []);

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
									{scoreData.score}
								</p>
								<p className="text-gray-600 text-lg mt-2">
									Category:{" "}
									<span className="font-semibold">{scoreData.category}</span>
								</p>
								{scoreData.created_at && (
									<p className="text-sm text-gray-400 mt-1">
										Last updated: {new Date(scoreData.created_at).toLocaleString()}
									</p>
								)}
							</div>

							<h2 className="text-xl font-semibold text-gray-700 mb-4">
								Score Breakdown
							</h2>

							{Array.isArray(scoreData.explanation) &&
							scoreData.explanation.length > 0 ? (
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
