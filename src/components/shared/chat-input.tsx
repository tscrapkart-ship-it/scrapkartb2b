"use client";

import { useState, useRef } from "react";
import { Send, Loader2 } from "lucide-react";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (content: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled || sending) return;

    setSending(true);
    onSend(trimmed);
    setText("");
    setSending(false);

    // Re-focus input after send
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  const canSend = text.trim().length > 0 && !disabled && !sending;

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          disabled={disabled}
          className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] px-4 text-base text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none transition-colors focus:border-[var(--forest)] focus:ring-1 focus:ring-[var(--forest)]/20 disabled:cursor-not-allowed disabled:opacity-40"
        />
      </div>
      <button
        type="submit"
        disabled={!canSend}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition-all duration-200 ${
          canSend
            ? "bg-[var(--forest)] text-white hover:bg-[var(--forest-2)] active:scale-95 shadow-[var(--shadow-1)]"
            : "bg-[var(--paper-2)] text-[var(--ink-4)] border border-[var(--line)] cursor-not-allowed"
        }`}
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </button>
    </form>
  );
}
