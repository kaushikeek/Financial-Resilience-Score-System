import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
	return (
		<div className="flex min-h-screen bg-gradient-to-br from-white to-emerald-50">
			<Sidebar />
			<main className="flex-1 pl-60 pr-6 pt-12 pb-6">{children}</main>
		</div>
	);
};

export default MainLayout;
