import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState("");

	const handleLogin = async () => {
		setStatus("Sending magic link...");

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: "http://localhost:5173/", // Update if hosted elsewhere
			},
		});

		if (error) {
			console.error("Login error:", error.message);
			setStatus("Error: " + error.message);
		} else {
			setStatus("Magic link sent! Check your email.");
		}
	};

	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
			<h1 className="text-2xl font-bold mb-4">Login with Email</h1>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="you@example.com"
				className="mb-2 p-2 border w-80 rounded"
			/>
			<button
				onClick={handleLogin}
				className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
				Send Magic Link
			</button>
			{status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
		</div>
	);
}
