import inquirer from 'inquirer';
import chalk from 'chalk';
import { configStore } from '../config/store.js';
import { logger } from '../utils/logger.js';
import { TOOL_CONFIGS } from '../config/presets.js';

/**
 * 删除配置命令
 */
export async function removeCommand(name?: string): Promise<void> {
  try {
    const profiles = configStore.getAllProfiles();

    if (profiles.length === 0) {
      logger.warn('还没有任何配置，无需删除');
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
          message: '选择要删除的配置:',
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

    // 确认删除
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: `确认删除配置 "${profile.name}"?`,
        default: false,
      },
    ]);

    if (!confirm) {
      logger.info('已取消删除');
      return;
    }

    // 删除配置
    const success = configStore.removeProfile(profile.name);

    if (success) {
      // 如果删除的是当前配置，清除当前配置标记
      const currentProfile = configStore.getCurrentProfile(profile.tool);
      if (currentProfile === profile.name) {
        configStore.clearCurrentProfile(profile.tool);
      }

      const toolConfig = TOOL_CONFIGS[profile.tool];
      const boxContent = [
        `${chalk.bold('配置')}    ${profile.name}`,
        `${chalk.bold('工具')}    ${toolConfig.displayName}`,
      ].join('\n');

      logger.box(boxContent, { title: '配置已删除', type: 'warning' });
      logger.info(`提示: 工具配置文件未被删除，如需恢复可使用 ${chalk.cyan('foxcode backup restore')}`);
    } else {
      logger.error('删除配置失败，请稍后重试');
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`删除配置失败: ${error.message}`);
    }
    process.exit(1);
  }
}
