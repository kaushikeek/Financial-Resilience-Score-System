import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Dashboard({ user }) {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user?.id) return;

		const fetchTransactions = async () => {
			const { data, error } = await supabase
				.from("transactions")
				.select("*")
				.eq("user_id", user.id)
				.order("date", { ascending: false });

			if (error) console.error("Error fetching transactions:", error);
			else setTransactions(data);

			setLoading(false);
		};

		fetchTransactions();
	}, [user]);

	if (loading) return <div className="p-6">Loading...</div>;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Your Transactions</h1>
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr className="bg-gray-100 text-left">
							<th className="p-2">Date</th>
							<th className="p-2">Description</th>
							<th className="p-2 text-right">Amount</th>
							<th className="p-2">Type</th>
							<th className="p-2">Category</th>
						</tr>
					</thead>
					<tbody>
						{transactions.map((txn) => (
							<tr key={txn.id} className="border-b hover:bg-gray-50">
								<td className="p-2">{txn.date}</td>
								<td className="p-2">{txn.description}</td>
								<td
									className={`p-2 text-right ${
										txn.type === "debit" ? "text-red-500" : "text-green-600"
									}`}>
									₹{Math.abs(txn.amount)}
								</td>
								<td className="p-2 capitalize">{txn.type}</td>
								<td className="p-2">
									<span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
										{txn.category}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Dashboard;
