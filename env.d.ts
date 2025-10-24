/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
