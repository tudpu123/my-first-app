# 同城优质交友平台 - Vercel部署指南

这是一个适配了Vercel平台的同城优质交友平台项目。

## 项目结构

```
├── 1.html                 # 主页面文件
├── api/                   # Serverless函数目录
│   ├── notify.js          # 异步回调处理函数
│   └── return.js          # 同步回调处理函数
├── vercel.json            # Vercel配置文件
├── package.json           # Node.js依赖配置
└── README.md             # 项目说明文档
```

## 部署到Vercel

### 方法一：通过GitHub部署（推荐）

1. 将代码推送到GitHub仓库
2. 访问 [Vercel官网](https://vercel.com)
3. 使用GitHub账号登录
4. 点击"New Project"
5. 选择你的GitHub仓库
6. 保持默认配置，点击"Deploy"

### 方法二：通过Vercel CLI部署

1. 安装Vercel CLI：
   ```bash
   npm i -g vercel
   ```

2. 在项目根目录运行：
   ```bash
   vercel
   ```

3. 按照提示完成部署

### 方法三：直接上传部署

1. 访问 [Vercel官网](https://vercel.com)
2. 点击"New Project"
3. 选择"Import Git Repository"
4. 或者直接拖拽项目文件夹到部署区域

## 配置说明

### vercel.json
- 定义了构建规则和路由配置
- 静态HTML文件使用`@vercel/static`构建器
- API函数使用`@vercel/node`构建器
- 设置了函数最大执行时间为30秒

### API函数
- `api/notify.js`: 处理支付平台的异步回调通知
- `api/return.js`: 处理用户支付完成后的同步回调跳转

### 支付配置
项目已配置为使用第三方易支付平台，回调URL已指向Vercel的API路由：
- 异步回调：`/api/notify`
- 同步回调：`/api/return`

## 注意事项

1. **支付回调**: 确保支付平台配置的回调地址指向你的Vercel域名
2. **环境变量**: 如果需要配置敏感信息，可以在Vercel的项目设置中添加环境变量
3. **域名配置**: 部署后可以配置自定义域名
4. **HTTPS**: Vercel自动提供HTTPS支持

## 本地开发

```bash
# 安装依赖
npm install

# 启动本地开发服务器
npm run dev
```

## 支付测试

部署完成后，可以通过以下方式测试支付功能：

1. 访问部署的网站
2. 选择支付服务（微信群聊VIP或红娘牵线VIP）
3. 使用测试支付方式完成支付流程
4. 验证回调功能是否正常工作

## 技术支持

如果在部署过程中遇到问题，可以参考：
- [Vercel官方文档](https://vercel.com/docs)
- [Vercel部署指南](https://vercel.com/guides)

## 许可证

MIT License