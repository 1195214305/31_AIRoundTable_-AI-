/**
 * 边缘函数: AI聊天接口
 * 路径: /api/chat
 * 支持: 千问、OpenAI、Anthropic、Google、文心一言、讯飞星火、智谱GLM、Moonshot、DeepSeek
 */

// AI提供商端点配置
const ENDPOINTS = {
  qwen: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
  openai: 'https://api.openai.com/v1/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  google: 'https://generativelanguage.googleapis.com/v1beta/models',
  ernie: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat',
  spark: 'https://spark-api.xf-yun.com/v3.5/chat',
  glm: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  moonshot: 'https://api.moonshot.cn/v1/chat/completions',
  deepseek: 'https://api.deepseek.com/v1/chat/completions'
};

/**
 * 调用千问API
 */
async function callQwen(messages, apiKey, systemPrompt, modelId) {
  const qwenMessages = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content
  }));

  if (systemPrompt) {
    qwenMessages.unshift({ role: 'system', content: systemPrompt });
  }

  const response = await fetch(ENDPOINTS.qwen, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelId || 'qwen-plus',
      input: { messages: qwenMessages },
      parameters: { result_format: 'message' }
    })
  });

  if (!response.ok) {
    throw new Error(`千问API错误: ${await response.text()}`);
  }

  const data = await response.json();
  return data.output.choices[0].message.content;
}

/**
 * 调用OpenAI兼容API (OpenAI, GLM, Moonshot, DeepSeek)
 */
async function callOpenAICompatible(endpoint, messages, apiKey, systemPrompt, modelId) {
  const apiMessages = [...messages];
  if (systemPrompt) {
    apiMessages.unshift({ role: 'system', content: systemPrompt });
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelId,
      messages: apiMessages
    })
  });

  if (!response.ok) {
    throw new Error(`API错误: ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * 调用Anthropic API
 */
async function callAnthropic(messages, apiKey, systemPrompt, modelId) {
  const response = await fetch(ENDPOINTS.anthropic, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: modelId || 'claude-3-sonnet-20240229',
      max_tokens: 4096,
      system: systemPrompt || 'You are a helpful assistant.',
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API错误: ${await response.text()}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * 调用Google Gemini API
 */
async function callGoogle(messages, apiKey, systemPrompt, modelId) {
  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  if (systemPrompt) {
    contents.unshift({ role: 'user', parts: [{ text: systemPrompt }] });
  }

  const endpoint = `${ENDPOINTS.google}/${modelId || 'gemini-pro'}:generateContent?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });

  if (!response.ok) {
    throw new Error(`Google API错误: ${await response.text()}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * 主处理函数
 */
export default async function handler(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: '仅支持POST请求' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { provider, model, modelId, messages, apiKey, systemPrompt } = body;

    if (!provider || !messages || !apiKey) {
      return new Response(
        JSON.stringify({ error: '缺少必要参数: provider, messages, apiKey' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let content;
    const finalModelId = modelId || model;

    switch (provider) {
      case 'qwen':
        content = await callQwen(messages, apiKey, systemPrompt, finalModelId);
        break;
      case 'openai':
        content = await callOpenAICompatible(ENDPOINTS.openai, messages, apiKey, systemPrompt, finalModelId || 'gpt-3.5-turbo');
        break;
      case 'anthropic':
        content = await callAnthropic(messages, apiKey, systemPrompt, finalModelId);
        break;
      case 'google':
        content = await callGoogle(messages, apiKey, systemPrompt, finalModelId);
        break;
      case 'glm':
        content = await callOpenAICompatible(ENDPOINTS.glm, messages, apiKey, systemPrompt, finalModelId || 'glm-4');
        break;
      case 'moonshot':
        content = await callOpenAICompatible(ENDPOINTS.moonshot, messages, apiKey, systemPrompt, finalModelId || 'moonshot-v1-8k');
        break;
      case 'deepseek':
        content = await callOpenAICompatible(ENDPOINTS.deepseek, messages, apiKey, systemPrompt, finalModelId || 'deepseek-chat');
        break;
      case 'ernie':
      case 'spark':
        return new Response(
          JSON.stringify({ error: `${provider}暂不支持，请使用其他AI提供商` }),
          { status: 501, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      default:
        return new Response(
          JSON.stringify({ error: `不支持的提供商: ${provider}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Chat API错误:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
