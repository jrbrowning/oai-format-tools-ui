// File: types/llmRequest.ts

import type { ModelKey } from "@/lib/constants";

// This is intention-first design — the client doesn’t know or care what protocol, SDK, or orchestration is used.  Boundary abstraction.
export interface ModelContainer {
  name: ModelKey;
  version: string;
}
export enum Strategy {
  ChatCompletion = "chat_completion",
  ToolCall = "tool_call",
  Synthesis = "synthesis",
  // Evaluation = "evaluation",
  // Validate = "validate",
}

export interface LLMRequest {
  stage_id: string;
  system_prompt: string;
  user_prompt: string;
  model_container: ModelKey;
  strategy: Strategy;
  stream: boolean;
  synthesis: boolean;
  max_tokens: [number, number];
  temperature: [number, number];
}
