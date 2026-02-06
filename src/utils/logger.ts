import chalk from 'chalk';
import boxen from 'boxen';
import figures from 'figures';

/**
 * 日志工具
 */
export const logger = {
  /**
   * 成功消息
   */
  success(message: string): void {
    console.log(chalk.green(`${figures.tick} ${message}`));
  },

  /**
   * 错误消息
   */
  error(message: string): void {
    console.log(chalk.red(`${figures.cross} ${message}`));
  },

  /**
   * 警告消息
   */
  warn(message: string): void {
    console.log(chalk.yellow(`${figures.warning} ${message}`));
  },

  /**
   * 信息消息
   */
  info(message: string): void {
    console.log(chalk.blue(`${figures.info} ${message}`));
  },

  /**
   * 普通消息
   */
  log(message: string): void {
    console.log(message);
  },

  /**
   * 标题
   */
  title(message: string): void {
    console.log(chalk.cyan.bold(`\n${message}`));
  },

  /**
   * 分隔线
   */
  divider(): void {
    console.log(chalk.gray('─'.repeat(80)));
  },

  /**
   * 框消息
   */
  box(message: string, options?: { title?: string; type?: 'success' | 'error' | 'warning' | 'info' }): void {
    const borderColors = {
      success: 'green',
      error: 'red',
      warning: 'yellow',
      info: 'blue',
    };

    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: options?.type ? borderColors[options.type] : 'cyan',
        title: options?.title,
        titleAlignment: 'center',
      })
    );
  },

  /**
   * 空行
   */
  newLine(): void {
    console.log();
  },
};
