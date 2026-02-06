import { Command } from 'commander';
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
import { useCommand } from './commands/use.js';
import { removeCommand } from './commands/remove.js';
import { currentCommand } from './commands/current.js';
import { backupCommand } from './commands/backup.js';
import { editCommand } from './commands/edit.js';
import { logger } from './utils/logger.js';
import chalk from 'chalk';

const program = new Command();

// 自定义错误处理
program.configureOutput({
  outputError: (str, write) => {
    // 提取错误信息
    if (str.includes('unknown option')) {
      const match = str.match(/unknown option '([^']+)'/);
      if (match) {
        const option = match[1];
        logger.error(`未知选项: ${chalk.yellow(option)}`);
        logger.newLine();
        logger.info('可用选项:');
        logger.log(`  ${chalk.cyan('-V, --version')}  显示版本号`);
        logger.log(`  ${chalk.cyan('-h, --help')}     显示帮助信息`);
        logger.newLine();
        logger.info(`使用 ${chalk.cyan('foxcode --help')} 查看所有命令`);
        return;
      }
    }
    
    if (str.includes('unknown command')) {
      const match = str.match(/unknown command '([^']+)'/);
      if (match) {
        const command = match[1];
        logger.error(`未知命令: ${chalk.yellow(command)}`);
        logger.newLine();
        logger.info('可用命令:');
        logger.log(`  ${chalk.cyan('add')}              添加新的配置`);
        logger.log(`  ${chalk.cyan('ls, list')}         列出所有配置`);
        logger.log(`  ${chalk.cyan('use [name]')}       切换配置`);
        logger.log(`  ${chalk.cyan('remove, rm [name]')} 删除配置`);
        logger.log(`  ${chalk.cyan('current')}          显示当前配置`);
        logger.log(`  ${chalk.cyan('backup [action]')}  备份管理`);
        logger.newLine();
        logger.info(`使用 ${chalk.cyan('foxcode --help')} 查看详细帮助`);
        return;
      }
    }
    
    // 其他错误直接输出
    write(chalk.red(str));
  },
});

program
  .name('foxcode')
  .description('快速切换 Claude Code、Codex、Gemini CLI 配置的命令行工具')
  .version('1.0.0')
  .showHelpAfterError('使用 --help 查看可用命令');

// 添加配置
program
  .command('add')
  .description('添加新的配置')
  .action(async () => {
    await addCommand();
  });

// 列出配置
program
  .command('ls')
  .alias('list')
  .description('列出所有配置')
  .action(async () => {
    await listCommand();
  });

// 编辑配置
program
  .command('edit [name]')
  .description('编辑指定配置（不指定名称时交互式选择）')
  .action(async (name?: string) => {
    await editCommand(name);
  });

// 切换配置
program
  .command('use [name]')
  .description('切换到指定配置（不指定名称时交互式选择）')
  .action(async (name?: string) => {
    await useCommand(name);
  });

// 删除配置
program
  .command('remove [name]')
  .alias('rm')
  .description('删除指定配置（不指定名称时交互式选择）')
  .action(async (name?: string) => {
    await removeCommand(name);
  });

// 当前配置
program
  .command('current')
  .description('显示当前使用的配置')
  .action(async () => {
    await currentCommand();
  });

// 备份管理
program
  .command('backup [action]')
  .description('备份管理 (list, restore, delete)')
  .action(async (action?: string) => {
    await backupCommand(action);
  });

// 处理未知命令
program.on('command:*', (operands) => {
  logger.error(`未知命令: ${chalk.yellow(operands[0])}`);
  logger.newLine();
  logger.info('可用命令:');
  logger.log(`  ${chalk.cyan('add')}              添加新的配置`);
  logger.log(`  ${chalk.cyan('ls, list')}         列出所有配置`);
  logger.log(`  ${chalk.cyan('edit [name]')}      编辑配置`);
  logger.log(`  ${chalk.cyan('use [name]')}       切换配置`);
  logger.log(`  ${chalk.cyan('remove, rm [name]')} 删除配置`);
  logger.log(`  ${chalk.cyan('current')}          显示当前配置`);
  logger.log(`  ${chalk.cyan('backup [action]')}  备份管理`);
  logger.newLine();
  logger.info(`使用 ${chalk.cyan('foxcode --help')} 查看详细帮助`);
  process.exit(1);
});

export { program };
