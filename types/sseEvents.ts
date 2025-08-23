// File: types/sseEvents.ts

import type { StageInfo } from "@/types/llmResponse";
import { ChatCompletionChunk } from "openai/resources/chat/completions";
// ────────────────
// SSE event type tags
// ────────────────

export const EVENT_TYPES = [
  "chat_completion_chunk",
  "tool_completion_chunk",
  "tool_summary",
  "done",
  "cancel",
  "error",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

// I really want to use a branded type here, but it causes issues with Zustand's immer middleware
// export type uuid = `${string}-${string}-${string}-${string}-${string}`;
// export type stage_id = uuid & { readonly __brand: "stage_id" };
// export type stage_id = string;

// ────────────────
// Stream Payloads
// ────────────────
export interface ChatCompletionStreamPayload {
  /**
   * OpenAI streaming chunk for text output.
   * Contains delta updates like:
   *  - content: streamed text
   *  - tool_calls: streaming function call data
   */
  stage_id: string;
  chunk: ChatCompletionChunk;
}

export interface ToolCompletionStreamPayload {
  /**
   * Result of executing one or more tool calls.
   * Can include arbitrary structured data.
   */
  stage_id: string;
  tool_results: ChatCompletionChunk;
}

export interface ToolSummaryStreamPayload {
  stage_id: string;
  tool_summary: Record<string, any>;
}

export interface DonePayload {
  /** Marks the completion of a stage or output stream. */
  stage_id: string;
}

export interface CancelPayload {
  /** Marks cancellation of a stage. */
  stage_id: string;
}

export interface ErrorPayload {
  /** Represents an error that occurred during processing. */
  stage_id: string;
  error: string;
}

// ────────────────
// Event Envelope
// ────────────────

export type SSEPayload =
  | ChatCompletionStreamPayload
  | ToolCompletionStreamPayload
  | ToolSummaryStreamPayload
  | DonePayload
  | CancelPayload
  | ErrorPayload;

export interface SSEEvent {
  id: string;
  event: EventType;
  data: SSEPayload;
  retry?: number;
}

export type StageHTTPStreamOutput = {
  status: StageInfo;
  stage_id: string;
  type: "events";
  events: any;
};
