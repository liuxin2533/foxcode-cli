import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { backupUtils } from '../utils/backup.js';
import { logger } from '../utils/logger.js';

/**
 * 备份管理命令
 */
export async function backupCommand(action?: string): Promise<void> {
  try {
    if (!action) {
      const { selected } = await inquirer.prompt<{ selected: string }>([
        {
          type: 'list',
          name: 'selected',
          message: '选择操作:',
          choices: [
            { name: '📋 列出所有备份', value: 'list' },
            { name: '♻️  恢复备份', value: 'restore' },
            { name: '🗑️  删除备份', value: 'delete' },
          ],
        },
      ]);
      action = selected;
    }

    switch (action) {
      case 'list':
      case 'ls':
        await listBackups();
        break;
      case 'restore':
        await restoreBackup();
        break;
      case 'delete':
      case 'rm':
        await deleteBackup();
        break;
      default:
        logger.error(`未知操作: ${action}`);
        logger.info('可用操作: list, restore, delete');
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`备份操作失败: ${error.message}`);
    }
    process.exit(1);
  }
}

/**
 * 列出所有备份
 */
async function listBackups(): Promise<void> {
  const backups = await backupUtils.listBackups();

  if (backups.length === 0) {
    logger.warn('暂无备份文件');
    return;
  }

  logger.title('📋 备份列表');
  logger.newLine();

  backups.forEach((backup, index) => {
    const fileName = path.basename(backup);
    const stats = fs.statSync(backup);
    const size = (stats.size / 1024).toFixed(2);
    const time = stats.mtime.toLocaleString();

    console.log(chalk.white(`${index + 1}. ${chalk.cyan(fileName)}`));
    console.log(chalk.gray(`   大小: ${size} KB | 时间: ${time}`));
    console.log(chalk.gray(`   路径: ${backup}`));
    logger.newLine();
  });

  logger.info(`总计: ${backups.length} 个备份文件`);
  logger.info(`备份目录: ${backupUtils.getBackupDir()}`);
}

/**
 * 恢复备份
 */
async function restoreBackup(): Promise<void> {
  const backups = await backupUtils.listBackups();

  if (backups.length === 0) {
    logger.warn('暂无备份文件');
    return;
  }

  const choices = backups.map((backup) => {
    const fileName = path.basename(backup);
    const stats = fs.statSync(backup);
    const time = stats.mtime.toLocaleString();
    return {
      name: `${fileName} (${time})`,
      value: backup,
    };
  });

  const { selectedBackup } = await inquirer.prompt<{ selectedBackup: string }>([
    {
      type: 'list',
      name: 'selectedBackup',
      message: '选择要恢复的备份:',
      choices,
      pageSize: 15,
    },
  ]);

  // 解析备份文件名，确定目标路径
  // 备份文件名格式: toolName--fileName--timestamp--random
  const fileName = path.basename(selectedBackup);
  const parts = fileName.split('--');
  const toolName = parts[0];
  const originalFileName = parts[1];

  const targetPath = path.join(os.homedir(), `.${toolName}`, originalFileName);

  logger.info(`将恢复到: ${targetPath}`);

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: 'confirm',
      name: 'confirm',
      message: '确认恢复此备份?',
      default: false,
    },
  ]);

  if (!confirm) {
    logger.info('已取消恢复');
    return;
  }

  await backupUtils.restoreBackup(selectedBackup, targetPath);
  logger.success('备份已恢复');
}

/**
 * 删除备份
 */
async function deleteBackup(): Promise<void> {
  const backups = await backupUtils.listBackups();

  if (backups.length === 0) {
    logger.warn('暂无备份文件');
    return;
  }

  const choices = backups.map((backup) => {
    const fileName = path.basename(backup);
    const stats = fs.statSync(backup);
    const time = stats.mtime.toLocaleString();
    return {
      name: `${fileName} (${time})`,
      value: backup,
    };
  });

  const { selectedBackup } = await inquirer.prompt<{ selectedBackup: string }>([
    {
      type: 'list',
      name: 'selectedBackup',
      message: '选择要删除的备份:',
      choices,
      pageSize: 15,
    },
  ]);

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: 'confirm',
      name: 'confirm',
      message: '确认删除此备份?',
      default: false,
    },
  ]);

  if (!confirm) {
    logger.info('已取消删除');
    return;
  }

  await backupUtils.deleteBackup(selectedBackup);
  logger.success('备份已删除');
}
