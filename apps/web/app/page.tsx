"use client";

import { useChat, useCompletion } from "ai/react";
import { Chat, Interact, UserQuery, AssistantReply } from "@repo/core";
import { useState } from "react";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });
  console.log("🚀  ", messages);

  return (
    <div style={{ height: "100vh" }}>
      <Chat
        interact={
          <Interact
            input={input}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
          />
        }
      >
        {messages.map((msg) => {
          return msg.role === "user" ? (
            <UserQuery query={msg.content} />
          ) : (
            <AssistantReply content={msg.content} />
          );
        })}
      </Chat>
    </div>
  );
}
