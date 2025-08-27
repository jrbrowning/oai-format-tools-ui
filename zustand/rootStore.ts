// File: zustand/rootStore.ts
import type { StageHttpCompletionEvent } from "@/types/llmResponse";
import type { SSEEvent } from "@/types/sseEvents";
import { createDefaultStage } from "@/zustand/utils/createDefaultStage";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  CompletionStageSlice,
  createCompletionStageSlice,
} from "./slices/completionStageSlice";
import {
  createLLMRequestSlice,
  LLMRequestSlice,
} from "./slices/llmRequestSlice";
import type { StageRecord, StageSlice } from "./slices/stageSlice";
import {
  createStreamingStageSlice,
  StreamingStageSlice,
} from "./slices/streamingStageSlice";

import {
  createStageOrganizerSlice,
  StageOrganizerSlice,
} from "./slices/stageOrganizerSlice";

export type RootStore = StageSlice &
  StreamingStageSlice &
  CompletionStageSlice &
  LLMRequestSlice &
  StageOrganizerSlice & {
    activeStageId: string;
    setActiveStageId: (id: string) => void;
    dispatchStreaming: (event: SSEEvent) => void;
    dispatchCompletion: (event: StageHttpCompletionEvent) => void;
  };

const initialStageId = uuidv4();

export const useRootStore = create<RootStore>()(
  devtools(
    immer((set, get, store) => ({
      stages: {
        [initialStageId]: createDefaultStage(initialStageId), // FIX: always present!
      } as Record<string, StageRecord>,

      ...createStreamingStageSlice<RootStore>()(set, get, store),
      ...createCompletionStageSlice<RootStore>()(set, get, store),
      ...createLLMRequestSlice<RootStore>()(set, get, store),
      ...createStageOrganizerSlice<RootStore>()(set, get, store),

      activeStageId: initialStageId,

      setActiveStageId: (id: string) =>
        set((state) => {
          state.activeStageId = id;
        }),

      dispatchStreaming(event) {
        get().handleStageEvent(event);
      },

      dispatchCompletion(event) {
        switch (event.type) {
          case "text":
            get().handleTextOutput(event);
            break;
          case "tool_results":
            get().handleToolOutput(event);
            break;
          case "error":
            get().handleStageError(event);
            break;
          default:
            console.warn("Unhandled completion event:", event);
        }
      },
    })),
    { name: "RootStore" } // ← name for devtools
  )
);
