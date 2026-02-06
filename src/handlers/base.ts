import { ToolConfig } from '../config/types.js';
import { fileUtils } from '../utils/file.js';
import { backupUtils } from '../utils/backup.js';

/**
 * 基础文件处理器
 */
export abstract class BaseHandler {
  constructor(protected config: ToolConfig) {}

  /**
   * 应用配置
   */
  abstract applyConfig(url: string, apiKey: string): Promise<void>;

  /**
   * 读取文件
   */
  protected async readFile(filePath: string, type: 'json' | 'toml' | 'env'): Promise<any> {
    switch (type) {
      case 'json':
        return await fileUtils.readJson(filePath);
      case 'toml':
        return await fileUtils.readToml(filePath);
      case 'env':
        return await fileUtils.readEnv(filePath);
    }
  }

  /**
   * 写入文件（带错误处理）
   */
  protected async writeFile(
    filePath: string,
    type: 'json' | 'toml' | 'env',
    data: any
  ): Promise<void> {
    try {
      // 如果文件存在，先备份
      if (await fileUtils.exists(filePath)) {
        await backupUtils.createBackup(filePath);
      }

      switch (type) {
        case 'json':
          await fileUtils.writeJson(filePath, data);
          break;
        case 'toml':
          await fileUtils.writeToml(filePath, data);
          break;
        case 'env':
          await fileUtils.writeEnv(filePath, data);
          break;
      }
    } catch (error) {
      throw new Error(
        `写入文件失败 (${filePath}): ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 确保配置目录存在
   */
  protected async ensureConfigDir(): Promise<void> {
    await fileUtils.ensureDir(this.config.configDir);
  }
}
