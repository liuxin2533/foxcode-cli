# GitHub Actions 自动发布设置

## 📦 自动发布到 npm（使用 Trusted Publishing）

本项目使用 npm 的 **Trusted Publishing** 功能，这是最安全的 CI/CD 发布方式，无需手动管理 token。

## 🔧 设置步骤

### 1. 在 npm 配置 Trusted Publishing

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 访问你的包页面（如果还没发布，先手动发布一次）
3. 进入 **Settings** → **Publishing Access**
4. 找到 **Trusted Publishing** 部分
5. 点击 **Add trusted publisher**
6. 填写信息：
   - **Provider**: 选择 `GitHub Actions`
   - **Repository owner**: `liuxin2533`
   - **Repository name**: `foxcode-cli`
   - **Workflow name**: `publish.yml`
   - **Environment name**: 留空（可选）
7. 点击 **Add**

### 2. 首次手动发布（如果包还不存在）

如果这是第一次发布包，需要先手动发布一次：

```bash
cd foxcode
pnpm build
npm login
npm publish --access public
```

发布成功后，再按照上面的步骤 1 配置 Trusted Publishing。

## 🚀 发布流程

配置完成后，每次推送带有 `v` 前缀的 tag 时，会自动发布到 npm：

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
4. 使用 OIDC 认证发布到 npm（无需 token）

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
- **认证方式**：OIDC Trusted Publishing（无需 token）
- **执行步骤**：
  - 安装依赖
  - 构建项目
  - 发布到 npm（带 provenance）

## ✅ 验证

发布成功后，可以在以下位置查看：

- npm 包：https://www.npmjs.com/package/foxcode
- GitHub Releases：https://github.com/liuxin2533/foxcode-cli/releases
- GitHub Actions：https://github.com/liuxin2533/foxcode-cli/actions

## 🔍 故障排除

### 发布失败：权限错误

确保已在 npm 配置了 Trusted Publishing，并且信息填写正确：
- Repository owner: `liuxin2533`
- Repository name: `foxcode-cli`
- Workflow name: `publish.yml`

### 首次发布失败

如果包还不存在，需要先手动发布一次，然后再配置 Trusted Publishing。

### 版本冲突

如果版本号已存在于 npm，需要更新版本号：

```bash
npm version patch
git push && git push --tags
```

## 🎯 优势

使用 Trusted Publishing 的优势：

- ✅ 无需管理 npm token
- ✅ 更安全（使用 OIDC 认证）
- ✅ 自动生成 provenance（来源证明）
- ✅ 符合 npm 最佳实践
