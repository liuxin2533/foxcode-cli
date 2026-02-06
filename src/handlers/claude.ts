import { BaseHandler } from './base.js';
import { TOOL_CONFIGS } from '../config/presets.js';

/**
 * Claude Code 配置处理器
 */
export class ClaudeHandler extends BaseHandler {
  constructor() {
    super(TOOL_CONFIGS.claude);
  }

  async applyConfig(url: string, apiKey: string): Promise<void> {
    await this.ensureConfigDir();

    // 处理 settings.json
    const settingsFile = this.config.files[0];
    let settings = await this.readFile(settingsFile.path, settingsFile.type);

    if (!settings) {
      // 深拷贝模板，避免修改原始对象
      settings = JSON.parse(JSON.stringify(settingsFile.template));
    }

    // 确保 env 对象存在
    if (!settings.env) {
      settings.env = {};
    }

    settings.env.ANTHROPIC_BASE_URL = url;
    settings.env.ANTHROPIC_AUTH_TOKEN = apiKey;
    settings.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = 1;

    await this.writeFile(settingsFile.path, settingsFile.type, settings);

    // 处理 config.json（固定值）
    const configFile = this.config.files[1];
    let config = await this.readFile(configFile.path, configFile.type);

    if (!config) {
      config = JSON.parse(JSON.stringify(configFile.template));
    }

    await this.writeFile(configFile.path, configFile.type, config);
  }
}
