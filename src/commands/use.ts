import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { configStore } from '../config/store.js';
import { getHandler } from '../handlers/index.js';
import { logger } from '../utils/logger.js';
import { TOOL_CONFIGS } from '../config/presets.js';

/**
 * 切换配置命令
 */
export async function useCommand(name?: string): Promise<void> {
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
        const currentProfile = configStore.getCurrentProfile(profile.tool);
        const isCurrent = profile.name === currentProfile;
        const marker = isCurrent ? '★ ' : '  ';

        return {
          name: `${marker}[${toolConfig.displayName}] ${profile.name} - ${profile.url}`,
          value: profile.name,
        };
      });

      const { selected } = await inquirer.prompt<{ selected: string }>([
        {
          type: 'list',
          name: 'selected',
          message: '选择要切换的配置:',
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

    // 应用配置
    const spinner = ora(`正在切换到配置 "${profile.name}"...`).start();

    try {
      const handler = getHandler(profile.tool);
      await handler.applyConfig(profile.url, profile.apiKey);
      configStore.setCurrentProfile(profile.tool, profile.name);

      spinner.succeed(`已切换到配置 "${profile.name}"`);

      const toolConfig = TOOL_CONFIGS[profile.tool];
      const boxContent = [
        `${chalk.bold('工具')}    ${toolConfig.displayName}`,
        `${chalk.bold('配置')}    ${profile.name}`,
        `${chalk.bold('URL')}     ${profile.url}`,
        `${chalk.bold('目录')}    ${toolConfig.configDir}`,
      ].join('\n');

      logger.box(boxContent, { title: '配置切换成功', type: 'success' });
    } catch (error) {
      spinner.fail('切换配置失败');
      throw error;
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`切换配置失败: ${error.message}`);
    }
    process.exit(1);
  }
}
