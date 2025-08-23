// File: zustand/selectors/stageSelectors.ts

import type { RootStore } from "@/zustand/rootStore";
import type { StageRecord } from "@/zustand/slices/stageSlice";

/**
 * Select the entire stages map.
 */
export const selectStages = (state: RootStore): Record<string, StageRecord> =>
  state.stages;

/**
 * Select a single stage by id.
 */
export const selectStageById =
  (stageId: string) =>
  (state: RootStore): StageRecord | undefined =>
    state.stages[stageId];

/**
 * Select the active stage record, if set.
 */
export const selectActiveStage = (state: RootStore): StageRecord => {
  return state.stages[state.activeStageId];
};

/**
 * Select error message for a given stage.
 */
export const selectStageError =
  (stageId: string) =>
  (state: RootStore): string | undefined =>
    state.stages[stageId].error;

/**
 * Select all finished stages.
 */
export const selectFinishedStages = (state: RootStore): StageRecord[] =>
  Object.values(state.stages).filter((stage) => stage.done);

/**
 * Select all currently streaming stages (not done/cancelled).
 */
export const selectActiveStreamingStages = (state: RootStore): StageRecord[] =>
  Object.values(state.stages).filter(
    (stage) =>
      !stage.done &&
      !stage.cancelled &&
      (stage.stream.chunk !== undefined ||
        stage.stream.tool_results !== undefined)
  );
