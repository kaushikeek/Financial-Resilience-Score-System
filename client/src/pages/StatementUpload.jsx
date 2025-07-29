import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const StatementUpload = () => {
	const [file, setFile] = useState(null);
	const [status, setStatus] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const navigate = useNavigate();

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
		setStatus("");
	};

	const handleUpload = async () => {
		console.log("[DEBUG] Upload button clicked");

		if (!file) {
			setStatus("Please select a CSV file first.");
			return;
		}

		setIsUploading(true);

		try {
			const { data, error } = await supabase.auth.getUser();
			const user_id = data?.user?.id;

			if (!user_id) {
				setStatus("❌ User not authenticated.");
				setIsUploading(false);
				return;
			}

			const formData = new FormData();
			formData.append("file", file);
			formData.append("user_id", user_id);

			console.log("[DEBUG] Sending request to FastAPI backend...");

			const res = await fetch("http://localhost:8000/api/upload", {
				method: "POST",
				body: formData,
			});

			const result = await res.json();
			console.log("[DEBUG] Upload response:", result);

			if (res.ok && result.status === "success") {
				setStatus("✅ Upload and score calculation successful!");
				navigate("/score-details"); // redirect
			} else {
				setStatus("❌ Upload failed: " + JSON.stringify(result));
			}
		} catch (err) {
			console.error("[ERROR] Upload failed:", err);
			setStatus("❌ Upload failed due to network error.");
		} finally {
			setIsUploading(false);
		}
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
							Click to upload your bank or expense statement (CSV)
						</p>
					</label>
					<input
						id="fileUpload"
						type="file"
						accept=".csv"
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
						disabled={isUploading}
						className={`mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-semibold transition ${
							isUploading ? "opacity-50 cursor-not-allowed" : ""
						}`}>
						{isUploading ? "Uploading..." : "Upload"}
					</button>

					{status && (
						<p className="mt-4 text-sm font-medium text-center text-indigo-700">
							{status}
						</p>
					)}
				</div>
			</div>
		</MainLayout>
	);
};

export default StatementUpload;
