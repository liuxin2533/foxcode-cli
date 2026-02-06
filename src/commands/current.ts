import chalk from 'chalk';
import { configStore } from '../config/store.js';
import { TOOL_CONFIGS } from '../config/presets.js';
import { logger } from '../utils/logger.js';
import { validator } from '../utils/validator.js';

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
        `  API Key: ${chalk.gray(validator.maskApiKey(profile.apiKey))}`
      )
    );
    console.log(chalk.white(`  配置目录: ${chalk.gray(toolConfig.configDir)}`));
    console.log(chalk.white(`  更新时间: ${chalk.gray(new Date(profile.updatedAt).toLocaleString())}`));
    logger.newLine();
  });

  if (!hasAny) {
    logger.warn('当前未激活任何配置');
    logger.info(`运行 ${chalk.cyan('foxcode use')} 切换配置，或 ${chalk.cyan('foxcode add')} 添加新配置`);
  }
}
