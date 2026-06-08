"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bot,
  Send,
  User,
  X,
  Sparkles,
} from "lucide-react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AiChatbot({
  products,
  debts,
  expenses,
  sales,
  onClose,
}: any) {

  const [messages, setMessages] =
    useState<Message[]>([
      {
        role: "ai",
        text:
          "Hello 👋 I'm your AI business assistant. Ask me anything about your sales, debts, expenses, profits, or inventory.",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null
    );

  /*
    AUTO SCROLL
  */

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  /*
    SEND MESSAGE
  */

  async function sendMessage() {

    if (
      !input.trim() ||
      loading
    )
      return;

    const userMessage =
      input;

    /*
      USER MESSAGE
    */

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setInput("");

    setLoading(true);

    try {

      const response =
        await fetch(
          "/api/ai-chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              message:
                userMessage,

              businessData: {

                products,

                debts,

                expenses,

                sales,
              },
            }),
          }
        );

      const data =
        await response.json();

      console.log(data);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            data.reply ||
            "No response from AI.",
        },
      ]);

    } catch (error) {

      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            "AI failed to respond.",
        },
      ]);

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">

      <div className="w-full md:max-w-3xl h-[100dvh] md:h-[90vh] bg-white dark:bg-slate-900 md:rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">

        {/* HEADER */}

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">

              <Sparkles className="w-6 h-6 text-white" />

            </div>

            <div>

              <h2 className="font-bold text-gray-800 dark:text-white text-lg">
                AI Business Assistant
              </h2>

              <p className="text-xs text-gray-500 dark:text-slate-400">
                Powered by OpenAI
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center hover:scale-105 transition"
          >

            <X className="w-5 h-5 text-black dark:text-white" />

          </button>

        </div>

        {/* CHAT AREA */}

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-gray-50 dark:bg-slate-950">

          {messages.map(
            (
              message,
              index
            ) => (

              <div
                key={index}
                className={`flex items-end gap-3 ${message.role ===
                    "user"
                    ? "justify-end"
                    : "justify-start"
                  }`}
              >

                {message.role ===
                  "ai" && (

                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shrink-0">

                      <Bot className="w-5 h-5 text-white" />

                    </div>
                  )}

                <div
                  className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm ${message.role ===
                      "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 border border-gray-200 dark:border-slate-800 rounded-bl-md"
                    }`}
                >
                  {message.text}
                </div>

                {message.role ===
                  "user" && (

                    <div className="w-10 h-10 rounded-2xl bg-gray-300 dark:bg-slate-700 flex items-center justify-center shrink-0">

                      <User className="w-5 h-5 text-black dark:text-white" />

                    </div>
                  )}

              </div>
            )
          )}

          {/* LOADING */}

          {loading && (

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">

                <Bot className="w-5 h-5 text-white" />

              </div>

              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-5 py-4 rounded-3xl rounded-bl-md shadow-sm">

                <div className="flex gap-1">

                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />

                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100" />

                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200" />

                </div>

              </div>

            </div>
          )}

          <div ref={messagesEndRef} />

        </div>

        {/* INPUT */}

        <div className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">

          <div className="flex items-center gap-3">

            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key ===
                  "Enter"
                ) {

                  sendMessage();
                }
              }}
              placeholder="Ask your AI assistant..."
              className="flex-1 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white placeholder:text-gray-400"
            />

            <button
              onClick={
                sendMessage
              }
              disabled={
                loading
              }
              className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition disabled:opacity-50"
            >

              <Send className="w-5 h-5" />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
