import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import MainLayout from "../layouts/MainLayout";
import { supabase } from "../lib/supabase"; // adjust path as needed
 
const Upload = () => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleFileChange = (e) => {
		setSelectedFile(e.target.files[0]);
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			toast.error("Please select a file to upload.");
			return;
		}

		const user = (await supabase.auth.getUser()).data.user;
		if (!user) {
			toast.error("You must be logged in to upload a file.");
			return;
		}

		const formData = new FormData();
		formData.append("file", selectedFile);
		formData.append("user_id", user.id); // Supabase user ID

		setIsUploading(true);
		try {
			const res = await fetch("http://localhost:8000/upload", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();

			if (res.ok) {
				toast.success(`Uploaded successfully! ${data.rows || ""}`);
				setSelectedFile(null);
			} else {
				toast.error(data.error || "Upload failed.");
			}
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Something went wrong during upload.");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<MainLayout>
			<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white py-12 px-6">
				<div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
					<h1 className="text-2xl font-bold text-emerald-700 mb-4 text-center">
						Upload Your Statement
					</h1>
					<p className="text-gray-600 mb-6 text-center">
						Supported formats: <strong>CSV, PDF</strong>
					</p>

					<div className="flex flex-col items-center gap-4">
						<label
							htmlFor="file-upload"
							className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-6 rounded-lg flex items-center gap-2 shadow transition">
							<FaUpload />
							<span>{selectedFile ? "Change File" : "Choose File"}</span>
						</label>
						<input
							id="file-upload"
							type="file"
							accept=".csv,.pdf"
							onChange={handleFileChange}
							className="hidden"
						/>
						{selectedFile && (
							<p className="text-sm text-gray-700">
								Selected: <strong>{selectedFile.name}</strong>
							</p>
						)}
						<button
							onClick={handleUpload}
							disabled={isUploading}
							className={`bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg shadow transition mt-4 ${
								isUploading ? "opacity-50 cursor-not-allowed" : ""
							}`}>
							{isUploading ? "Uploading..." : "Upload"}
						</button>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Upload;
