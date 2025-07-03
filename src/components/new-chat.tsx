import { ExtendedUIMessage } from "@/lib/types";
import { useState } from "react";

type NewChatInputProps = {
    handleNewChat: (firstUserMessage: string) => Promise<void>;
  };  

export function NewChatInput({ handleNewChat }: NewChatInputProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    await handleNewChat(input.trim());
    setInput("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl p-4 bg-gray-100 rounded-xl flex flex-col gap-3">
      <textarea
        placeholder="Start your chat here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        className="p-2 rounded border border-gray-300 resize-none"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="self-end px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Start Chat"}
      </button>
    </form>
  );
}
