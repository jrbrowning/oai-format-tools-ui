// File: app/components/StreamingViewer.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRootStore } from "@/zustand/rootStore";
import { selectActiveStage } from "@/zustand/selectors/stageSelectors";

// --- ADD: Import completion selectors ---
import {
  selectStageDone as selectCompletionDone,
  selectStageError as selectCompletionError,
  selectFinalText,
  selectFinalToolResults,
} from "@/zustand/selectors/completionStageSelectors";

import "highlight.js/styles/github.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export function CompletionViewer() {
  const activeStage = useRootStore(selectActiveStage);

  // --- ADD: Completion values ---
  const finalText = useRootStore(selectFinalText(activeStage?.stage_id ?? ""));
  const finalToolResults = useRootStore(
    selectFinalToolResults(activeStage?.stage_id ?? "")
  );
  const completionError = useRootStore(
    selectCompletionError(activeStage?.stage_id ?? "")
  );
  const completionDone = useRootStore(
    selectCompletionDone(activeStage?.stage_id ?? "")
  );

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6">
      {/* <CardHeader className="text-lg font-semibold">
        ToolChain Completion
      </CardHeader> */}
      <CardContent>
        <div className="mb-4 space-y-1">
          <Badge variant="default">Completion Content</Badge>
          <div className="rounded-md bg-muted p-3 text-sm min-h-[6rem] prose prose-neutral max-w-none border border-muted-foreground/10">
            {finalText ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc ml-6" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal ml-6" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-primary underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {finalText}
              </ReactMarkdown>
            ) : (
              <div className="flex items-center justify-center text-muted-foreground font-mono text-sm">
                <span className="animate-pulse ml-1">|</span>
                <span className="animate-pulse ml-1">|</span>
                <span className="animate-pulse ml-1">|</span>
                <span> ---- Waiting for response ----</span>
                <span className="animate-pulse ml-1">|</span>
                <span className="animate-pulse ml-1">|</span>
                <span className="animate-pulse ml-1">|</span>
              </div>
            )}
          </div>
        </div>
        {/* --- ADD: Completion fields display --- */}
        <div className="mt-6">
          <div>
            <Badge variant="default">Tool Results</Badge>
            <div className="p-2 bg-muted rounded border min-h-[2rem] text-xs">
              {finalToolResults ? (
                JSON.stringify(finalToolResults, null, 2)
              ) : (
                <span className="opacity-50">—</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
