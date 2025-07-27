import { useState } from "react";
import { FaPaperPlane, FaRobot } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import MainLayout from "../layouts/MainLayout";
const Chatbot = () => {
	const [messages, setMessages] = useState([
		{
			role: "bot",
			text: "Hi! I’m your Financial Assistant. Ask me anything about your budget, savings, or score.",
		},
	]);
	const [input, setInput] = useState("");

	const handleSend = () => {
		if (!input.trim()) return;

		const userMessage = { role: "user", text: input };
		const botReply = {
			role: "bot",
			text: `Got it! I’ll get back to you about "${input}" shortly. 😊`, // Replace with real API reply later
		};

		setMessages([...messages, userMessage, botReply]);
		setInput("");
	};

	return (
		<MainLayout>
			<div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex flex-col">
				<header className="bg-white shadow px-6 py-4 flex items-center gap-3">
					<FaRobot className="text-indigo-600 text-2xl" />
					<h1 className="text-xl font-semibold text-indigo-700">
						AI Financial Assistant
					</h1>
				</header>

				<div className="flex-1 overflow-y-auto p-6 space-y-4">
					{messages.map((msg, idx) => (
						<div
							key={idx}
							className={`max-w-xl px-4 py-3 rounded-lg ${
								msg.role === "user"
									? "ml-auto bg-indigo-600 text-white"
									: "mr-auto bg-white border text-gray-800"
							}`}>
							{msg.text}
						</div>
					))}
				</div>

				<div className="bg-white p-4 flex items-center gap-3 border-t">
					<input
						type="text"
						className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
						placeholder="Ask your assistant..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleSend()}
					/>
					<button
						onClick={handleSend}
						className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
						<FaPaperPlane />
					</button>
				</div>
			</div>
		</MainLayout>
	);
};

export default Chatbot;
