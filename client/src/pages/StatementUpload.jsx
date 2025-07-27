import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";

const StatementUpload = () => {
	const [file, setFile] = useState(null);
	const [status, setStatus] = useState("");

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
		setStatus("");
	};

	const handleUpload = () => {
		if (!file) {
			setStatus("Please select a file first.");
			return;
		}

		// Simulated upload flow – replace this with Supabase/Backend integration
		setStatus("Uploading...");
		setTimeout(() => {
			setStatus(`✅ ${file.name} uploaded successfully!`);
			setFile(null);
		}, 2000);
	};

	return (
		<MainLayout>
			<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 p-6 flex flex-col items-center">
				<h1 className="text-3xl font-bold text-indigo-700 mb-6">
					Upload Statement
				</h1>

				<div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full text-center">
					<label
						htmlFor="fileUpload"
						className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:bg-indigo-50 transition">
						<FaUpload className="text-4xl text-indigo-500 mb-2" />
						<p className="text-indigo-700 font-medium">
							Click to upload your bank or expense statement (PDF/CSV)
						</p>
					</label>
					<input
						id="fileUpload"
						type="file"
						accept=".pdf,.csv"
						className="hidden"
						onChange={handleFileChange}
					/>

					{file && (
						<p className="mt-4 text-sm text-gray-700">
							Selected file: <strong>{file.name}</strong>
						</p>
					)}

					<button
						onClick={handleUpload}
						className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-semibold transition">
						Upload
					</button>

					{status && (
						<p className="mt-4 text-sm text-emerald-700 font-medium">
							{status}
						</p>
					)}
				</div>
			</div>
		</MainLayout>
	);
};

export default StatementUpload;
