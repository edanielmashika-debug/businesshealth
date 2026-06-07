"use client";

import { useState } from "react";

import {
  Send,
  Bot,
  User,
  X,
} from "lucide-react";

import { generateAIResponse } from "../../services/ai-chat";

export default function AiChatbot({
  products,
  debts,
  expenses,
  sales,
  onClose,
}: any) {

  const [messages, setMessages] =
    useState<
      {
        role: "user" | "ai";
        text: string;
      }[]
    >([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function sendMessage() {

    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setInput("");

    setLoading(true);

    setTimeout(() => {

      const aiReply =
        generateAIResponse({
          message: userMessage,
          products,
          debts,
          expenses,
          sales,
        });

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: aiReply },
      ]);

      setLoading(false);

    }, 600);
  }

  return (

    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4">

      <div className="w-full max-w-2xl h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">

        {/* HEADER */}

        <div className="flex items-center justify-between p-5 border-b dark:border-slate-800">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">

              <Bot className="text-white w-5 h-5" />

            </div>

            <div>

              <h2 className="font-bold text-gray-800 dark:text-white">
                AI Business Assistant
              </h2>

              <p className="text-xs text-gray-500 dark:text-slate-400">
                Ask anything about your business
              </p>

            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:scale-105 transition"
          >
            <X size={18} />
          </button>

        </div>

        {/* CHAT AREA */}

        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {messages.map((msg, i) => (

            <div
              key={i}
              className={`flex gap-3 ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200"
                }`}
              >
                {msg.text}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-gray-300 dark:bg-slate-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}

            </div>
          ))}

          {loading && (
            <div className="text-sm text-gray-400">
              AI is thinking...
            </div>
          )}

        </div>

        {/* INPUT */}

        <div className="p-4 border-t dark:border-slate-800 flex gap-3">

          <input
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
            placeholder="Ask your business assistant..."
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={sendMessage}
            className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:scale-105 transition"
          >
            <Send size={18} />
          </button>

        </div>

      </div>

    </div>
  );
}