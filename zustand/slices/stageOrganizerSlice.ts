// File: zustand/slices/stageOrganizerSlice.ts

import { createDefaultStage } from "@/zustand/utils/createDefaultStage";
import type { StateCreator } from "zustand";
import type { StageSlice } from "./stageSlice";

export interface StageOrganizerSlice {
  addStage: (stage_id: string) => void;
  removeStage: (stage_id: string) => void;
  resetStages: () => void;
}

export const createStageOrganizerSlice =
  <T extends StageSlice>(): StateCreator<
    T,
    [["zustand/immer", never]],
    [],
    StageOrganizerSlice
  > =>
  (set) => ({
    addStage: (stage_id) =>
      set((state) => {
        state.stages[stage_id] = createDefaultStage(stage_id);
      }),
    removeStage: (stage_id) =>
      set((state) => {
        delete state.stages[stage_id];
      }),
    resetStages: () =>
      set((state) => {
        state.stages = {};
      }),
    // removeStageAndReinit: (stage_id: string) => {
    //   const newId = uuidv4();
    //   set((state) => {
    //     const stageKeys = Object.keys(state.stages);
    //     if (stageKeys.length <= 1) return; // ⛔ prevent deleting last stage

    //     delete state.stages[stage_id];
    //     state.stages[newId] = createDefaultStage(newId);
    //     (state as any).activeStageId = newId;
    //   });
    //   return newId;
    // },
  });
