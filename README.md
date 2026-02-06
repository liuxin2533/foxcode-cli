# FoxCode

<div align="center">

🦊 快速切换 Claude Code、Codex、Gemini CLI 配置的命令行工具

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

[特性](#-特性) • [安装](#-安装) • [快速开始](#-快速开始) • [命令](#-命令) • [配置](#-配置)

</div>

---

## ✨ 特性

- 🚀 **多工具支持** - 支持 Claude Code、Codex、Gemini CLI 三大 AI 编程工具
- 💾 **配置管理** - 轻松添加、编辑、切换、删除配置
- 🎨 **友好界面** - 美观的终端交互界面，彩色输出
- 🔄 **自动备份** - 修改配置前自动备份，支持一键恢复
- 📝 **内置预设** - 常用 URL 预设，也可自定义
- 🔒 **输入验证** - 自动验证 URL 和 API Key 格式
- 🖱️ **交互式操作** - 所有命令支持交互式选择
- 🛡️ **安全可靠** - TypeScript 编写，完整的错误处理

## 📦 安装

### 使用 npm

```bash
npm install -g foxcode
```

### 使用 pnpm

```bash
pnpm add -g foxcode
```

### 使用 yarn

```bash
yarn global add foxcode
```

### 从源码安装

```bash
git clone https://github.com/your-repo/foxcode.git
cd foxcode
pnpm install
pnpm build
npm link
```

## 🚀 快速开始

### 1. 添加第一个配置

```bash
foxcode add
```

按照提示选择工具、输入配置名称、URL 和 API Key。

### 2. 查看所有配置

```bash
foxcode ls
```

### 3. 切换配置

```bash
foxcode use
```

就这么简单！🎉

## 📖 命令

### 基础命令

| 命令                    | 说明         | 示例                |
| ----------------------- | ------------ | ------------------- |
| `foxcode add`           | 添加新配置   | `foxcode add`       |
| `foxcode ls`            | 列出所有配置 | `foxcode ls`        |
| `foxcode edit [name]`   | 编辑配置     | `foxcode edit prod` |
| `foxcode use [name]`    | 切换配置     | `foxcode use dev`   |
| `foxcode remove [name]` | 删除配置     | `foxcode rm test`   |
| `foxcode current`       | 显示当前配置 | `foxcode current`   |

### 备份管理

| 命令                     | 说明         |
| ------------------------ | ------------ |
| `foxcode backup list`    | 列出所有备份 |
| `foxcode backup restore` | 恢复备份     |
| `foxcode backup delete`  | 删除备份     |

### 帮助信息

| 命令                | 说明         |
| ------------------- | ------------ |
| `foxcode --help`    | 显示帮助信息 |
| `foxcode --version` | 显示版本号   |

## 🔧 配置

### 支持的工具

#### 1. Claude Code

**配置文件**:

- `~/.claude/settings.json` - URL 和 API Key
- `~/.claude/config.json` - 固定配置

**内置 URL**:

- 官方满血: `https://code.newcli.com/claude`
- Super特价: `https://code.newcli.com/claude/super`
- Ultra特价: `https://code.newcli.com/claude/ultra`
- AWS特价: `https://code.newcli.com/claude/aws`
- AWS特价(思考): `https://code.newcli.com/claude/droid`

#### 2. Codex

**配置文件**:

- `~/.codex/config.toml` - URL 配置
- `~/.codex/auth.json` - API Key

**内置 URL**:

- 官方满血: `https://code.newcli.com/codex/v1`

#### 3. Gemini CLI

**配置文件**:

- `~/.gemini/.env` - URL 和 API Key
- `~/.gemini/settings.json` - 固定配置

**内置 URL**:

- 官方满血: `https://code.newcli.com/gemini`

### 配置存储

FoxCode 的配置存储在：

- **Windows**: `%APPDATA%\foxcode\config.json`
- **macOS/Linux**: `~/.config/foxcode/config.json`
- **备份目录**: `~/.foxcode/backups/`

## 💡 使用示例

### 场景 1: 多环境管理

```bash
# 添加生产环境
foxcode add
# 选择 Claude Code -> prod -> 官方满血 -> 输入 Key

# 添加开发环境
foxcode add
# 选择 Claude Code -> dev -> Super特价 -> 输入 Key

# 快速切换
foxcode use prod  # 切换到生产环境
foxcode use dev   # 切换到开发环境
```

### 场景 2: 更新配置

```bash
# 编辑配置
foxcode edit prod

# 选择要修改的字段（URL、API Key 或两者）
# 输入新值
# 选择是否立即应用
```

### 场景 3: 配置恢复

```bash
# 查看备份
foxcode backup list

# 恢复备份
foxcode backup restore

# 选择要恢复的备份文件
```

### 场景 4: 管理多个工具

```bash
# 为每个工具添加配置
foxcode add  # Claude Code
foxcode add  # Codex
foxcode add  # Gemini CLI

# 查看所有配置
foxcode ls

# 查看当前使用的配置
foxcode current
```

## 🎯 最佳实践

### 配置命名

建议使用清晰的命名规范：

```bash
prod          # 生产环境
dev           # 开发环境
test          # 测试环境
claude-prod   # Claude 生产环境
codex-dev     # Codex 开发环境
```

### 安全建议

1. **不要分享配置文件** - 配置文件包含 API Key
2. **定期更新 Key** - 使用 `foxcode edit` 更新过期的 Key
3. **检查备份** - 定期查看 `foxcode backup list`

### 工作流程

```bash
# 日常工作流程
foxcode current        # 查看当前配置
foxcode use dev        # 切换到开发环境
# ... 进行开发工作 ...
foxcode use prod       # 切换到生产环境
```

## 🛠️ 开发

### 环境要求

- Node.js >= 18.0.0
- pnpm (推荐) 或 npm

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/your-repo/foxcode.git
cd foxcode

# 安装依赖
pnpm install

# 开发模式
pnpm dev add
pnpm dev ls

# 构建
pnpm build

# 本地测试
npm link
foxcode --help
```

### 项目结构

```
foxcode/
├── src/
│   ├── commands/       # 命令实现
│   ├── config/         # 配置管理
│   ├── handlers/       # 工具处理器
│   ├── utils/          # 工具函数
│   ├── cli.ts          # CLI 定义
│   └── index.ts        # 入口文件
├── example/            # 配置示例
├── dist/               # 构建输出
└── package.json
```

### 技术栈

- **TypeScript** - 类型安全
- **Commander.js** - CLI 框架
- **Inquirer.js** - 交互式提示
- **Chalk** - 终端彩色输出
- **fs-extra** - 文件操作
- **TOML** - TOML 文件解析

## 🐛 故障排除

### 问题 1: 命令未找到

```bash
# 确保已全局安装
npm list -g foxcode

# 或使用 npm link
cd foxcode
npm link
```

### 问题 2: 配置未生效

```bash
# 查看当前配置
foxcode current

# 重新应用配置
foxcode use <config-name>

# 检查配置文件
# Windows: dir %USERPROFILE%\.claude
# macOS/Linux: ls -la ~/.claude
```

### 问题 3: 配置文件损坏

```bash
# 查看备份
foxcode backup list

# 恢复最近的备份
foxcode backup restore
```

### 问题 4: 权限错误

确保有读写用户目录的权限：

```bash
# Windows: 以管理员身份运行
# macOS/Linux: 检查文件权限
chmod -R 755 ~/.foxcode
```

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

### 贡献流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 添加适当的注释
- 更新相关文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

```
MIT License

Copyright (c) 2025 FoxCode Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 致谢

感谢所有贡献者和使用 FoxCode 的开发者！

## 📮 联系方式

- 提交 Issue: [GitHub Issues](https://github.com/your-repo/foxcode/issues)
- 邮件: <your-email@example.com>

---

<div align="center">

Made with ❤️ by FoxCode Team

[⬆ 回到顶部](#foxcode)

</div>
