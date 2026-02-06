/**
 * 输入验证工具
 */
export const validator = {
  /**
   * 验证 URL 格式
   */
  isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  },

  /**
   * 验证配置名称
   */
  isValidName(name: string): boolean {
    // 只允许字母、数字、下划线、连字符
    return /^[a-zA-Z0-9_-]+$/.test(name);
  },

  /**
   * 验证 API Key 格式（基本检查）
   */
  isValidApiKey(apiKey: string): boolean {
    // 至少 10 个字符，不包含空格
    return apiKey.length >= 10 && !/\s/.test(apiKey);
  },

  /**
   * 清理 URL（移除末尾斜杠）
   */
  normalizeUrl(url: string): string {
    return url.replace(/\/+$/, '');
  },

  /**
   * 清理配置名称
   */
  normalizeName(name: string): string {
    return name.trim().toLowerCase();
  },
};
