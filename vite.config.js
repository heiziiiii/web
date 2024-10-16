import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://183.252.181.232:7658/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})

// module.exports = {
//   devServer:{
//     proxy:{
//       '/api':{
//         target:'http://183.252.181.232:7658/api',
//         changeOrigin:true,
//         pathRewrite:{
//           '^/api':''
//         }
//       }
//     }
//   }
// }

// module.exports = {
//   devServer: {
//       // 配置反向代理
//       proxy: {
//           '/ajax': {  // 以/ajax开头的请求
//               target: ' http://183.252.181.232:7658',  // 以/ajax开头的请求，全部代理到https://m.maoyan.com上
//               // ws: true,
//               changeOrigin: true
//           },
//           '/foo': {
//               target: '<other_url>'
//           }
//       }
//   }
// }