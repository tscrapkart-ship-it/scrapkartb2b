"use client";

import type { Message } from "@/types";

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  const time = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return time;
  if (diffHours < 24) return time;

  // Different day — show date + time
  const dateStr2 = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  return `${dateStr2}, ${time}`;
}

export function MessageBubble({
  message,
  isOwn,
  showTimestamp = true,
}: {
  message: Message;
  isOwn: boolean;
  showTimestamp?: boolean;
}) {
  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      <div className={`group max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`relative px-4 py-2.5 ${
            isOwn
              ? "rounded-[var(--radius-lg)] rounded-tr-[var(--radius-sm)] bg-[var(--forest)] text-white"
              : "rounded-[var(--radius-lg)] rounded-tl-[var(--radius-sm)] bg-[var(--paper-2)] text-[var(--ink)] border border-[var(--line)]"
          }`}
        >
          <p className="text-base leading-relaxed">
            {message.content}
          </p>
        </div>
        {showTimestamp && (
          <p
            className={`mt-1 px-1 text-xs text-[var(--ink-4)] ${
              isOwn ? "text-right" : "text-left"
            }`}
          >
            {formatTime(message.created_at)}
          </p>
        )}
      </div>
    </div>
  );
}
