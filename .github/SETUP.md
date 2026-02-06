# GitHub Actions 自动发布设置

## 📦 自动发布到 npm

本项目已配置 GitHub Actions 自动发布到 npm。

## 🔧 设置步骤

### 1. 获取 npm Token

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 点击头像 → **Access Tokens**
3. 点击 **Generate New Token** → **Classic Token**
4. 选择 **Automation** 类型
5. 复制生成的 Token

### 2. 配置 GitHub Secrets

1. 打开 GitHub 仓库：https://github.com/liuxin2533/foxcode-cli
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 名称填写：`NPM_TOKEN`
5. 值粘贴：刚才复制的 npm token
6. 点击 **Add secret**

## 🚀 发布流程

### 自动发布（推荐）

每次推送带有 `v` 前缀的 tag 时，会自动发布到 npm：

```bash
# 更新版本号（会自动创建 git tag）
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# 推送代码和 tag
git push && git push --tags
```

GitHub Actions 会自动：
1. 检出代码
2. 安装依赖
3. 构建项目
4. 发布到 npm

### 手动发布

如果需要手动发布：

```bash
pnpm build
npm login
npm publish
```

## 📋 工作流说明

### CI 工作流 (ci.yml)

- **触发时机**：推送到 main 分支或创建 PR
- **测试环境**：Node.js 18.x 和 20.x
- **执行步骤**：
  - 类型检查
  - 代码检查
  - 构建测试

### 发布工作流 (publish.yml)

- **触发时机**：推送 tag（如 v1.0.0）
- **执行步骤**：
  - 安装依赖
  - 构建项目
  - 发布到 npm

## ✅ 验证

发布成功后，可以在以下位置查看：

- npm 包：https://www.npmjs.com/package/foxcode
- GitHub Releases：https://github.com/liuxin2533/foxcode-cli/releases
- GitHub Actions：https://github.com/liuxin2533/foxcode-cli/actions

## 🔍 故障排除

### 发布失败

1. 检查 NPM_TOKEN 是否正确配置
2. 检查 npm 包名是否已被占用
3. 查看 GitHub Actions 日志

### 版本冲突

如果版本号已存在于 npm，需要更新版本号：

```bash
npm version patch
git push && git push --tags
```
