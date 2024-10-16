var express = require('express');
const proxy = require('http-proxy-middleware');
const app = express();
app.set('port', 809);           // 你NodeJs代理端口

// 配置反向代理选项
var options = {
  target: 'http://183.252.181.232:7658',    // 目标服务器地址
  changeOrigin: true,                       // 修改请求头的origin
  pathRewrite: {'^/api': ''},               // 重写路径，去除前缀
  secure: false                             // 禁用SSL证书验证（如果目标服务器使用HTTPS）
};

// 创建代理中间件
var apiProxy = proxy(options);

// 使用代理中间件处理以 '/api' 开头的所有请求
app.use('/api', apiProxy);

// 启动服务器
app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});