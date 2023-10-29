declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NOTION_TOKEN?: string
      }
    }
  }
}