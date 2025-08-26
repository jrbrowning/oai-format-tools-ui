// File: components/LLMRequestForm.tsx

"use client";

import {
  dispatchToolChainCompletion,
  dispatchToolChainStreaming,
} from "@/lib/toolchainDispatcher";
import { useRootStore } from "@/zustand/rootStore";

import { TupleInputField } from "@/components/forms/TupleInputField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { ModelKey } from "@/lib/constants";
import { modelOptions } from "@/lib/constants";
import type { LLMRequest } from "@/types/llmRequest";
import { Strategy } from "@/types/llmRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

// --- Zod Schema ---
const schema = z.object({
  stage_id: z.string().uuid(),
  system_prompt: z.string().min(1),
  user_prompt: z.string().min(1),
  model_container: z.custom<ModelKey>(),
  stream: z.boolean(),
  synthesis: z.boolean(),
  max_tokens: z.tuple([z.number(), z.number()]),
  temperature: z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)]),
  strategy: z.nativeEnum(Strategy),
});

export function LLMRequestForm({ setTab }: { setTab: (tab: string) => void }) {
  const activeStageId = useRootStore((s) => s.activeStageId);
  const currentRequest = useRootStore((s) => s.llmRequests[activeStageId]);
  const addStage = useRootStore((s) => s.addStage);
  const removeStage = useRootStore((s) => s.removeStage);
  const setLLMRequest = useRootStore((s) => s.setLLMRequest);
  const removeLLMRequest = useRootStore((s) => s.removeLLMRequest);
  const stageCount = useRootStore((s) => Object.keys(s.stages).length);

  function getDefaultLLMRequest(stage_id: string): z.infer<typeof schema> {
    return {
      stage_id,
      system_prompt:
        "You are a weather assistant who answers location-based weather queries. When a user requests information about the weather in a location, convert the city name to coordinates, call the `get_weather` tool with the latitude and longitude, and return the result.After the tool call, summarize the weather condition using simple, factual language. Avoid making predictions or interpretations not supported by the data. Only respond with information directly derived from the tool output or coordinates.",
      user_prompt: "what is the weather today in Washington, DC?",
      model_container: "local_gpu",
      stream: false,
      max_tokens: [1024, 1024],
      temperature: [0.0, 0.0],
      strategy: Strategy.ChatCompletion,
      synthesis: false,
    };
  }

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: currentRequest ?? getDefaultLLMRequest(activeStageId),
    values: currentRequest,
  });

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    if (!watchedValues.stage_id) return;
    const updated = {
      ...watchedValues,
      synthesis: watchedValues.strategy === Strategy.Synthesis,
    };
    setLLMRequest(watchedValues.stage_id, updated as LLMRequest);
  }, [watchedValues]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const currentStageId = useRootStore.getState().activeStageId;
    const updatedValues: LLMRequest = {
      ...values,
      stage_id: currentStageId,
      synthesis: values.strategy === Strategy.Synthesis,
    };

    setLLMRequest(values.stage_id, updatedValues);
    setTab(values.stream ? "streaming" : "completion");

    if (values.stream) {
      await dispatchToolChainStreaming(values.stage_id);
    } else {
      await dispatchToolChainCompletion(values.stage_id);
    }
  };

  const handleResetStage = () => {
    const defaultValues = getDefaultLLMRequest(activeStageId);
    form.reset(defaultValues);
    setLLMRequest(activeStageId, defaultValues);
  };

  const handleAddStage = () => {
    const newStageId = uuidv4();
    addStage(newStageId);
    useRootStore.getState().setActiveStageId(newStageId);
  };

  const handleRemoveStage = () => {
    removeStage(activeStageId);
    useRootStore.getState().setActiveStageId("");
    removeLLMRequest(activeStageId);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6">
      <CardHeader className="flex items-center justify-end">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleAddStage}>
            + Add Stage
          </Button>
          <Button
            variant="destructive"
            disabled={stageCount <= 1}
            onClick={handleRemoveStage}
          >
            - Remove Stage
          </Button>
          <Button variant="outline" onClick={handleResetStage}>
            Reset Stage
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="system_prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="w-full h-16 overflow-auto rounded-md border border-input bg-background px-2 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user_prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you want to know? (User Prompt)</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="w-full h-10d overflow-auto rounded-md border border-input bg-background px-2 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model_container"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name (Version)</FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full border rounded px-2 py-1"
                    >
                      {modelOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="strategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strategy</FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="">None</option>
                      {Object.entries(Strategy).map(([k, v]) => (
                        <option key={k} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TupleInputField
              name="max_tokens"
              labelLeft="Tool Max Tokens"
              labelRight="Synthesis Max Tokens"
              disabledRight={watchedValues?.strategy !== Strategy.Synthesis}
            />
            <TupleInputField
              name="temperature"
              labelLeft="Tool Temperature"
              labelRight="Synthesis Temperature"
              step={0.1}
              disabledRight={watchedValues?.strategy !== Strategy.Synthesis}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="stream"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-8 pb-2">
                      <FormLabel>Stream</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
