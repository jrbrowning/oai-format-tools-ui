// File: zustand/slices/streamingStageSlice.ts

import type { SSEEvent } from "@/types/sseEvents";
import { createDefaultStage } from "@/zustand/utils/createDefaultStage"; // <-- Use canonical import
import type { StateCreator } from "zustand";
import type { StageSlice } from "./stageSlice";

export interface StreamingStageSlice {
  handleStageEvent: (event: SSEEvent) => void;
}

export const createStreamingStageSlice =
  <T extends StageSlice>(): StateCreator<
    T,
    [["zustand/immer", never]],
    [],
    StreamingStageSlice
  > =>
  (set) => ({
    handleStageEvent(event) {
      const { stage_id } = event.data;
      set((state) => {
        // Always fully initialize stage with canonical creator
        const stage = (state.stages[stage_id] ??= createDefaultStage(stage_id));

        switch (event.event) {
          case "chat_completion_chunk":
            if ("chunk" in event.data) {
              // Use new array reference, avoid in-place mutation
              const chunkArr = stage.stream.chunk ?? [];
              stage.stream.chunk = chunkArr.concat([event.data.chunk]);
            }
            break;

          case "tool_completion_chunk":
            if ("tool_results" in event.data) {
              const chunkArr = stage.stream.tool_results ?? [];
              stage.stream.tool_results = chunkArr.concat([
                event.data.tool_results,
              ]);
            }
            break;

          case "tool_summary":
            if ("tool_summary" in event.data) {
              const chunkArr = stage.stream.tool_summary ?? [];
              stage.stream.tool_summary = chunkArr.concat([
                event.data.tool_summary,
              ]);
            }
            break;

          case "done":
            stage.done = true;
            break;

          case "error":
            if ("error" in event.data) {
              stage.error = event.data.error;
            }
            break;

          case "cancel":
            stage.cancelled = true;
            break;
        }
      });
    },
  });
