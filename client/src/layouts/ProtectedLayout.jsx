// src/layouts/ProtectedLayout.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";

const ProtectedLayout = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setLoading(false);
		});

		const { data: listener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				setSession(session);
			}
		);

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	if (loading) return <div className="text-center mt-20">Loading...</div>;

	if (!session) return <Navigate to="/login" />;

	return (
		<div className="flex min-h-screen">
			<Sidebar />
			<main className="flex-1 p-6 bg-gray-50 overflow-auto">{children}</main>
		</div>
	);
};

export default ProtectedLayout;
