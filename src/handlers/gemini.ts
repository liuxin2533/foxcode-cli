import { BaseHandler } from './base.js';
import { TOOL_CONFIGS } from '../config/presets.js';

/**
 * Gemini CLI 配置处理器
 */
export class GeminiHandler extends BaseHandler {
  constructor() {
    super(TOOL_CONFIGS.gemini);
  }

  async applyConfig(url: string, apiKey: string): Promise<void> {
    await this.ensureConfigDir();

    // 处理 .env
    const envFile = this.config.files[0];
    let envData = await this.readFile(envFile.path, envFile.type);

    if (!envData || Object.keys(envData).length === 0) {
      // 深拷贝模板
      envData = { ...envFile.template };
    }

    envData.GOOGLE_GEMINI_BASE_URL = url;
    envData.GEMINI_API_KEY = apiKey;
    // 保留 GEMINI_MODEL 如果已存在
    if (!envData.GEMINI_MODEL) {
      envData.GEMINI_MODEL = envFile.template.GEMINI_MODEL;
    }

    await this.writeFile(envFile.path, envFile.type, envData);

    // 处理 settings.json（固定值）
    const settingsFile = this.config.files[1];
    let settings = await this.readFile(settingsFile.path, settingsFile.type);

    if (!settings) {
      settings = JSON.parse(JSON.stringify(settingsFile.template));
    }

    await this.writeFile(settingsFile.path, settingsFile.type, settings);
  }
}
