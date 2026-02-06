import { BaseHandler } from './base.js';
import { TOOL_CONFIGS } from '../config/presets.js';

/**
 * Codex 配置处理器
 */
export class CodexHandler extends BaseHandler {
  constructor() {
    super(TOOL_CONFIGS.codex);
  }

  async applyConfig(url: string, apiKey: string): Promise<void> {
    await this.ensureConfigDir();

    // 处理 config.toml
    const configFile = this.config.files[0];
    let config = await this.readFile(configFile.path, configFile.type);

    if (!config) {
      // 深拷贝模板
      config = JSON.parse(JSON.stringify(configFile.template));
    }

    // 确保结构存在
    if (!config.model_providers) {
      config.model_providers = {};
    }
    if (!config.model_providers.fox) {
      config.model_providers.fox = JSON.parse(
        JSON.stringify(configFile.template.model_providers.fox)
      );
    }
    
    config.model_providers.fox.base_url = url;

    await this.writeFile(configFile.path, configFile.type, config);

    // 处理 auth.json
    const authFile = this.config.files[1];
    const auth = {
      OPENAI_API_KEY: apiKey,
    };

    await this.writeFile(authFile.path, authFile.type, auth);
  }
}
