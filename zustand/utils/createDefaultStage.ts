import { StageRecord } from "../slices/stageSlice";

export function createDefaultStage(stage_id: string): StageRecord {
  return {
    stage_id,
    stream: { chunk: [], tool_results: [], tool_summary: [] },
    completion: { text: "", tool_results: {} },
    done: false,
    error: undefined,
    cancelled: false,
  };
}
