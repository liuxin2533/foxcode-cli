import chalk from 'chalk';
import { configStore } from '../config/store.js';
import { TOOL_CONFIGS } from '../config/presets.js';
import { logger } from '../utils/logger.js';

/**
 * 显示当前配置命令
 */
export async function currentCommand(): Promise<void> {
  const tools = ['claude', 'codex', 'gemini'] as const;
  let hasAny = false;

  logger.title('📌 当前配置');
  logger.newLine();

  tools.forEach((tool) => {
    const currentName = configStore.getCurrentProfile(tool);
    if (!currentName) return;

    const profile = configStore.getProfile(currentName);
    if (!profile) return;

    hasAny = true;
    const toolConfig = TOOL_CONFIGS[tool];

    console.log(chalk.cyan.bold(`${toolConfig.displayName}:`));
    logger.divider();
    console.log(chalk.white(`  名称: ${chalk.green(profile.name)}`));
    console.log(chalk.white(`  URL: ${chalk.gray(profile.url)}`));
    console.log(
      chalk.white(
        `  API Key: ${chalk.gray(
          profile.apiKey.length > 20
            ? profile.apiKey.substring(0, 10) + '...' + profile.apiKey.substring(profile.apiKey.length - 5)
            : profile.apiKey
        )}`
      )
    );
    console.log(chalk.white(`  配置目录: ${chalk.gray(toolConfig.configDir)}`));
    console.log(chalk.white(`  更新时间: ${chalk.gray(new Date(profile.updatedAt).toLocaleString())}`));
    logger.newLine();
  });

  if (!hasAny) {
    logger.warn('当前未设置任何配置');
    logger.info('使用 "foxcode use" 切换配置');
  }
}
