import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import MainLayout from "../layouts/MainLayout";
import ReactMarkdown from "react-markdown";
import { FaPaperPlane, FaRobot, FaUserCircle } from "react-icons/fa";

const Chatbot = () => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [userId, setUserId] = useState(null);
	const scrollRef = useRef();

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUserId(data?.user?.id || null);
		});
	}, []);

	const handleSend = async () => {
		if (!input.trim()) return;

		const userMsg = { role: "user", content: input };
		setMessages((prev) => [...prev, userMsg]);
		setInput("");
		setLoading(true);

		try {
			const res = await fetch("http://localhost:8000/api/chatbot", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: input }),
			});
			const data = await res.json();
			const botMsg = { role: "bot", content: data.response };
			setMessages((prev) => [...prev, botMsg]);
		} catch {
			setMessages((prev) => [
				...prev,
				{ role: "bot", content: "⚠️ Something went wrong." },
			]);
		}

		setLoading(false);
	};

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, loading]);

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<MainLayout>
			<div className="max-w-4xl bg-gradient-to-br from-indigo-100 to-emerald-100 rounded-2xl mx-auto p-6 h-[calc(100vh-120px)] flex flex-col">
				<h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
					Resilio - your financial assistant!
				</h1>

				{/* Chat Area */}
				<div className="flex-1 overflow-y-auto bg-[#fdfdfd] border border-blue-200 rounded-xl shadow-inner px-6 py-4 space-y-6">
					{messages.map((msg, idx) => (
						<div
							key={idx}
							className={`flex ${
								msg.role === "user" ? "justify-end" : "justify-start"
							}`}>
							<div className="flex gap-3 max-w-[80%] items-start">
								{msg.role === "bot" && (
									<div className="pt-1 text-green-500">
										<FaRobot size={20} />
									</div>
								)}
								<div
									className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap rounded-lg shadow-sm ${
										msg.role === "user"
											? "bg-gradient-to-br from-blue-100 to-blue-200 text-gray-800 rounded-br-none"
											: "bg-gray-100 text-gray-700 rounded-bl-none"
									}`}>
									{msg.role === "bot" ? (
										<ReactMarkdown>{msg.content}</ReactMarkdown>
									) : (
										msg.content
									)}
								</div>
								{msg.role === "user" && (
									<div className="pt-1 text-blue-500">
										<FaUserCircle size={20} />
									</div>
								)}
							</div>
						</div>
					))}

					{loading && (
						<div className="text-sm italic text-gray-500 flex gap-2 items-center">
							<FaRobot className="animate-bounce" />
							Thinking...
						</div>
					)}

					<div ref={scrollRef} />
				</div>

				{/* Input Area */}
				<div className="mt-5 bg-white border border-gray-300 rounded-full px-4 py-3 flex items-center shadow-md focus-within:ring-2 ring-blue-400">
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						rows={1}
						placeholder="Ask your question about finances..."
						className="flex-1 resize-none text-base font-medium placeholder-gray-500 bg-transparent outline-none"
					/>
					<button
						onClick={handleSend}
						disabled={!input.trim() || loading}
						className="text-white bg-blue-500 hover:bg-blue-600 transition px-4 py-2 rounded-full ml-3 disabled:opacity-50">
						<FaPaperPlane size={16} />
					</button>
				</div>
			</div>
		</MainLayout>
	);
};

export default Chatbot;
