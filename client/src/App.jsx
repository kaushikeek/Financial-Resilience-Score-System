import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"; // <-- import Login

function App() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const getUser = async () => {
			const { data } = await supabase.auth.getSession();
			setUser(data?.session?.user ?? null);
		};

		getUser();

		const { data: authListener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user ?? null);
			}
		);

		return () => authListener.subscription.unsubscribe();
	}, []);

	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route
				path="/upload"
				element={user ? <Upload user={user} /> : <Navigate to="/login" />}
			/>
			<Route
				path="/dashboard"
				element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
			/>
			<Route path="*" element={<Navigate to="/upload" />} />
		</Routes>
	);
}

export default App;
