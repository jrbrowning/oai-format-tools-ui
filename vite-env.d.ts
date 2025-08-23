// File: vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOCAL_GPU: string;
  readonly VITE_TRADITIONAL_MODEL: string;
  readonly VITE_TRADITIONAL_MODEL_ALT: string;
  readonly VITE_REASONING_MODEL: string;
  readonly VITE_REASONING_MODEL_ALT: string;
  // Add more if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
