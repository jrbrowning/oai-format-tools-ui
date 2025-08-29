// File: app/components/StreamingViewer.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRootStore } from "@/zustand/rootStore";
import { selectActiveStage } from "@/zustand/selectors/stageSelectors";
import {
  makeStageChatChunksSelector,
  selectStageToolResults,
  selectStageToolSummary,
} from "@/zustand/selectors/streamingStageSelectors";
import { useMemo } from "react";

export function StreamingViewer() {
  const activeStageId = useRootStore(selectActiveStage);

  const chatChunksSelector = useMemo(
    () => makeStageChatChunksSelector(activeStageId.stage_id),
    [activeStageId?.stage_id]
  );
  const toolResultsSelector = useMemo(
    () => selectStageToolResults(activeStageId.stage_id),
    [activeStageId?.stage_id]
  );
  const toolSummarySelector = useMemo(
    () => selectStageToolSummary(activeStageId.stage_id),
    [activeStageId?.stage_id]
  );

  const chatChunks = useRootStore(chatChunksSelector);
  const toolResults = useRootStore(toolResultsSelector);
  const toolSummary = useRootStore(toolSummarySelector);

  const placeholder = (
    <div className="text-sm text-muted-foreground flex items-center gap-1 font-mono">
      <span>Waiting for stream</span>
      <span className="animate-bounce [animation-delay:-0.2s]">.</span>
      <span className="animate-bounce [animation-delay:-0.1s]">.</span>
      <span className="animate-bounce">.</span>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6">
      {/* <CardHeader className="text-lg font-semibold">ToolChain Stream</CardHeader> */}
      <CardContent>
        <div className="mb-4 space-y-1">
          {/* Chat Chunks */}
          <div>
            <Badge variant="default">Streaming Events</Badge>
            <div className="h-44 overflow-auto rounded-md bg-muted p-3 text-sm font-mono border border-muted-foreground/10 min-h-[6rem]">
              {chatChunks?.length > 0 ? (
                <pre className="text-xs whitespace-pre-wrap break-words m-0">
                  {chatChunks
                    .map((chunk) => chunk.choices[0].delta.content ?? "")
                    .join("")}
                </pre>
              ) : (
                placeholder
              )}
            </div>
          </div>

          {/* Tool Results */}
          <div>
            <Badge variant="default">Tool Results</Badge>
            <div className="h-12 overflow-auto rounded-md bg-muted p-3 text-sm font-mono border border-muted-foreground/10 min-h-[6rem]">
              {toolResults?.length > 0 ? (
                <pre className="whitespace-pre-wrap break-words">
                  {toolResults
                    .map((res) => JSON.stringify(res, null, 2))
                    .join("\n\n")}
                </pre>
              ) : (
                placeholder
              )}
            </div>
          </div>

          {/* Tool Summary */}
          <div>
            <Badge variant="default">Tool Summary</Badge>
            <div className="h-12 overflow-auto rounded-md bg-muted p-3 text-sm font-mono border border-muted-foreground/10 min-h-[6rem]">
              {toolSummary?.length > 0 ? (
                <pre className="whitespace-pre-wrap break-words">
                  {toolSummary
                    .map((summary) => JSON.stringify(summary, null, 2))
                    .join("\n\n")}
                </pre>
              ) : (
                placeholder
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
