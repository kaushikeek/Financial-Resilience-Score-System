import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import MainLayout from "../layouts/MainLayout";

const Forecast = () => {
	const [forecast, setForecast] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchForecast = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			try {
				const res = await fetch("http://localhost:8000/api/forecast", {
					headers: {
						"user-id": user.id,
					},
				});
				const data = await res.json();
				setForecast(data);
			} catch (err) {
				console.error("Failed to fetch forecast:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchForecast();
	}, []);

	return (
		<MainLayout>
			<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white py-12 px-6">
				<div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
					<h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
						📊 Forecast Trends
					</h1>

					{loading ? (
						<p className="text-center text-gray-500">Loading forecast...</p>
					) : forecast.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm text-left text-gray-700">
								<thead className="text-xs uppercase bg-indigo-50 text-indigo-700 border-b">
									<tr>
										<th className="px-6 py-3">Month</th>
										<th className="px-6 py-3">Projected Income</th>
										<th className="px-6 py-3">Projected Expenses</th>
										<th className="px-6 py-3">Expected Savings</th>
									</tr>
								</thead>
								<tbody>
									{forecast.map((row, index) => (
										<tr key={index} className="border-b hover:bg-gray-50">
											<td className="px-6 py-4 font-medium">{row.month}</td>
											<td className="px-6 py-4">
												₹ {row.income.toLocaleString()}
											</td>
											<td className="px-6 py-4">
												₹ {row.expenses.toLocaleString()}
											</td>
											<td className="px-6 py-4 text-emerald-600 font-semibold">
												₹ {row.savings.toLocaleString()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<p className="text-center text-gray-500">
							No forecast data available
						</p>
					)}
				</div>
			</div>
		</MainLayout>
	);
};

export default Forecast;
