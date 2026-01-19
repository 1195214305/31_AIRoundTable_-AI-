/**
 * ESA Pages 边缘函数统一入口
 * 根据请求路径分发到对应的处理函数
 */

import chatHandler from './api/chat.js'
import healthHandler from './api/health.js'

async function fetch(request, env) {
  const url = new URL(request.url)
  const path = url.pathname

  // API 路由分发
  if (path.startsWith('/api/')) {
    if (path === '/api/chat' || path === '/api/chat/stream') {
      return chatHandler(request)
    }
    if (path === '/api/health') {
      return healthHandler(request)
    }
    // 未知API路由返回404
    return new Response(JSON.stringify({ error: 'API not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // 对于非API请求，返回404让ESA处理静态资源
  // ESA会自动处理静态文件和SPA路由
  return new Response(null, { status: 404 })
}

export default { fetch }
