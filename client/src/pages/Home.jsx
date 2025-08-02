import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { FaChartLine, FaRobot, FaUpload, FaTrophy } from "react-icons/fa";
import financeHero from "../assets/finance-hero.svg";

const Home = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setIsLoggedIn(!!session);
		};

		checkSession();

		// Optional: listen to auth changes as well
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setIsLoggedIn(!!session);
			}
		);

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-white">
			{/* Hero Section */}
			<section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-20 gap-10">
				{/* Text */}
				<div className="md:w-1/2 text-center md:text-left space-y-6">
					<h1 className="text-4xl md:text-5xl font-bold text-emerald-700">
						Take Control of Your Financial Resilience 💰
					</h1>
					<p className="text-lg text-gray-700">
						Upload your statements, get your personalized score, visualize
						future trends, and chat with your AI coach — all in one place.
					</p>
					{/* Conditionally render auth buttons */}
					{!isLoggedIn && (
						<div className="flex justify-center md:justify-start gap-4">
							<Link
								to="/signup"
								className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition">
								Get Started
							</Link>
							<a
								href="#features"
								className="bg-white text-emerald-700 font-semibold py-3 px-6 rounded-lg border border-emerald-300 hover:shadow-md transition">
								Learn More
							</a>
						</div>
					)}
				</div>

				{/* SVG */}
				<div className="md:w-1/2">
					<img
						src={financeHero}
						alt="Finance Illustration"
						className="w-full max-w-md mx-auto"
					/>
				</div>
			</section>

			{/* Features Section */}
			<section
				id="features"
				className="py-20 px-6 bg-white rounded-t-[3rem] shadow-inner">
				<h2 className="text-3xl font-bold text-center text-indigo-700 mb-12">
					Features Built to Boost Your Financial Health
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto text-center">
					<Link to="/dashboard" className="block">
						<div className="p-6 rounded-xl shadow-sm hover:shadow-lg bg-gradient-to-br from-white to-emerald-50 transition hover:scale-105">
							<FaChartLine className="text-4xl text-indigo-500 mb-4 mx-auto" />
							<h3 className="font-semibold text-lg mb-2">Score Engine</h3>
							<p className="text-sm text-gray-600">
								Get an explainable Financial Resilience Score powered by AI +
								SHAP.
							</p>
						</div>
					</Link>

					<Link to="/upload" className="block">
						<div className="p-6 rounded-xl shadow-sm hover:shadow-lg bg-gradient-to-br from-white to-emerald-50 transition hover:scale-105">
							<FaUpload className="text-4xl text-indigo-500 mb-4 mx-auto" />
							<h3 className="font-semibold text-lg mb-2">Easy Upload</h3>
							<p className="text-sm text-gray-600">
								Upload your bank or expense statements and let the parser do the
								work.
							</p>
						</div>
					</Link>

					<Link to="/chatbot" className="block">
						<div className="p-6 rounded-xl shadow-sm hover:shadow-lg bg-gradient-to-br from-white to-emerald-50 transition hover:scale-105">
							<FaRobot className="text-4xl text-indigo-500 mb-4 mx-auto" />
							<h3 className="font-semibold text-lg mb-2">AI Coach</h3>
							<p className="text-sm text-gray-600">
								Get personalized advice from your built-in AI financial
								assistant.
							</p>
						</div>
					</Link>

					<Link to="/gamification" className="block">
						<div className="p-6 rounded-xl shadow-sm hover:shadow-lg bg-gradient-to-br from-white to-emerald-50 transition hover:scale-105">
							<FaTrophy className="text-4xl text-indigo-500 mb-4 mx-auto" />
							<h3 className="font-semibold text-lg mb-2">Gamification</h3>
							<p className="text-sm text-gray-600">
								Earn points, unlock levels, and stay motivated to build
								financial strength.
							</p>
						</div>
					</Link>
				</div>
			</section>

			{/* Footer CTA */}
			{!isLoggedIn && (
				<section className="text-center py-16 bg-indigo-500 text-white mt-20">
					<h2 className="text-3xl font-bold mb-4">Ready to Get Your Score?</h2>
					<p className="mb-6">
						Join thousands taking charge of their financial future today.
					</p>
					<Link
						to="/signup"
						className="bg-white text-emerald-700 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition">
						Create an Account
					</Link>
				</section>
			)}
		</div>
	);
};

export default Home;
