import Conf from 'conf';
import { StoreData, ConfigProfile, CliTool } from './types.js';

/**
 * 配置存储管理
 */
class ConfigStore {
  private store: Conf<StoreData>;

  constructor() {
    this.store = new Conf<StoreData>({
      projectName: 'foxcode',
      defaults: {
        profiles: [],
        current: {},
      },
    });
  }

  /**
   * 获取所有配置
   */
  getAllProfiles(): ConfigProfile[] {
    return this.store.get('profiles', []);
  }

  /**
   * 根据工具类型获取配置
   */
  getProfilesByTool(tool: CliTool): ConfigProfile[] {
    return this.getAllProfiles().filter((p) => p.tool === tool);
  }

  /**
   * 根据名称获取配置
   */
  getProfile(name: string): ConfigProfile | undefined {
    return this.getAllProfiles().find((p) => p.name === name);
  }

  /**
   * 添加配置
   */
  addProfile(profile: ConfigProfile): void {
    const profiles = this.getAllProfiles();
    const existingIndex = profiles.findIndex((p) => p.name === profile.name);

    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }

    this.store.set('profiles', profiles);
  }

  /**
   * 删除配置
   */
  removeProfile(name: string): boolean {
    const profiles = this.getAllProfiles();
    const filtered = profiles.filter((p) => p.name !== name);

    if (filtered.length === profiles.length) {
      return false;
    }

    this.store.set('profiles', filtered);
    return true;
  }

  /**
   * 获取当前配置
   */
  getCurrentProfile(tool: CliTool): string | undefined {
    const current = this.store.get('current', {});
    return current[tool];
  }

  /**
   * 设置当前配置
   */
  setCurrentProfile(tool: CliTool, name: string): void {
    const current = this.store.get('current', {});
    current[tool] = name;
    this.store.set('current', current);
  }

  /**
   * 清除当前配置
   */
  clearCurrentProfile(tool: CliTool): void {
    const current = this.store.get('current', {});
    delete current[tool];
    this.store.set('current', current);
  }

  /**
   * 获取存储路径
   */
  getStorePath(): string {
    return this.store.path;
  }
}

export const configStore = new ConfigStore();
