import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { FaSignOutAlt, FaUpload, FaUser } from "react-icons/fa";

const Header = () => {
	const [session, setSession] = useState(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});
		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		window.location.href = "/";
	};

	return (
		<header className="bg-gradient-to-r from-indigo-600 to-emerald-500 shadow-md text-white px-3 py-9">
			<div className="flex justify-between items-center max-w-7xl mx-auto">
				{/* Logo */}
				<Link
					to="/"
					className="text-4xl font-bold flex items-center tracking-wide hover:scale-105 transition-transform">
					ResilienceScore
				</Link>

				{/* Nav */}
				<nav className="space-x-6 text-2xl font-bold">
					{session ? (
						<>
							<Link
								to="/dashboard"
								className="hover:text-yellow-300 transition-all">
								<FaUser className="inline mr-1" /> Dashboard
							</Link>
							<Link
								to="/upload"
								className="hover:text-yellow-300 transition-all">
								<FaUpload className="inline mr-1" /> Upload
							</Link>
							<button
								onClick={handleLogout}
								className="hover:text-red-300 transition-all">
								<FaSignOutAlt className="inline mr-1" /> Logout
							</button>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="hover:text-yellow-300 transition-all">
								Login
							</Link>
							<Link
								to="/signup"
								className="hover:text-yellow-300 transition-all">
								Signup
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;
