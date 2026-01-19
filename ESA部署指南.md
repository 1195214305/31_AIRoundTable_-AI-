# AI圆桌会议 - ESA Pages 部署指南

## 📋 部署前准备

### 1. GitHub仓库
代码已推送到：`https://github.com/1195214305/31_AIRoundTable_-AI-`

### 2. 项目结构
```
31_AIRoundTable_多AI圆桌会议/
├── frontend/          # 前端代码
├── functions/         # 边缘函数
├── esa.jsonc         # ESA配置
└── README.md
```

---

## 🚀 ESA Pages 部署步骤

### 步骤1：登录ESA控制台
访问：https://esa.console.aliyun.com/

### 步骤2：创建Pages项目
1. 点击左侧菜单 **"Pages"**
2. 点击 **"创建函数"**
3. 选择 **"从GitHub导入"**

### 步骤3：配置项目参数

#### 基础配置
| 配置项 | 值 |
|--------|-----|
| 项目名称 | `ai-roundtable` |
| GitHub仓库 | `1195214305/31_AIRoundTable_-AI-` |
| 生产分支 | `main` |
| 根目录 | （留空） |

#### 构建配置
| 配置项 | 值 |
|--------|-----|
| 安装命令 | `cd frontend && npm install` |
| 构建命令 | `cd frontend && npm run build` |
| 静态资源目录 | `frontend/dist` |
| 函数文件路径 | （留空） |
| Node.js版本 | `22.x` |

### 步骤4：部署
点击 **"创建并部署"**，等待2-3分钟

---

## ✅ 部署验证

### 功能检查
- [ ] 首页正常加载
- [ ] 设置页面可打开
- [ ] API密钥配置弹窗正常
- [ ] 能创建会话并发送消息

### 边缘函数测试
```bash
curl https://your-domain.er.aliyun-esa.net/api/health
```

---

## 🔧 常见问题

### 问题1：构建失败
确认安装命令：`cd frontend && npm install`

### 问题2：404错误
确认静态资源目录：`frontend/dist`

### 问题3：API调用失败
检查用户是否配置了API密钥

---

## 📝 提交文件模板

```
【作品访问URL】
https://ai-roundtable.8a5362ec.er.aliyun-esa.net

【Github仓库地址】
https://github.com/1195214305/31_AIRoundTable_-AI-

【作品说明】

一、创意卓越
1. 多AI协作新范式：首创多模型轮次讨论机制
2. 温暖配色设计：橙黄暖色系，无AI味儿
3. 流畅交互体验：Framer Motion动画

二、应用价值
1. 提升决策质量：多角度分析问题
2. 节省时间成本：一次获得多个AI见解
3. 知识沉淀：会话导出功能
4. 部署即用：配置API密钥即可使用

三、技术探索
1. 完整边缘生态：Pages + 边缘函数 + 边缘缓存
2. 多AI提供商集成：9个AI提供商统一封装
3. 全球加速：ESA边缘节点就近接入
4. 本地化存储：API密钥安全保护
```
