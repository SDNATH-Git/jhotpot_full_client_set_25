import React, { useState, useRef, useEffect } from "react";
import { MdMarkUnreadChatAlt } from "react-icons/md";

const uuid = () => Math.random().toString(36).slice(2, 9);

const ChatBoth = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: uuid(),
            role: "assistant",
            text: "👋 Welcome to Jhotpot! How can I help you today?",
            createdAt: Date.now(),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const listRef = useRef(null);

    useEffect(() => {
        listRef.current?.scrollTo({
            top: listRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, open]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text) return;

        const userMsg = { id: uuid(), role: "user", text, createdAt: Date.now() };
        setMessages((m) => [...m, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });

            const data = await res.json();
            const assistantMsg = {
                id: uuid(),
                role: "assistant",
                text: data.reply || "Sorry, I couldn't process that.",
                createdAt: Date.now(),
            };
            setMessages((m) => [...m, assistantMsg]);
        } catch (err) {
            setMessages((m) => [
                ...m,
                {
                    id: uuid(),
                    role: "assistant",
                    text: "⚠️ Something went wrong.",
                    createdAt: Date.now(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Open chat"
                className="fixed bottom-6 right-6 bg-[#F04C2B] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 z-50"
            >

                <MdMarkUnreadChatAlt size={32} />

            </button>

            {/* Chat popup */}
            {open && (
                <div className="fixed bottom-20 right-4 w-72 md:w-96 max-h-[65vh] md:max-h-[80vh] bg-white shadow-2xl rounded-2xl border border-blue-300 flex flex-col z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#F04C2B] text-white rounded-t-2xl">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                👨‍🚀

                            </div>
                            <div>
                                <div className="text-sm font-semibold">Parcel Management Assistant</div>
                                <div className="text-xs opacity-80">Always here to help</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white/90 hover:opacity-80"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={listRef} className="flex-1 overflow-auto p-3 space-y-3">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`${m.role === "user" ? "bg-blue-50" : "bg-orange-50"
                                        } p-2 rounded-lg max-w-[78%] text-sm whitespace-pre-wrap`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-[#F1F1F3] p-2 rounded-lg text-sm text-gray-700">
                                    ...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-100 p-3">
                        <div className="flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your question..."
                                className="flex-1 rounded-xl border border-blue-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#F04C2B]"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="bg-[#F04C2B] text-white rounded-xl px-3 py-2 text-sm disabled:opacity-50"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBoth;