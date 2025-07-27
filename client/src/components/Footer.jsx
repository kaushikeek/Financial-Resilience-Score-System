const Footer = () => {
	return (
		<footer className="bg-gradient-to-r from-emerald-500 to-indigo-600 text-white py-4 mt-10 shadow-inner">
			<div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm">
				<div className="mb-2 sm:mb-0">
					© {new Date().getFullYear()}{" "}
					<span className="font-semibold">ResilienceScore</span>. All rights
					reserved.
				</div>
				<div className="space-x-4">
					<a href="#" className="hover:underline hover:text-yellow-300">
						Privacy
					</a>
					<a href="#" className="hover:underline hover:text-yellow-300">
						Terms
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
