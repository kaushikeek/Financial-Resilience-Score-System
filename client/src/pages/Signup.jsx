import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const Signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSignup = async (e) => {
		e.preventDefault();
		const { error } = await supabase.auth.signUp({ email, password });

		if (error) {
			toast.error(error.message);
		} else {
			toast.success("Check your inbox to confirm your email.");
			navigate("/login");
		}
	};

	const handleGoogleSignup = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
		});
		if (error) toast.error(error.message);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-100 flex items-center justify-center">
			<div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
				<h2 className="text-2xl font-bold text-center text-emerald-700 mb-6">
					Create Your ResilienceScore Account
				</h2>

				<form onSubmit={handleSignup} className="space-y-4">
					<div>
						<label className="block text-sm text-gray-700">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-700">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md font-semibold transition">
						Sign Up
					</button>
				</form>

				<div className="flex items-center my-6">
					<hr className="flex-grow border-gray-300" />
					<span className="mx-2 text-gray-500 text-sm">or</span>
					<hr className="flex-grow border-gray-300" />
				</div>

				<button
					onClick={handleGoogleSignup}
					className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 hover:bg-gray-50 transition">
					<FcGoogle className="text-xl" />
					<span className="font-medium text-gray-700">Sign Up with Google</span>
				</button>

				<p className="text-center text-sm text-gray-600 mt-6">
					Already have an account?{" "}
					<a
						href="/login"
						className="text-emerald-700 font-medium hover:underline">
						Log In
					</a>
				</p>
			</div>
		</div>
	);
};

export default Signup;
