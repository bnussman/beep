/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_GOOGLE_API_KEY: string;
  ENVIRONMENT_NAME: 'preview' | 'production' | undefined;
}
