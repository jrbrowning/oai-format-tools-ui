// File: lib/toolchainDispatcher.ts

import { Strategy } from "@/types/llmRequest";

/**
 * TOOLCHAIN_HOST env: set to toolchain endpoint.
 */
const TOOLCHAIN_HOST: string = import.meta.env
  .VITE_PUBLIC_TOOLCHAIN_HOST as string;

function resolveEndpointURL(strategy: Strategy, stream: boolean): string {
  const base = stream ? "stream" : "completion";
  const type = strategy === Strategy.ChatCompletion ? "chat" : "toolchain";
  return `${TOOLCHAIN_HOST}/${base}/v1/${type}`;
}

/**
 * Non-streaming: dynamically route to chat or toolchain completion.
 */
export async function dispatchToolChainCompletion(
  stage_id: string
): Promise<void> {
  const url = "";
  const req = "";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (!response.body) throw new Error("No response body for streaming");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const block of events) {
        const lines = block.split("\n");

        try {
          // TODO: Add processing logic here, e.g. parse or handle the lines
        } catch {
          // TODO: Handle error if processing fails
        }
      }
    }
  } catch (err: any) {}
}
