/**
 * 边缘函数: AI聊天接口
 * 路径: /api/chat
 * 支持: 千问(Qwen)、OpenAI(GPT)、Anthropic(Claude)、Google(Gemini)
 */

// AI提供商配置
const PROVIDERS = {
  qwen: {
    endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    models: {
      'Qwen-Plus': 'qwen-plus',
      'Qwen-Turbo': 'qwen-turbo',
      'Qwen-Max': 'qwen-max'
    }
  },
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    models: {
      'GPT-4': 'gpt-4',
      'GPT-3.5': 'gpt-3.5-turbo'
    }
  },
  anthropic: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    models: {
      'Claude-3': 'claude-3-sonnet-20240229',
      'Claude-3-Opus': 'claude-3-opus-20240229'
    }
  },
  google: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    models: {
      'Gemini-Pro': 'gemini-pro'
    }
  }
};

/**
 * 调用千问API
 */
async function callQwen(messages, apiKey, systemPrompt, model = 'qwen-plus') {
  const qwenMessages = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content
  }));

  // 添加系统提示词
  if (systemPrompt) {
    qwenMessages.unshift({
      role: 'system',
      content: systemPrompt
    });
  }

  const response = await fetch(PROVIDERS.qwen.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input: {
        messages: qwenMessages
      },
      parameters: {
        result_format: 'message'
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`千问API错误: ${error}`);
  }

  const data = await response.json();
  return data.output.choices[0].message.content;
}

/**
 * 调用OpenAI API
 */
async function callOpenAI(messages, apiKey, systemPrompt, model = 'gpt-3.5-turbo') {
  const openaiMessages = [...messages];

  // 添加系统提示词
  if (systemPrompt) {
    openaiMessages.unshift({
      role: 'system',
      content: systemPrompt
    });
  }

  const response = await fetch(PROVIDERS.openai.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: openaiMessages
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API错误: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * 调用Anthropic API
 */
async function callAnthropic(messages, apiKey, systemPrompt, model = 'claude-3-sonnet-20240229') {
  const anthropicMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content
  }));

  const response = await fetch(PROVIDERS.anthropic.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemPrompt || 'You are a helpful assistant.',
      messages: anthropicMessages
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API错误: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * 调用Google Gemini API
 */
async function callGoogle(messages, apiKey, systemPrompt, model = 'gemini-pro') {
  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // 添加系统提示词
  if (systemPrompt) {
    contents.unshift({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
  }

  const endpoint = `${PROVIDERS.google.endpoint}/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google API错误: ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * 主处理函数
 */
export default async function handler(request, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: '仅支持POST请求' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { provider, model, messages, apiKey, systemPrompt } = body;

    // 验证参数
    if (!provider || !messages || !apiKey) {
      return new Response(
        JSON.stringify({ error: '缺少必要参数: provider, messages, apiKey' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 根据提供商调用对应API
    let content;
    switch (provider) {
      case 'qwen':
        content = await callQwen(messages, apiKey, systemPrompt, PROVIDERS.qwen.models[model] || 'qwen-plus');
        break;
      case 'openai':
        content = await callOpenAI(messages, apiKey, systemPrompt, PROVIDERS.openai.models[model] || 'gpt-3.5-turbo');
        break;
      case 'anthropic':
        content = await callAnthropic(messages, apiKey, systemPrompt, PROVIDERS.anthropic.models[model] || 'claude-3-sonnet-20240229');
        break;
      case 'google':
        content = await callGoogle(messages, apiKey, systemPrompt, PROVIDERS.google.models[model] || 'gemini-pro');
        break;
      default:
        return new Response(
          JSON.stringify({ error: `不支持的提供商: ${provider}` }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }

    return new Response(
      JSON.stringify({ content }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Chat API错误:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}
