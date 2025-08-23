// File: zustand/selectors/llmRequestSelectors.ts

import type { LLMRequest } from "@/types/llmRequest";
import type { RootStore } from "@/zustand/rootStore";

/**
 * Select all LLM requests.
 */
export const selectLLMRequests = (
  state: RootStore
): Record<string, LLMRequest> => state.llmRequests;

/**
 * Select LLM request by stage id.
 */
export const selectLLMRequestByStageId =
  (stageId: string) =>
  (state: RootStore): LLMRequest | undefined =>
    state.llmRequests[stageId];
