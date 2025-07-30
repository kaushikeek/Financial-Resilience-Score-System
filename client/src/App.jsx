import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { supabase } from "./lib/supabase";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ScoreDetails from "./pages/ScoreDetails";
import Forecast from "./pages/Forecast";
import Chatbot from "./pages/Chatbot";
import StatementUpload from "./pages/StatementUpload";
import Gamification from "./pages/Gamification";
import Settings from "./pages/Settings";
import Progress from "./pages/Progress";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedLayout from "./layouts/ProtectedLayout";

function App() {
	const [session, setSession] = useState(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});
		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	return (
		<>
			<Toaster position="top-right" />

			{/* Public Pages */}
			<Routes>
				<Route
					path="/"
					element={
						<>
							<Header session={session} />
							<Home />
							<Footer />
						</>
					}
				/>
				<Route
					path="/login"
					element={
						<>
							<Header session={session} />
							<Login />
							<Footer />
						</>
					}
				/>
				<Route
					path="/signup"
					element={
						<>
							<Header session={session} />
							<Signup />
							<Footer />
						</>
					}
				/>

				{/* Protected Pages */}
				<Route
					path="/dashboard"
					element={
						<ProtectedLayout>
							<Dashboard />
						</ProtectedLayout>
					}
				/>
				<Route
					path="/score-details"
					element={
						<ProtectedLayout>
							<ScoreDetails />
						</ProtectedLayout>
					}
				/>
				<Route
					path="/forecast"
					element={
						<ProtectedLayout>
							<Forecast />
						</ProtectedLayout>
					}
				/>
				<Route
					path="/chatbot"
					element={
						<ProtectedLayout>
							<Chatbot />
						</ProtectedLayout>
					}
				/>
				<Route
					path="/upload"
					element={
						<ProtectedLayout>
							<StatementUpload />
						</ProtectedLayout>
					}
				/>
				<Route
					path="/gamification"
					element={
						<ProtectedLayout>
							<Gamification />
						</ProtectedLayout>
					}
				/>
				<Route
					path="/settings"
					element={
						<ProtectedLayout>
							<Settings />
						</ProtectedLayout>
					}
				/>
				<Route
					path="/progress"
					element={
						<ProtectedLayout>
							<Progress />
						</ProtectedLayout>
					}
				/>
			</Routes>
		</>
	);
}

export default App;
