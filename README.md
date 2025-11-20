# Crown & Vow - 新娘头饰无货源电商平台

基于 React + Node.js + MySQL 的高利润婚纱配饰电商系统。

## 功能特点
*   **前端:** 响应式 PC/手机端 UI (React + Tailwind CSS)。
*   **后端:** Express API 处理商品和订单逻辑。
*   **安全:** 1688 进货价和供应商链接严格保存在数据库中，绝不暴露给前端。
*   **支付:** 集成手动支付流程（微信/支付宝/银行转账）。

## 项目结构
本项目为前后端分离结构：
*   `/` - React 前端代码
*   `/backend` - Node.js 后端代码

## 本地运行指南

### 1. 数据库设置
1.  安装 MySQL 或使用云数据库 (Railway/PlanetScale)。
2.  运行 `backend/schema.sql` 中的 SQL 脚本以创建表和写入测试数据。

### 2. 后端设置
```bash
cd backend
npm init -y
npm install express mysql2 cors dotenv
node server.js
```
*请确保在 `.env` 或 `server.js` 中配置了正确的数据库连接信息。*

### 3. 前端设置
```bash
# 安装依赖 (假设使用 Vite 或 Create React App 环境)
npm install
npm start
```

## 部署指南 (Railway)

1.  在 GitHub 上创建新仓库并上传代码。
2.  进入 Railway.app -> New Project -> Deploy from GitHub。
3.  在 Railway 中添加 MySQL 服务。
4.  使用 Railway 提供的 `DATABASE_URL` 环境变量连接 Node 应用。
5.  项目包含 `railway.json`，可实现一键构建。

## 后台管理
*   访问地址: `/admin`
*   默认账号: `admin`
*   默认密码: `admin123` (部署后请立即在 `backend/server.js` 中修改！)
