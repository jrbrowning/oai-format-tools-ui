// File: store/selectors/completionStageSelectors.ts

import type { StageSlice } from "@/zustand/slices/stageSlice";

// 1. Get stage by stage_id
export const selectStageById = (stage_id: string) => (state: StageSlice) =>
  state.stages[stage_id];

// 2. Get final_text by stage_id
export const selectFinalText = (stage_id: string) => (state: StageSlice) =>
  state.stages[stage_id]?.completion.text;

// 3. Get tool_results by stage_id
export const selectFinalToolResults =
  (stage_id: string) => (state: StageSlice) =>
    state.stages[stage_id]?.completion.tool_results;

// 4. Get error by stage_id
export const selectStageError = (stage_id: string) => (state: StageSlice) =>
  state.stages[stage_id]?.error;

// 5. Get done status by stage_id
export const selectStageDone = (stage_id: string) => (state: StageSlice) =>
  state.stages[stage_id]?.done;
