import { ClaudeHandler } from './claude.js';
import { CodexHandler } from './codex.js';
import { GeminiHandler } from './gemini.js';
import { CliTool } from '../config/types.js';
import { BaseHandler } from './base.js';

/**
 * 获取对应的处理器
 */
export function getHandler(tool: CliTool): BaseHandler {
  switch (tool) {
    case 'claude':
      return new ClaudeHandler();
    case 'codex':
      return new CodexHandler();
    case 'gemini':
      return new GeminiHandler();
    default:
      throw new Error(`Unknown tool: ${tool}`);
  }
}

export { ClaudeHandler, CodexHandler, GeminiHandler };
