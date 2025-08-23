// File: zustand/slices/completionStageSlice.ts

import type {
  CompletionErrorOutput,
  StageHttpTextOutput,
  StageHttpToolCallOutput,
} from "@/types/llmResponse";
import { createDefaultStage } from "@/zustand/utils/createDefaultStage"; // <-- Import canonical utility
import type { StateCreator } from "zustand";
import type { StageSlice } from "./stageSlice";

export interface CompletionStageSlice {
  handleTextOutput: (output: StageHttpTextOutput) => void;
  handleToolOutput: (output: StageHttpToolCallOutput) => void;
  handleStageError: (output: CompletionErrorOutput) => void;
}

export const createCompletionStageSlice =
  <T extends StageSlice>(): StateCreator<
    T,
    [["zustand/immer", never]],
    [],
    CompletionStageSlice
  > =>
  (set) => ({
    handleTextOutput(output) {
      const { stage_id, text, status } = output;
      set((state) => {
        // Always fully initialize stage if missing
        const stage = (state.stages[stage_id] ??= createDefaultStage(stage_id));
        stage.completion.text = text ?? "";
        stage.done = status.state === "success";
        if (status.state === "failed") {
          stage.error = status.message ?? "unknown error";
        }
      });
    },

    handleToolOutput(output) {
      const { stage_id, tool_results, status } = output;
      set((state) => {
        const stage = (state.stages[stage_id] ??= createDefaultStage(stage_id));
        stage.completion.tool_results = tool_results ?? {};
        stage.done = status.state === "success";
        if (status.state === "failed") {
          stage.error = status.message ?? "unknown error";
        }
      });
    },

    handleStageError(output) {
      const { stage_id, message } = output;
      set((state) => {
        const stage = (state.stages[stage_id] ??= createDefaultStage(stage_id));
        stage.error = message;
        stage.done = true;
      });
    },
  });
