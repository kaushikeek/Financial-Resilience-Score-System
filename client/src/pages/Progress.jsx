// src/pages/Progress.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import MainLayout from "../layouts/MainLayout";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

const Progress = () => {
	const [scores, setScores] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		const fetchScoreProgress = async () => {
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();

			if (userError || !user) {
				navigate("/login");
				return;
			}

			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/progress/${user.id}`
				);
				if (!response.ok) throw new Error("Failed to fetch score progress");
				const result = await response.json();
				setScores(result.scores);
			} catch (err) {
				setError(err.message || "Error fetching progress");
			} finally {
				setLoading(false);
			}
		};

		fetchScoreProgress();
	}, [navigate]);

	const formattedData = scores.map((s) => ({
		date: format(new Date(s.created_at), "yyyy-MM-dd"),
		score: s.score,
	}));

	return (
		<MainLayout>
			<div className="p-6">
				<h1 className="text-3xl font-bold mb-6">Your Score Progress</h1>

				{loading ? (
					<p>Loading...</p>
				) : error ? (
					<p className="text-red-500">{error}</p>
				) : scores.length === 0 ? (
					<p>No score history available yet.</p>
				) : (
					<div className="bg-white rounded-xl p-6 shadow-lg">
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={formattedData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis domain={[0, 100]} />
								<Tooltip />
								<Line
									type="monotone"
									dataKey="score"
									stroke="#4f46e5"
									strokeWidth={3}
									activeDot={{ r: 6 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				)}
			</div>
		</MainLayout>
	);
};

export default Progress;
