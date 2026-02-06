import path from 'path';
import { fileUtils } from './file.js';
import os from 'os';
import fs from 'fs-extra';

const BACKUP_DIR = path.join(os.homedir(), '.foxcode', 'backups');

/**
 * 备份工具
 */
export const backupUtils = {
  /**
   * 创建备份
   */
  async createBackup(filePath: string): Promise<string | null> {
    if (!(await fileUtils.exists(filePath))) {
      return null;
    }

    // 使用更精确的时间戳（包含毫秒）+ 随机数避免冲突
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').replace('T', '_');
    const random = Math.random().toString(36).substring(2, 8);
    const fileName = path.basename(filePath);
    const toolName = path.basename(path.dirname(filePath));
    const backupFileName = `${toolName}_${fileName}_${timestamp}_${random}`;
    const backupPath = path.join(BACKUP_DIR, backupFileName);

    await fileUtils.ensureDir(BACKUP_DIR);
    await fileUtils.copy(filePath, backupPath);

    return backupPath;
  },

  /**
   * 获取所有备份
   */
  async listBackups(): Promise<string[]> {
    if (!(await fileUtils.exists(BACKUP_DIR))) {
      return [];
    }

    const files = await fs.readdir(BACKUP_DIR);
    // 按修改时间倒序排列（最新的在前）
    const filesWithStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = await fs.stat(filePath);
        return { path: filePath, mtime: stats.mtime };
      })
    );
    
    return filesWithStats
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
      .map((f) => f.path);
  },

  /**
   * 恢复备份
   */
  async restoreBackup(backupPath: string, targetPath: string): Promise<void> {
    if (!(await fileUtils.exists(backupPath))) {
      throw new Error(`备份文件不存在: ${backupPath}`);
    }
    
    // 恢复前先备份当前文件
    if (await fileUtils.exists(targetPath)) {
      await backupUtils.createBackup(targetPath);
    }
    
    await fileUtils.copy(backupPath, targetPath);
  },

  /**
   * 删除备份
   */
  async deleteBackup(backupPath: string): Promise<void> {
    if (!(await fileUtils.exists(backupPath))) {
      throw new Error(`备份文件不存在: ${backupPath}`);
    }
    await fileUtils.remove(backupPath);
  },

  /**
   * 获取备份目录
   */
  getBackupDir(): string {
    return BACKUP_DIR;
  },

  /**
   * 清理旧备份（保留最近 N 个）
   */
  async cleanOldBackups(keepCount: number = 10): Promise<number> {
    const backups = await backupUtils.listBackups();
    
    if (backups.length <= keepCount) {
      return 0;
    }

    const toDelete = backups.slice(keepCount);
    let deletedCount = 0;

    for (const backup of toDelete) {
      try {
        await fileUtils.remove(backup);
        deletedCount++;
      } catch (error) {
        // 忽略删除失败的文件
        console.warn(`Failed to delete backup: ${backup}`);
      }
    }

    return deletedCount;
  },
};
