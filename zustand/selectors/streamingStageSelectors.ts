// File: zustand/selectors/streamingStageSelectors.ts

import type { StageSlice } from "@/zustand/slices/stageSlice";
import type { ChatCompletionChunk } from "openai/resources/chat/completions";

export const makeStageChatChunksSelector =
  (stage_id: string) =>
  (state: StageSlice): ChatCompletionChunk[] =>
    state.stages[stage_id].stream.chunk;

export const selectStageToolResults =
  (stage_id: string) => (state: StageSlice) =>
    state.stages[stage_id].stream.tool_results;

export const selectStageToolSummary =
  (stage_id: string) => (state: StageSlice) =>
    state.stages[stage_id].stream.tool_summary;

export const selectStageDone = (stage_id: string) => (state: StageSlice) =>
  state.stages[stage_id].done;

export const selectStageError = (stage_id: string) => (state: StageSlice) =>
  state.stages[stage_id].error;

export const selectStageCancelled = (stage_id: string) => (state: StageSlice) =>
  state.stages[stage_id].cancelled;
