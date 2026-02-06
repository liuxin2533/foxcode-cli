import chalk from 'chalk';
import figures from 'figures';
import { configStore } from '../config/store.js';
import { TOOL_CONFIGS } from '../config/presets.js';
import { logger } from '../utils/logger.js';

/**
 * 状态总览命令
 */
export async function statusCommand(): Promise<void> {
  logger.title('📊 状态总览');
  logger.newLine();

  const tools = ['claude', 'codex', 'gemini'] as const;
  let totalProfiles = 0;
  let activeCount = 0;

  tools.forEach((tool) => {
    const toolConfig = TOOL_CONFIGS[tool];
    const profiles = configStore.getProfilesByTool(tool);
    const currentName = configStore.getCurrentProfile(tool);
    const currentProfile = currentName ? configStore.getProfile(currentName) : undefined;

    totalProfiles += profiles.length;

    // 工具名称 + 状态图标
    const statusIcon = currentProfile
      ? chalk.green(figures.tick)
      : chalk.gray(figures.cross);
    const statusText = currentProfile
      ? chalk.green('已配置')
      : chalk.gray('未配置');

    console.log(`  ${statusIcon} ${chalk.bold(toolConfig.displayName)}  ${statusText}`);

    if (currentProfile) {
      activeCount++;
      console.log(chalk.gray(`    当前配置: ${chalk.white(currentProfile.name)}`));
      console.log(chalk.gray(`    URL:     ${currentProfile.url}`));
    }

    console.log(chalk.gray(`    配置目录: ${toolConfig.configDir}`));
    console.log(chalk.gray(`    配置数量: ${profiles.length} 个`));
    logger.newLine();
  });

  logger.divider();
  logger.info(`共 ${totalProfiles} 个配置，${activeCount} 个工具已激活`);

  if (totalProfiles === 0) {
    logger.newLine();
    logger.warn('还没有任何配置，快来添加一个吧！');
    logger.info(`运行 ${chalk.cyan('foxcode add')} 开始添加配置`);
  }
}
