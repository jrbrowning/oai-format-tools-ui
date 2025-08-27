// File: zustand/slices/stageSlice.ts

import { ChatCompletionChunk } from "openai/resources/chat/completions";

export interface StageRecord {
  stage_id: string;

  // Streaming state
  stream: {
    chunk: ChatCompletionChunk[];
    tool_results: ChatCompletionChunk[];
    tool_summary: any[];
  };
  // Completion state
  completion: {
    text: string;
    tool_results: Record<string, string>;
  };
  // Status flags
  done?: boolean;
  error?: string;
  cancelled?: boolean;
}

// StageSlice: contains only the stages map, shared by all slices
export interface StageSlice {
  stages: Record<string, StageRecord>;
}
