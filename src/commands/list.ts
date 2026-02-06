import chalk from 'chalk';
import Table from 'cli-table3';
import { configStore } from '../config/store.js';
import { TOOL_CONFIGS } from '../config/presets.js';
import { logger } from '../utils/logger.js';
import figures from 'figures';

/**
 * 列出所有配置命令
 */
export async function listCommand(): Promise<void> {
  const profiles = configStore.getAllProfiles();

  if (profiles.length === 0) {
    logger.warn('暂无配置');
    logger.info('使用 "foxcode add" 添加新配置');
    return;
  }

  logger.title('📋 配置列表');
  logger.newLine();

  // 按工具分组
  const tools = ['claude', 'codex', 'gemini'] as const;

  tools.forEach((tool) => {
    const toolProfiles = configStore.getProfilesByTool(tool);
    if (toolProfiles.length === 0) return;

    const toolConfig = TOOL_CONFIGS[tool];
    const currentProfile = configStore.getCurrentProfile(tool);

    console.log(chalk.cyan.bold(`\n${toolConfig.displayName}`));
    logger.divider();

    const table = new Table({
      head: [
        chalk.white('状态'),
        chalk.white('名称'),
        chalk.white('URL'),
        chalk.white('API Key'),
        chalk.white('更新时间'),
      ],
      colWidths: [6, 20, 40, 25, 20],
      wordWrap: true,
    });

    toolProfiles.forEach((profile) => {
      const isCurrent = profile.name === currentProfile;
      const status = isCurrent ? chalk.green(figures.tick) : ' ';
      const name = isCurrent ? chalk.green.bold(profile.name) : profile.name;
      const url = chalk.gray(profile.url);
      const apiKey = chalk.gray(
        profile.apiKey.length > 20
          ? profile.apiKey.substring(0, 10) + '...' + profile.apiKey.substring(profile.apiKey.length - 5)
          : profile.apiKey
      );
      const updatedAt = chalk.gray(new Date(profile.updatedAt).toLocaleString());

      table.push([status, name, url, apiKey, updatedAt]);
    });

    console.log(table.toString());

    if (currentProfile) {
      logger.success(`当前使用: ${currentProfile}`);
    }
  });

  logger.newLine();
  logger.info(`总计: ${profiles.length} 个配置`);
}
