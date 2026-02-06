import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { configStore } from '../config/store.js';
import { TOOL_CONFIGS } from '../config/presets.js';
import { ConfigProfile } from '../config/types.js';
import { getHandler } from '../handlers/index.js';
import { logger } from '../utils/logger.js';
import { validator } from '../utils/validator.js';
import { promptUrlSelection } from '../utils/prompts.js';

/**
 * 编辑配置命令
 */
export async function editCommand(name?: string): Promise<void> {
  try {
    const profiles = configStore.getAllProfiles();

    if (profiles.length === 0) {
      logger.warn('还没有任何配置，快来添加一个吧！');
      logger.info(`运行 ${chalk.cyan('foxcode add')} 开始添加配置`);
      return;
    }

    let selectedName = name;

    // 如果没有指定名称，显示交互式选择
    if (!selectedName) {
      const choices = profiles.map((profile) => {
        const toolConfig = TOOL_CONFIGS[profile.tool];
        return {
          name: `[${toolConfig.displayName}] ${profile.name} - ${profile.url}`,
          value: profile.name,
        };
      });

      const { selected } = await inquirer.prompt<{ selected: string }>([
        {
          type: 'list',
          name: 'selected',
          message: '选择要编辑的配置:',
          choices,
          pageSize: 15,
        },
      ]);

      selectedName = selected;
    }

    // 查找配置
    const profile = configStore.getProfile(selectedName);

    if (!profile) {
      logger.error(`配置 "${selectedName}" 不存在`);
      logger.info(`运行 ${chalk.cyan('foxcode ls')} 查看所有已保存的配置`);
      process.exit(1);
    }

    const toolConfig = TOOL_CONFIGS[profile.tool];

    logger.title(`📝 编辑配置: ${profile.name}`);
    logger.newLine();
    logger.info(`工具: ${toolConfig.displayName}`);
    logger.info(`当前 URL: ${profile.url}`);
    logger.info(`当前 API Key: ${validator.maskApiKey(profile.apiKey)}`);
    logger.newLine();

    // 选择要编辑的字段
    const { fields } = await inquirer.prompt<{ fields: string[] }>([
      {
        type: 'checkbox',
        name: 'fields',
        message: '选择要修改的字段:',
        choices: [
          { name: 'URL', value: 'url', checked: false },
          { name: 'API Key', value: 'apiKey', checked: false },
        ],
        validate: (input: string[]) => {
          if (input.length === 0) {
            return '请至少选择一个字段';
          }
          return true;
        },
      },
    ]);

    let newUrl = profile.url;
    let newApiKey = profile.apiKey;

    // 编辑 URL
    if (fields.includes('url')) {
      const result = await promptUrlSelection(toolConfig.urlPresets, profile.url);
      if (result !== null) {
        newUrl = result;
      }
    }

    // 编辑 API Key
    if (fields.includes('apiKey')) {
      const { changeApiKey } = await inquirer.prompt<{ changeApiKey: boolean }>([
        {
          type: 'confirm',
          name: 'changeApiKey',
          message: '确认修改 API Key?',
          default: true,
        },
      ]);

      if (changeApiKey) {
        const { apiKey } = await inquirer.prompt<{ apiKey: string }>([
          {
            type: 'password',
            name: 'apiKey',
            message: '请输入新的 API Key:',
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
        newApiKey = apiKey.trim();
      }
    }

    // 检查是否有变化
    if (newUrl === profile.url && newApiKey === profile.apiKey) {
      logger.info('配置未发生变化');
      return;
    }

    // 保存更新
    const spinner = ora('正在保存配置...').start();

    try {
      const updatedProfile: ConfigProfile = {
        ...profile,
        url: newUrl,
        apiKey: newApiKey,
        updatedAt: new Date().toISOString(),
      };

      configStore.addProfile(updatedProfile);

      spinner.succeed('配置已保存');

      // 询问是否立即应用
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
          const handler = getHandler(profile.tool);
          await handler.applyConfig(newUrl, newApiKey);
          configStore.setCurrentProfile(profile.tool, profile.name);
          applySpinner.succeed('配置已应用');
        } catch (error) {
          applySpinner.fail('应用配置失败');
          throw error;
        }
      }

      const changes: string[] = [];
      if (newUrl !== profile.url) {
        changes.push(`${chalk.bold('URL')}     ${chalk.gray(profile.url)} → ${newUrl}`);
      }
      if (newApiKey !== profile.apiKey) {
        changes.push(`${chalk.bold('API Key')} 已更新`);
      }

      const boxContent = [
        `${chalk.bold('配置')}    ${profile.name}`,
        `${chalk.bold('工具')}    ${toolConfig.displayName}`,
        ...changes,
      ].join('\n');

      logger.box(boxContent, { title: '配置编辑成功', type: 'success' });
    } catch (error) {
      spinner.fail('保存配置失败');
      throw error;
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`编辑配置失败: ${error.message}`);
    }
    process.exit(1);
  }
}
