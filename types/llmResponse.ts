// File: /types/llmResponse.ts
export type TextStageOutput = {
  stage_id: string;
  type: "text";
  text?: string;
};

export type ToolStageOutput = {
  stage_id: string;
  type: "tool_results";
  tool_results?: Record<string, string>;
};

export type CompletionErrorOutput = {
  stage_id: string;
  type: "error";
  message: string;
};

export type StageInfo = {
  state: "idle" | "executing" | "success" | "failed";
  code?: string;
  message?: string;
  request_latency_ms?: number;
  execution_latency_ms?: number;
  upstream_latency_ms?: number;
};

export type StageHttpTextOutput = TextStageOutput & {
  status: StageInfo;
};

export type StageHttpToolCallOutput = ToolStageOutput & {
  status: StageInfo;
};

export type StageHttpCompletionErrorOutput = CompletionErrorOutput & {
  status: StageInfo;
};

// Union of all possible completion response types:
export type StageHttpCompletionEvent =
  | StageHttpTextOutput
  | StageHttpToolCallOutput
  | StageHttpCompletionErrorOutput;
