import fs from 'fs-extra';
import path from 'path';
import * as TOML from '@iarna/toml';

/**
 * 文件操作工具
 */
export const fileUtils = {
  /**
   * 确保目录存在
   */
  async ensureDir(dirPath: string): Promise<void> {
    await fs.ensureDir(dirPath);
  },

  /**
   * 读取 JSON 文件
   */
  async readJson(filePath: string): Promise<any> {
    if (!(await fs.pathExists(filePath))) {
      return null;
    }
    return await fs.readJson(filePath);
  },

  /**
   * 写入 JSON 文件
   */
  async writeJson(filePath: string, data: any): Promise<void> {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeJson(filePath, data, { spaces: 2 });
  },

  /**
   * 读取 TOML 文件
   */
  async readToml(filePath: string): Promise<any> {
    if (!(await fs.pathExists(filePath))) {
      return null;
    }
    const content = await fs.readFile(filePath, 'utf-8');
    return TOML.parse(content);
  },

  /**
   * 写入 TOML 文件
   */
  async writeToml(filePath: string, data: any): Promise<void> {
    await fs.ensureDir(path.dirname(filePath));
    const content = TOML.stringify(data);
    await fs.writeFile(filePath, content, 'utf-8');
  },

  /**
   * 读取 ENV 文件
   */
  async readEnv(filePath: string): Promise<Record<string, string>> {
    if (!(await fs.pathExists(filePath))) {
      return {};
    }
    const content = await fs.readFile(filePath, 'utf-8');
    const result: Record<string, string> = {};

    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key) {
          result[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    return result;
  },

  /**
   * 写入 ENV 文件
   */
  async writeEnv(filePath: string, data: Record<string, string>): Promise<void> {
    await fs.ensureDir(path.dirname(filePath));
    const content = Object.entries(data)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    await fs.writeFile(filePath, content + '\n', 'utf-8');
  },

  /**
   * 检查文件是否存在
   */
  async exists(filePath: string): Promise<boolean> {
    return await fs.pathExists(filePath);
  },

  /**
   * 复制文件
   */
  async copy(src: string, dest: string): Promise<void> {
    await fs.copy(src, dest);
  },

  /**
   * 删除文件
   */
  async remove(filePath: string): Promise<void> {
    await fs.remove(filePath);
  },
};
