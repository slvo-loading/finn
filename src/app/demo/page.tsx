"use client"

import React, { useState } from "react";
import { PanelLeftOpen, PanelLeftClose, MessageCirclePlus, Bookmark, Search, User } from "lucide-react";

export default function Home() {
  const [model, setModel] = useState("gpt-4o");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [waterUsed, setWaterUsed] = useState(0);
  const [showImpact, setShowImpact] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const chats = [
    { title: "Chat 1" },
    { title: "Chat 2" },
    { title: "Chat 3" },
    { title: "Chat 4" },
    { title: "Chat 5" },
    { title: "Chat 6" },
    { title: "Chat 7" },
    { title: "Chat 8" },
    { title: "Chat 9" },
    { title: "Chat 10" },
  ];

  const modelWaterRates: Record<string, number> = {
    "gpt-4o": 0.1,
    "claude-sonnet": 0.05,
    "deepseek-v2": 0.02,
  };

  const handleSend = () => {
    if (!prompt.trim()) return;
    setMessages([...messages, prompt]);
    setWaterUsed(waterUsed + modelWaterRates[model]);
    setPrompt("");
  };

  return (
    <div className="flex h-screen text-sm">
      {/* Sidebar */}
      {sidebarOpen ? (
        <div className="w-56 bg-gray-100 p-4 flex flex-col gap-4 relative">
            
            {/* Header */}
          <div className="flex justify-between items-center gap-2">
            <img
              src="/hydralogo.png"
              alt="Hydra Logo"
              className="w-8 h-11 rounded-full"
            />
            <button onClick={() => setSidebarOpen(false)}>
              <PanelLeftClose className="w-7 h-7" />
            </button>
          </div>

            {/* Navigation Links */}
        <nav className="flex flex-col gap-3 mt-6">
            <button className="flex items-center gap-2 text-left hover:underline">
              <MessageCirclePlus className="w-6 h-6" />
              <span>New Chat</span>
            </button>

            <button className="flex items-center gap-2 text-left hover:underline">
              <Search className="w-6 h-6" />
              <span>Search Chats</span>
            </button>

            <button className="flex items-center gap-2 text-left hover:underline">
              <Bookmark className="w-6 h-6" />
              <span>Saved</span>
            </button>

            {/* chat history */}
            <div className="mt-6 text-gray-500 text-xs">Today</div>
            {chats.map((chat, index) => (
              <button
                key={index}
                className="flex items-center gap-1 text-left hover:bg-gray-200 rounded px-2 py-1"
              >
                <span>{chat.title}</span>
              </button>
            ))}

        </nav>

          {/* Profile Section */}
          <div className="mt-auto relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 text-sm text-left w-full px-2 py-2 hover:bg-gray-100 rounded"
            >
              <User className="w-6 h-6" />
              <span>My Profile</span>
              <svg className="w-4 h-4 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1L10.53 13a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
              </svg>
            </button>
            {profileMenuOpen && (
              <div className="absolute bottom-12 left-0 w-48 bg-white shadow-lg rounded p-2 text-sm z-50">
                <button className="w-full text-left px-2 py-1 hover:bg-gray-100">Settings</button>
                <button className="w-full text-left px-2 py-1 hover:bg-gray-100">Log Out</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-20 bg-gray-100 p-4 flex flex-col items-center gap-4 relative">
            <img
              src="/hydralogo.png"
              alt="Hydra Logo"
              className="w-8 h-11 rounded-full"
            />
            <button onClick={() => setSidebarOpen(true)}>
              <PanelLeftOpen className="w-7 h-7" />
            </button>

            {/* Navigation Links */}
            <button className="flex items-center gap-2 text-left hover:underline">
              <MessageCirclePlus className="w-7 h-7" />
            </button>

            <button className="flex items-center gap-2 text-left hover:underline">
              <Search className="w-7 h-7" />
            </button>

            <button className="flex items-center gap-2 text-left hover:underline">
              <Bookmark className="w-7 h-7" />
            </button>

          {/* Profile Section */}
          <div className="mt-auto relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 text-sm text-left w-full px-2 py-2 hover:bg-gray-100 rounded"
            >
              <User className="w-6 h-6" />
              <svg className="w-4 h-4 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1L10.53 13a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" />
              </svg>
            </button>
            {profileMenuOpen && (
              <div className="absolute bottom-12 left-0 w-48 bg-white shadow-lg rounded p-2 text-sm z-50">
                <button className="w-full text-left px-2 py-1 hover:bg-gray-100">Settings</button>
                <button className="w-full text-left px-2 py-1 hover:bg-gray-100">Log Out</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 relative bg-white">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className="flex justify-end">
              <div className="bg-blue-100 px-4 py-2 rounded-lg max-w-md">
                {msg}
              </div>
            </div>
          ))}
        </div>

        {/* Input + Controls */}
        <div className="border-t p-4 bg-white">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
              <span className="bg-sky-100 px-2 py-1 rounded">Hi</span>
              <span className="bg-sky-100 px-2 py-1 rounded">
                Tell me about the environmental effects of AI
              </span>
              <span className="bg-sky-100 px-2 py-1 rounded">Tell me a joke</span>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <select
                className="border p-2 rounded"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="gpt-4o">ChatGPT 4o (0.1L)</option>
                <option value="claude-sonnet">Claude Sonnet (0.05L)</option>
                <option value="deepseek-v2">DeepSeek V2 (0.02L)</option>
              </select>
              <input
                type="text"
                className="flex-1 border p-2 rounded"
                placeholder="Type your message..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Water Glass */}
      <div className="w-16 bg-sky-50 flex flex-col justify-end items-center p-2 relative">
        <div className="w-4 h-full bg-white border rounded-full flex flex-col justify-end overflow-hidden">
          <div
            className="bg-blue-400 w-full rounded-b-full transition-all duration-300"
            style={{ height: `${Math.min((waterUsed / 10) * 100, 100)}%` }}
          ></div>
        </div>
        <span className="text-xs mt-1">{waterUsed.toFixed(2)}L</span>
      </div>

      {/* Impact Dashboard Modal */}
      {showImpact && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <button
              onClick={() => setShowImpact(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Impact Dashboard</h2>
            <div className="flex justify-between mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-semibold">{waterUsed.toFixed(2)} L</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Month</p>
                <p className="font-semibold">15 L</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Week</p>
                <p className="font-semibold">5 L</p>
              </div>
            </div>
            <div className="text-xs mb-2 text-gray-600">Featured charity: WaterAid</div>
            <button className="bg-blue-500 text-white w-full py-2 rounded">
              Donate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
