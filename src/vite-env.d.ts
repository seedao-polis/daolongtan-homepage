/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 可选：Authorization Bearer，用于需登录的 OpenAPI */
  readonly VITE_API_BEARER_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
