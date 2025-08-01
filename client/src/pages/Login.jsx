import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			toast.error(error.message);
		} else {
			toast.success("Login successful!");
			navigate("/dashboard");
		}
	};

	const handleGoogleLogin = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
		});

		if (error) toast.error(error.message);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-100 flex items-center justify-center">
			<div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
				<h2 className="text-2xl font-bold text-center text-emerald-700 mb-6">
					Log In to ResilienceScore
				</h2>

				<form onSubmit={handleLogin} className="space-y-4">
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
						Log In
					</button>
				</form>

				<div className="flex items-center my-6">
					<hr className="flex-grow border-gray-300" />
					<span className="mx-2 text-gray-500 text-sm">or</span>
					<hr className="flex-grow border-gray-300" />
				</div>

				<button
					onClick={handleGoogleLogin}
					className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 hover:bg-gray-50 transition">
					<FcGoogle className="text-xl" />
					<span className="font-medium text-gray-700">
						Continue with Google
					</span>
				</button>

				<p className="text-center text-sm text-gray-600 mt-6">
					Don't have an account?{" "}
					<a
						href="/signup"
						className="text-emerald-700 font-medium hover:underline">
						Sign Up
					</a>
				</p>
			</div>
		</div>
	);
};

export default Login;
