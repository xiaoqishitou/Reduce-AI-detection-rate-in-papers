# 论文降AI率助手

一个帮助用户降低论文AI检测率的在线工具，支持规则改写和AI智能改写。

## 功能特点

- 用户注册/登录（赠送100积分）
- 论文文本改写（规则引擎 + AI改写）
- AI率预估检测
- 积分系统（充值/消费/记录）
- 历史记录管理
- 支持上传 .txt/.docx 文件

## 技术栈

- **前端**: Vue 3 + Vite + Element Plus + Pinia
- **后端**: Express.js + MongoDB + JWT
- **AI**: OpenAI API（可配置）

## 快速开始

### 1. 安装MongoDB

确保本地MongoDB已启动，默认连接 `mongodb://localhost:27017/paper-ai-reducer`

### 2. 配置环境变量

编辑 `server/.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/paper-ai-reducer
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
```

### 3. 启动后端

```bash
cd server
npm install
npm run dev
```

### 4. 启动前端

```bash
cd client
npm install
npm run dev
```

前端默认运行在 http://localhost:5173
后端默认运行在 http://localhost:3000

## 改写模式

| 模式 | 说明 | 积分消耗 |
|------|------|----------|
| 规则改写 | 同义词替换、句式重组 | 低 |
| AI改写 | OpenAI智能改写 | 高 |
| 混合模式 | 规则+AI双重改写（推荐） | 中高 |

## 项目结构

```
├── client/          # Vue前端
│   ├── src/
│   │   ├── api/     # 接口请求
│   │   ├── stores/  # 状态管理
│   │   ├── views/   # 页面组件
│   │   └── router/  # 路由配置
│   └── package.json
├── server/          # Express后端
│   ├── controllers/ # 控制器
│   ├── models/      # 数据模型
│   ├── routes/      # 路由
│   ├── services/    # 业务逻辑
│   └── middlewares/ # 中间件
└── README.md
```
