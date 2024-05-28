"use client";

import {useChat, useCompletion} from "ai/react";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });
    console.log("🚀  ",messages)

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="prompt"
        value={input}
        onChange={handleInputChange}
        id="input"
      />
      <button type="submit">Submit</button>
        {
            messages.map(message => {
                return <span>
                    {message.content}
                </span>
            })
        }
    </form>
  );
}
