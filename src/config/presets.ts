import { ToolConfig } from './types.js';
import os from 'os';
import path from 'path';

const homeDir = os.homedir();

/**
 * CLI 工具配置
 */
export const TOOL_CONFIGS: Record<string, ToolConfig> = {
  claude: {
    name: 'claude',
    displayName: 'Claude Code',
    configDir: path.join(homeDir, '.claude'),
    files: [
      {
        path: path.join(homeDir, '.claude', 'settings.json'),
        type: 'json',
        template: {
          env: {
            ANTHROPIC_AUTH_TOKEN: '',
            ANTHROPIC_BASE_URL: '',
            CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: 1,
          },
          permissions: {
            allow: [],
            deny: [],
          },
        },
      },
      {
        path: path.join(homeDir, '.claude', 'config.json'),
        type: 'json',
        template: {
          primaryApiKey: 'fox',
        },
      },
    ],
    urlPresets: [
      { label: '官方满血', value: 'https://code.newcli.com/claude' },
      { label: 'Super特价', value: 'https://code.newcli.com/claude/super' },
      { label: 'Ultra特价', value: 'https://code.newcli.com/claude/ultra' },
      { label: 'AWS特价', value: 'https://code.newcli.com/claude/aws' },
      { label: 'AWS特价(思考)', value: 'https://code.newcli.com/claude/droid' },
      { label: '自定义 URL', value: 'custom' },
    ],
  },
  codex: {
    name: 'codex',
    displayName: 'Codex',
    configDir: path.join(homeDir, '.codex'),
    files: [
      {
        path: path.join(homeDir, '.codex', 'config.toml'),
        type: 'toml',
        template: {
          model_provider: 'fox',
          model: 'gpt-5',
          model_reasoning_effort: 'high',
          disable_response_storage: true,
          model_providers: {
            fox: {
              name: 'fox',
              base_url: '',
              wire_api: 'responses',
              requires_openai_auth: true,
            },
          },
        },
      },
      {
        path: path.join(homeDir, '.codex', 'auth.json'),
        type: 'json',
        template: {
          OPENAI_API_KEY: '',
        },
      },
    ],
    urlPresets: [
      { label: '官方满血', value: 'https://code.newcli.com/codex/v1' },
      { label: '自定义 URL', value: 'custom' },
    ],
  },
  gemini: {
    name: 'gemini',
    displayName: 'Gemini CLI',
    configDir: path.join(homeDir, '.gemini'),
    files: [
      {
        path: path.join(homeDir, '.gemini', '.env'),
        type: 'env',
        template: {
          GOOGLE_GEMINI_BASE_URL: '',
          GEMINI_API_KEY: '',
          GEMINI_MODEL: 'gemini-3-pro-preview',
        },
      },
      {
        path: path.join(homeDir, '.gemini', 'settings.json'),
        type: 'json',
        template: {
          ide: {
            enabled: true,
          },
          security: {
            auth: {
              selectedType: 'gemini-api-key',
            },
          },
        },
      },
    ],
    urlPresets: [
      { label: '官方满血', value: 'https://code.newcli.com/gemini' },
      { label: '自定义 URL', value: 'custom' },
    ],
  },
};
