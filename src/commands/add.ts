import inquirer from 'inquirer';
import ora from 'ora';
import { configStore } from '../config/store.js';
import { TOOL_CONFIGS } from '../config/presets.js';
import { CliTool, ConfigProfile } from '../config/types.js';
import { getHandler } from '../handlers/index.js';
import { logger } from '../utils/logger.js';
import { validator } from '../utils/validator.js';

/**
 * 添加配置命令
 */
export async function addCommand(): Promise<void> {
  try {
    logger.title('📝 添加新配置');
    logger.newLine();

    // 1. 选择 CLI 工具
    const { tool } = await inquirer.prompt<{ tool: CliTool }>([
      {
        type: 'list',
        name: 'tool',
        message: '选择 CLI 工具:',
        choices: [
          { name: '🤖 Claude Code', value: 'claude' },
          { name: '💻 Codex', value: 'codex' },
          { name: '✨ Gemini CLI', value: 'gemini' },
        ],
      },
    ]);

    const toolConfig = TOOL_CONFIGS[tool];

    // 2. 输入配置名称
    const { name } = await inquirer.prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: '配置名称:',
        validate: (input: string) => {
          const trimmed = input.trim();
          if (!trimmed) {
            return '配置名称不能为空';
          }
          if (!validator.isValidName(trimmed)) {
            return '配置名称只能包含字母、数字、下划线和连字符';
          }
          const normalized = validator.normalizeName(trimmed);
          const existing = configStore.getProfile(normalized);
          if (existing) {
            return `配置 "${normalized}" 已存在，请使用其他名称`;
          }
          return true;
        },
      },
    ]);

    const normalizedName = validator.normalizeName(name.trim());

    // 3. 选择或输入 URL
    let url: string;
    const urlPresets = toolConfig.urlPresets;

    if (urlPresets.length === 2 && urlPresets[1].value === 'custom') {
      // 只有一个预设 + 自定义选项，直接询问是否使用默认
      const { useDefault } = await inquirer.prompt<{ useDefault: boolean }>([
        {
          type: 'confirm',
          name: 'useDefault',
          message: `使用默认 URL (${urlPresets[0].value})?`,
          default: true,
        },
      ]);

      if (useDefault) {
        url = urlPresets[0].value;
      } else {
        const { customUrl } = await inquirer.prompt<{ customUrl: string }>([
          {
            type: 'input',
            name: 'customUrl',
            message: '请输入自定义 URL:',
            validate: (input: string) => {
              const trimmed = input.trim();
              if (!trimmed) {
                return 'URL 不能为空';
              }
              if (!validator.isValidUrl(trimmed)) {
                return 'URL 格式无效，必须以 http:// 或 https:// 开头';
              }
              return true;
            },
          },
        ]);
        url = validator.normalizeUrl(customUrl.trim());
      }
    } else {
      // 多个预设，显示选择列表
      const { selectedUrl } = await inquirer.prompt<{ selectedUrl: string }>([
        {
          type: 'list',
          name: 'selectedUrl',
          message: '选择 URL:',
          choices: urlPresets.map((preset) => ({
            name: `${preset.label} ${preset.value !== 'custom' ? `(${preset.value})` : ''}`,
            value: preset.value,
          })),
        },
      ]);

      if (selectedUrl === 'custom') {
        const { customUrl } = await inquirer.prompt<{ customUrl: string }>([
          {
            type: 'input',
            name: 'customUrl',
            message: '请输入自定义 URL:',
            validate: (input: string) => {
              const trimmed = input.trim();
              if (!trimmed) {
                return 'URL 不能为空';
              }
              if (!validator.isValidUrl(trimmed)) {
                return 'URL 格式无效，必须以 http:// 或 https:// 开头';
              }
              return true;
            },
          },
        ]);
        url = validator.normalizeUrl(customUrl.trim());
      } else {
        url = selectedUrl;
      }
    }

    // 4. 输入 API Key
    const { apiKey } = await inquirer.prompt<{ apiKey: string }>([
      {
        type: 'password',
        name: 'apiKey',
        message: 'API Key:',
        mask: '*',
        validate: (input: string) => {
          const trimmed = input.trim();
          if (!trimmed) {
            return 'API Key 不能为空';
          }
          if (!validator.isValidApiKey(trimmed)) {
            return 'API Key 格式无效（至少 10 个字符，不能包含空格）';
          }
          return true;
        },
      },
    ]);

    // 5. 保存配置
    const spinner = ora('正在保存配置...').start();

    try {
      const profile: ConfigProfile = {
        name: normalizedName,
        tool,
        url,
        apiKey: apiKey.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      configStore.addProfile(profile);

      spinner.succeed('配置已保存');

      // 6. 询问是否立即应用
      const { applyNow } = await inquirer.prompt<{ applyNow: boolean }>([
        {
          type: 'confirm',
          name: 'applyNow',
          message: '是否立即应用此配置?',
          default: true,
        },
      ]);

      if (applyNow) {
        const applySpinner = ora('正在应用配置...').start();
        try {
          const handler = getHandler(tool);
          await handler.applyConfig(url, apiKey.trim());
          configStore.setCurrentProfile(tool, normalizedName);
          applySpinner.succeed('配置已应用');
        } catch (error) {
          applySpinner.fail('应用配置失败');
          throw error;
        }
      }

      logger.newLine();
      logger.success(`配置 "${normalizedName}" 已添加成功！`);
      logger.info(`使用 "foxcode use ${normalizedName}" 可以随时切换到此配置`);
    } catch (error) {
      spinner.fail('保存配置失败');
      throw error;
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`添加配置失败: ${error.message}`);
    }
    process.exit(1);
  }
}
