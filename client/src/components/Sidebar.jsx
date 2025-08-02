import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
	FaTachometerAlt,
	FaUser,
	FaList,
	FaHome,
	FaChartLine,
	FaUpload,
	FaRobot,
	FaTrophy,
	FaCog,
	FaSignOutAlt,
	FaBars,
	FaTimes,
} from "react-icons/fa";
import { supabase } from "../lib/supabase";

const Sidebar = () => {
	const location = useLocation();
	const [collapsed, setCollapsed] = useState(false);
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		// Delay rendering transitions until first render completes
		setInitialized(true);
	}, []);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		window.location.href = "/login";
	};

	const links = [
		{ name: "Home", icon: <FaHome />, path: "/" },
		{ name: "Dashboard", icon: <FaUser />, path: "/dashboard" },
		{ name: "Score Details", icon: <FaList />, path: "/score-details" },
		{ name: "Forecast", icon: <FaChartLine />, path: "/forecast" },
		{ name: "Upload", icon: <FaUpload />, path: "/upload" },
		{ name: "AI Coach", icon: <FaRobot />, path: "/chatbot" },
		{ name: "Gamification", icon: <FaTrophy />, path: "/gamification" },
		{ name: "Settings", icon: <FaCog />, path: "/settings" },
	];

	return (
		<aside
			className={`h-screen fixed top-0 left-0 z-50 bg-white border-r shadow-sm transition-all duration-300 ease-in-out ${
				collapsed ? "w-20" : "w-60"
			} ${initialized ? "" : "opacity-0"}`}>
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b">
				<span
					className={`text-xl font-bold text-emerald-700 transition-all ${
						collapsed ? "hidden" : "block"
					}`}>
					ResilienceScore
				</span>
				<button
					onClick={() => setCollapsed((prev) => !prev)}
					className="text-gray-600 hover:text-emerald-600">
					{collapsed ? <FaBars /> : <FaTimes />}
				</button>
			</div>

			{/* Navigation */}
			<nav className="flex flex-col p-4 gap-2 text-sm font-medium text-gray-700">
				{links.map((link) => (
					<Link
						key={link.name}
						to={link.path}
						className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
							location.pathname === link.path
								? "bg-emerald-100 text-emerald-700 font-semibold"
								: "hover:bg-emerald-50"
						}`}>
						{link.icon}
						{!collapsed && <span>{link.name}</span>}
					</Link>
				))}

				<button
					onClick={handleLogout}
					className="flex items-center gap-3 px-3 py-2 mt-6 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition">
					<FaSignOutAlt />
					{!collapsed && <span>Logout</span>}
				</button>
			</nav>
		</aside>
	);
};

export default Sidebar;
