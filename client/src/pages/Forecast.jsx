import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import MainLayout from "../layouts/MainLayout";
const mockForecastData = [
	{ month: "Jul", income: 55000, expenses: 42000, savings: 13000 },
	{ month: "Aug", income: 58000, expenses: 44000, savings: 14000 },
	{ month: "Sep", income: 60000, expenses: 45000, savings: 15000 },
	{ month: "Oct", income: 61000, expenses: 47000, savings: 14000 },
	{ month: "Nov", income: 62000, expenses: 48000, savings: 14000 },
];

const Forecast = () => {
	const [forecast, setForecast] = useState([]);

	useEffect(() => {
		// Simulate API call
		setTimeout(() => {
			setForecast(mockForecastData);
		}, 500);
	}, []);

	return (
		<MainLayout>
			<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white py-12 px-6">
				<div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
					<h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
						📊 Forecast Trends
					</h1>

					{forecast.length > 0 ? (
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
						<p className="text-center text-gray-500">Loading forecast...</p>
					)}
				</div>
			</div>
		</MainLayout>
	);
};

export default Forecast;
