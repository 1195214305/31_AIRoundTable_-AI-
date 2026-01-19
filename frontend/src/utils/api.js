import axios from 'axios';

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:8787/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || '请求失败';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// API方法
export const chatAPI = {
  // 发送消息到AI模型
  sendMessage: async (provider, model, messages, apiKey, systemPrompt, modelId) => {
    return api.post('/chat', {
      provider,
      model,
      modelId,
      messages,
      apiKey,
      systemPrompt
    });
  },

  // 流式响应
  streamMessage: async (provider, model, messages, apiKey, systemPrompt, onChunk) => {
    const response = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        provider,
        model,
        messages,
        apiKey,
        systemPrompt
      })
    });

    if (!response.ok) {
      throw new Error('流式请求失败');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter((line) => line.trim());

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return;
          }
          try {
            const parsed = JSON.parse(data);
            onChunk(parsed);
          } catch (e) {
            console.error('解析流数据失败:', e);
          }
        }
      }
    }
  }
};

// 会话管理API
export const sessionAPI = {
  // 导出会话为Markdown
  exportSession: (session) => {
    let markdown = `# ${session.topic}\n\n`;
    markdown += `创建时间: ${new Date(session.createdAt).toLocaleString('zh-CN')}\n`;
    markdown += `轮次: ${session.rounds}\n\n`;
    markdown += `---\n\n`;

    session.messages.forEach((msg, index) => {
      markdown += `## ${msg.role === 'user' ? '用户' : msg.modelName}\n\n`;
      markdown += `${msg.content}\n\n`;
      if (index < session.messages.length - 1) {
        markdown += `---\n\n`;
      }
    });

    return markdown;
  },

  // 下载Markdown文件
  downloadMarkdown: (session) => {
    const markdown = sessionAPI.exportSession(session);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.topic.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

export default api;
