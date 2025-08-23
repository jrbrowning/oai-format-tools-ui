

export const MODEL_MAP = {
  traditional: import.meta.env.VITE_TRADITIONAL_MODEL || "",
  traditional_alt: import.meta.env.VITE_TRADITIONAL_MODEL_ALT || "",
  reasoning: import.meta.env.VITE_REASONING_MODEL || "",
  reasoning_alt: import.meta.env.VITE_REASONING_MODEL_ALT || "",
  local_gpu: import.meta.env.VITE_LOCAL_GPU || "",
} as const;

export type ModelKey = keyof typeof MODEL_MAP;

export const modelOptions = Object.entries(MODEL_MAP).map(([key, value]) => ({
  label: `${key} (${value})`,
  value: key as ModelKey,
}));
