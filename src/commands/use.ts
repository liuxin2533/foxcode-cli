import inquirer from 'inquirer';
import ora from 'ora';
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
      logger.warn('暂无配置');
      logger.info('使用 "foxcode add" 添加新配置');
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
      logger.info('使用 "foxcode ls" 查看所有配置');
      process.exit(1);
    }

    // 应用配置
    const spinner = ora(`正在切换到配置 "${profile.name}"...`).start();

    try {
      const handler = getHandler(profile.tool);
      await handler.applyConfig(profile.url, profile.apiKey);
      configStore.setCurrentProfile(profile.tool, profile.name);

      spinner.succeed(`已切换到配置 "${profile.name}"`);

      logger.newLine();
      logger.info(`工具: ${TOOL_CONFIGS[profile.tool].displayName}`);
      logger.info(`URL: ${profile.url}`);
      logger.info(`配置目录: ${TOOL_CONFIGS[profile.tool].configDir}`);
      logger.newLine();
      logger.success('配置已生效！');
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
