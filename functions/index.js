/**
 * ESA Pages 边缘函数统一入口
 * 根据请求路径分发到对应的处理函数
 */

import chatHandler from './api/chat.js';
import healthHandler from './api/health.js';

async function fetch(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS 处理
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // API 路由分发
  if (path === '/api/chat' || path === '/api/chat/stream') {
    return chatHandler(request, corsHeaders);
  }

  if (path === '/api/health') {
    return healthHandler(request, corsHeaders);
  }

  // 非 API 请求，返回 404 让 ESA 处理静态资源
  return new Response(null, { status: 404 });
}

export default { fetch };
