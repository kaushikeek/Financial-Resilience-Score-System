import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { supabase } from "../lib/supabase"; // Adjust if needed

function Upload() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			setUser(session?.user ?? null);
		};

		getUser();

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user ?? null);
			}
		);

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	const onDrop = async (acceptedFiles) => {
		const file = acceptedFiles[0];
		const formData = new FormData();
		formData.append("file", file);
		formData.append("user_id", user?.id);

		try {
			const response = await axios.post(
				"http://localhost:8000/upload",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);
			alert(`Upload successful: ${JSON.stringify(response.data)}`);
		} catch (err) {
			alert("Upload failed");
			console.error(err);
		}
	};

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	if (!user) return <p className="p-4">Loading user...</p>;

	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
			<h1 className="text-2xl font-bold mb-4">Upload Bank Statement</h1>
			<div
				{...getRootProps()}
				className="w-96 h-40 border-4 border-dashed border-blue-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-50">
				<input {...getInputProps()} />
				<p className="text-gray-600">Drag & drop a PDF or CSV file here</p>
			</div>
		</div>
	);
}

export default Upload;
