import inquirer from 'inquirer';
import { UrlPreset } from '../config/types.js';
import { validator } from './validator.js';

/**
 * 自定义 URL 输入提示
 */
async function promptCustomUrl(defaultValue?: string): Promise<string> {
  const { customUrl } = await inquirer.prompt<{ customUrl: string }>([
    {
      type: 'input',
      name: 'customUrl',
      message: '请输入自定义 URL:',
      default: defaultValue,
      validate: (input: string) => {
        const trimmed = input.trim();
        if (!trimmed) return 'URL 不能为空';
        if (!validator.isValidUrl(trimmed)) return 'URL 格式无效，必须以 http:// 或 https:// 开头';
        return true;
      },
    },
  ]);
  return validator.normalizeUrl(customUrl.trim());
}

/**
 * URL 选择交互（用于 add 和 edit 命令）
 */
export async function promptUrlSelection(urlPresets: UrlPreset[], currentUrl?: string): Promise<string | null> {
  if (urlPresets.length === 2 && urlPresets[1].value === 'custom') {
    // 只有一个预设 + 自定义选项
    if (currentUrl) {
      // edit 模式
      const { urlChoice } = await inquirer.prompt<{ urlChoice: string }>([
        {
          type: 'list',
          name: 'urlChoice',
          message: '选择 URL:',
          choices: [
            { name: `默认 (${urlPresets[0].value})`, value: 'default' },
            { name: '自定义 URL', value: 'custom' },
            { name: '保持不变', value: 'keep' },
          ],
        },
      ]);

      if (urlChoice === 'keep') return null;
      if (urlChoice === 'default') return urlPresets[0].value;
      return await promptCustomUrl(currentUrl);
    }

    // add 模式
    const { useDefault } = await inquirer.prompt<{ useDefault: boolean }>([
      {
        type: 'confirm',
        name: 'useDefault',
        message: `使用默认 URL (${urlPresets[0].value})?`,
        default: true,
      },
    ]);

    if (useDefault) return urlPresets[0].value;
    return await promptCustomUrl();
  }

  // 多个预设
  const choices = urlPresets.map((preset) => ({
    name: `${preset.label} ${preset.value !== 'custom' ? `(${preset.value})` : ''}`,
    value: preset.value,
  }));

  if (currentUrl) {
    choices.push({ name: '保持不变', value: 'keep' });
  }

  const { selectedUrl } = await inquirer.prompt<{ selectedUrl: string }>([
    {
      type: 'list',
      name: 'selectedUrl',
      message: currentUrl ? '选择新的 URL:' : '选择 URL:',
      choices,
    },
  ]);

  if (selectedUrl === 'keep') return null;
  if (selectedUrl === 'custom') return await promptCustomUrl(currentUrl);
  return selectedUrl;
}
