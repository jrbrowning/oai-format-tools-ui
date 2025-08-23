// File: lib/toolchainDispatcher.ts

import { Strategy } from "@/types/llmRequest";
import { EVENT_TYPES, EventType } from "@/types/sseEvents";

import { useRootStore } from "@/zustand/rootStore";
import axios from "axios";

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
  const state = useRootStore.getState();
  const req = state.llmRequests[stage_id];

  if (!req) {
    state.dispatchCompletion({
      type: "error",
      stage_id,
      message: "No LLM request found for stage_id",
      status: { state: "failed" },
    });
    return;
  }

  const url = resolveEndpointURL(req.strategy, false);

  try {
    const { data } = await axios.post(url, req);

    if ("tool_results" in data) {
      state.dispatchCompletion({
        type: "tool_results",
        stage_id,
        tool_results: data.tool_results,
        status: data.status ?? { state: "success" },
      });
    }

    if ("text" in data) {
      state.dispatchCompletion({
        type: "text",
        stage_id,
        text: data.text,
        status: data.status ?? { state: "success" },
      });
    }
  } catch (err: any) {
    state.dispatchCompletion({
      type: "error",
      stage_id,
      message: err?.message || "Chat Completion request failed",
      status: { state: "failed" },
    });
  }
}

export const isValidEventType = (val: string): val is EventType => {
  return EVENT_TYPES.includes(val as EventType);
};

export function parseSSEEvent(lines: string[]): {
  eventType: EventType | null;
  jsonPayload: string;
} {
  let eventType: EventType | null = null;
  let jsonPayload = "";

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("event:")) {
      const raw = trimmed.slice(6).trim();
      if (isValidEventType(raw)) {
        eventType = raw;
      } else {
        console.warn("[Invalid SSE event type]", raw);
      }
    } else if (trimmed.startsWith("data:")) {
      jsonPayload += trimmed.slice(5).trim();
    }
  }

  return { eventType, jsonPayload };
}

/**
 * Streaming: dynamically route to chat or toolchain stream.
 */
export async function dispatchToolChainStreaming(
  stage_id: string
): Promise<void> {
  const state = useRootStore.getState();
  const req = state.llmRequests[stage_id];

  if (!req) {
    state.dispatchStreaming({
      id: stage_id,
      event: "error",
      data: { stage_id, error: "No LLM request found for stage_id" },
    });
    return;
  }

  const url = resolveEndpointURL(req.strategy, true);

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

        const { eventType, jsonPayload } = parseSSEEvent(lines);

        try {
          const data = JSON.parse(jsonPayload);
          if (eventType) {
            state.dispatchStreaming({ id: stage_id, event: eventType, data });
          } else {
            state.dispatchStreaming({
              id: stage_id,
              event: "error",
              data: { stage_id, error: "Missing event type in SSE event" },
            });
          }
        } catch {
          state.dispatchStreaming({
            id: stage_id,
            event: "error",
            data: { stage_id, error: "Malformed SSE event" },
          });
        }
      }
    }
  } catch (err: any) {
    state.dispatchStreaming({
      id: stage_id,
      event: "error",
      data: { stage_id, error: err?.message || "Streaming request failed" },
    });
  }
}
