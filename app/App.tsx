// File: app/App.tsx

import { LLMRequestForm } from "@/components/forms/LLMRequestsForm";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRootStore } from "@/zustand/rootStore";
import { selectStages } from "@/zustand/selectors/stageSelectors";
import { useState } from "react";
import { CompletionViewer } from "./CompletionViewer";
import { StreamingViewer } from "./StreamingViewer";
export default function App() {
  const [tab, setTab] = useState("inputs");

  // Use the selectStages selector to get all stages
  const stages = useRootStore(selectStages);

  // Zustand setter for active stage
  const setActiveStageId = useRootStore((state) => state.setActiveStageId);

  // Current active stageId
  const activeStageId = useRootStore((state) => state.activeStageId);

  const triggerClass =
    "text-xs sm:text-sm px-3 py-1.5 rounded-md border border-transparent data-[state=active]:border-border data-[state=active]:bg-muted data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:font-semibold transition-colors";

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen">
        {/* Header */}
        <header className="mb-2">
          <div className="w-full max-w-13xl mx-auto px-4 sm:px-6">
            <div className="bg-background text-foreground flex items-center justify-between w-full py-2 sm:py-3">
              <h1 className="ml-2 text-lg sm:text-2xl font-bold tracking-tight">
                ToolChain Dashboard
              </h1>
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="w-full max-w-10xl mx-auto px-4 sm:px-6">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-4">
              <TabsList
                className="flex w-full sm:w-auto gap-2 p-0"
                aria-label="Data views"
              >
                <TabsTrigger
                  value="inputs"
                  className={triggerClass}
                  title="Tool inputs"
                >
                  Tool inputs
                </TabsTrigger>
                <TabsTrigger
                  value="streaming"
                  className={triggerClass}
                  title="SSE events"
                >
                  SSE events
                </TabsTrigger>
                <TabsTrigger
                  value="completion"
                  className={triggerClass}
                  title="ToolChain Completion"
                >
                  ToolChain Completion
                </TabsTrigger>
              </TabsList>

              {/* Dropdown for all stages, sets activeStageId */}
              <div className="bg-background text-foreground flex flex-col gap-1 w-full sm:w-auto">
                <label className="text-xs text-muted-foreground pl-1">
                  ToolChain Stages
                </label>
                <Select value={activeStageId} onValueChange={setActiveStageId}>
                  <SelectTrigger
                    className="w-full sm:w-[220px]"
                    aria-label="Stage"
                    title="ToolChain Stages"
                  >
                    <SelectValue placeholder="stages" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-lg border border-border shadow-md rounded-md px-2 py-2.5 text-sm space-y-1 animate-in fade-in duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out">
                    {Object.values(stages).length === 0 ? (
                      <SelectItem disabled value="">
                        No stages
                      </SelectItem>
                    ) : (
                      Object.values(stages).map((stage) => (
                        <SelectItem key={stage.stage_id} value={stage.stage_id}>
                          {stage.stage_id}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="inputs">
              <LLMRequestForm setTab={setTab} />
            </TabsContent>
            <TabsContent value="streaming">
              <StreamingViewer />
            </TabsContent>
            <TabsContent value="completion">
              <CompletionViewer />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
}
