// File: zustand/slices/llmRequestSlice.ts

import type { LLMRequest } from "@/types/llmRequest";

export interface LLMRequestSlice {
  llmRequests: Record<string, LLMRequest>;
  setLLMRequest: (stage_id: string, req: LLMRequest) => void;
  removeLLMRequest: (stage_id: string) => void;
}

export const createLLMRequestSlice =
  <T>() =>
  (set: any, get: any, _store?: any): LLMRequestSlice => ({
    llmRequests: {},
    setLLMRequest: (stage_id, req) =>
      set((state: T & LLMRequestSlice) => {
        state.llmRequests[stage_id] = req;
      }),
    removeLLMRequest: (stage_id) =>
      set((state: T & LLMRequestSlice) => {
        delete state.llmRequests[stage_id];
      }),
  });
