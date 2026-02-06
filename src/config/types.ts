/**
 * CLI 工具类型
 */
export type CliTool = 'claude' | 'codex' | 'gemini';

/**
 * 配置项
 */
export interface ConfigProfile {
  name: string;
  tool: CliTool;
  url: string;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 存储的配置数据
 */
export interface StoreData {
  profiles: ConfigProfile[];
  current: {
    claude?: string;
    codex?: string;
    gemini?: string;
  };
}

/**
 * URL 预设项
 */
export interface UrlPreset {
  label: string;
  value: string;
}

/**
 * CLI 工具配置
 */
export interface ToolConfig {
  name: string;
  displayName: string;
  configDir: string;
  files: {
    path: string;
    type: 'json' | 'toml' | 'env';
    template: any;
  }[];
  urlPresets: UrlPreset[];
}
