# ESA Pages 部署指南 - AI圆桌会议

## 📋 部署前准备

### 1. 确认GitHub仓库
- 仓库地址：https://github.com/1195214305/31_AIRoundTable_-AI-
- 确保代码已推送成功

### 2. 准备ESA账号
- 登录阿里云ESA控制台：https://esa.console.aliyun.com/

---

## 🚀 ESA Pages 部署步骤

### 步骤1：创建Pages项目

1. 进入ESA控制台
2. 点击左侧菜单 **"Pages"**
3. 点击 **"创建函数"** 或 **"新建项目"**

### 步骤2：配置项目信息

#### 基本信息
- **项目名称**：`ai-roundtable` 或 `31_AIRoundTable_多AI圆桌会议`
- **描述**：多AI模型协作讨论平台

#### GitHub集成
- **选择模板**：从GitHub导入
- **GitHub仓库**：`1195214305/31_AIRoundTable_-AI-`
- **生产分支**：`main`
- **非生产分支构建**：关闭（可选）

### 步骤3：配置构建参数

根据项目的 `esa.jsonc` 文件，填写以下配置：

#### 构建配置
```
安装命令：cd frontend && npm install
构建命令：cd frontend && npm run build
根目录：（留空）
静态资源目录：frontend/dist
函数文件路径：functions/index.js
Node.js 版本：18.x 或 22.x
```

#### 详细说明
| 配置项 | 值 | 说明 |
|--------|-----|------|
| 安装命令 | `cd frontend && npm install` | 安装前端依赖 |
| 构建命令 | `cd frontend && npm run build` | 构建前端项目 |
| 根目录 | （留空） | 使用仓库根目录 |
| 静态资源目录 | `frontend/dist` | Vite构建输出目录 |
| 函数文件路径 | `functions/index.js` | 边缘函数入口文件 |
| Node.js 版本 | `18.x` 或 `22.x` | 推荐使用18.x |

### 步骤4：环境变量（可选）

本项目不需要配置环境变量，API密钥由用户在前端配置。

### 步骤5：部署

1. 点击 **"创建"** 或 **"部署"**
2. 等待构建完成（通常需要2-5分钟）
3. 查看构建日志，确认无错误

---

## ✅ 部署验证

### 1. 获取访问URL

部署成功后，ESA会分配一个访问地址，格式如：
```
https://your-project.xxx.er.aliyun-esa.net
```

### 2. 测试功能

访问部署后的URL，测试以下功能：

#### 基础功能测试
- [ ] 首页正常加载
- [ ] 点击"设置"按钮，配置API密钥模态框正常弹出
- [ ] 输入讨论话题，点击"开始讨论"能正常跳转

#### API测试
- [ ] 访问 `https://your-url/api/health` 返回健康检查信息
- [ ] 配置千问API密钥后，能正常发起讨论
- [ ] AI模型能正常响应

#### 移动端测试
- [ ] 在手机浏览器中打开，界面正常显示
- [ ] 触摸操作流畅

---

## 🔧 常见问题排查

### 问题1：构建失败

**可能原因**：
- Node.js版本不兼容
- 依赖安装失败

**解决方案**：
1. 检查构建日志中的错误信息
2. 确认Node.js版本为18.x或22.x
3. 检查`package.json`中的依赖是否正确

### 问题2：静态资源404

**可能原因**：
- 静态资源目录配置错误

**解决方案**：
1. 确认"静态资源目录"配置为 `frontend/dist`
2. 检查构建日志，确认dist目录已生成

### 问题3：API请求失败

**可能原因**：
- 边缘函数路径配置错误
- CORS配置问题

**解决方案**：
1. 确认"函数文件路径"配置为 `functions/index.js`
2. 检查`functions/index.js`中的CORS配置
3. 在浏览器开发者工具中查看网络请求详情

### 问题4：页面空白

**可能原因**：
- 路由配置问题
- JavaScript加载失败

**解决方案**：
1. 打开浏览器开发者工具，查看Console错误
2. 检查Network面板，确认所有资源正常加载
3. 确认`esa.jsonc`中的配置正确

---

## 📝 部署后操作

### 1. 更新提交文件

将部署后的URL填写到提交文件中：

```
【作品访问URL】
https://your-project.xxx.er.aliyun-esa.net

【Github仓库地址】
https://github.com/1195214305/31_AIRoundTable_-AI-
```

### 2. 截图保存

在 `screenshots/` 目录中保存以下截图：
- 首页截图
- 讨论页面截图
- 设置页面截图
- 移动端截图

### 3. 提交到天池

将更新后的txt文件提交到天池大赛平台。

---

## 🎯 优化建议

### 性能优化
- 启用ESA的边缘缓存
- 配置CDN加速静态资源
- 压缩图片和字体文件

### 功能增强
- 添加更多AI提供商支持
- 实现流式响应（SSE）
- 添加会话分支功能

---

## 📞 技术支持

如遇到部署问题，可以：
1. 查看ESA官方文档：https://help.aliyun.com/zh/esa/
2. 查看项目README：https://github.com/1195214305/31_AIRoundTable_-AI-
3. 提交Issue到GitHub仓库

---

**祝部署顺利！** 🚀
