import { X, Key, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import useStore from '../store/useStore';

export default function ApiKeyModal() {
  const { showApiKeyModal, setShowApiKeyModal, apiKeys, setApiKey, models } = useStore();
  const [localKeys, setLocalKeys] = useState({});
  const [showKeys, setShowKeys] = useState({});

  if (!showApiKeyModal) return null;

  const providers = [...new Set(models.map((m) => m.provider))];

  const handleSave = () => {
    Object.entries(localKeys).forEach(([provider, key]) => {
      if (key.trim()) {
        setApiKey(provider, key.trim());
      }
    });
    setShowApiKeyModal(false);
  };

  const providerNames = {
    qwen: '千问 (Qwen)',
    openai: 'OpenAI (GPT)',
    anthropic: 'Anthropic (Claude)',
    google: 'Google (Gemini)',
    ernie: '文心一言 (ERNIE)',
    spark: '讯飞星火 (Spark)',
    glm: '智谱GLM (ChatGLM)',
    moonshot: '月之暗面 (Moonshot)',
    deepseek: 'DeepSeek'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">配置API密钥</h2>
                <p className="text-sm text-gray-500">设置各AI提供商的API密钥</p>
              </div>
            </div>
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* API Key Inputs */}
          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {providerNames[provider] || provider}
                  {apiKeys[provider] && (
                    <span className="ml-2 text-xs text-green-600">✓ 已配置</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showKeys[provider] ? 'text' : 'password'}
                    placeholder={`输入${providerNames[provider] || provider}的API密钥`}
                    defaultValue={apiKeys[provider] || ''}
                    onChange={(e) =>
                      setLocalKeys((prev) => ({ ...prev, [provider]: e.target.value }))
                    }
                    className="input-field pr-10"
                  />
                  {(apiKeys[provider] || localKeys[provider]) && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showKeys[provider] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {provider === 'qwen' && '获取地址: https://dashscope.console.aliyun.com/apiKey'}
                  {provider === 'openai' && '获取地址: https://platform.openai.com/api-keys'}
                  {provider === 'anthropic' && '获取地址: https://console.anthropic.com/'}
                  {provider === 'google' && '获取地址: https://makersuite.google.com/app/apikey'}
                  {provider === 'ernie' && '获取地址: https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application'}
                  {provider === 'spark' && '获取地址: https://console.xfyun.cn/services/bm3'}
                  {provider === 'glm' && '获取地址: https://open.bigmodel.cn/usercenter/apikeys'}
                  {provider === 'moonshot' && '获取地址: https://platform.moonshot.cn/console/api-keys'}
                  {provider === 'deepseek' && '获取地址: https://platform.deepseek.com/api_keys'}
                </p>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>提示：</strong>API密钥将保存在浏览器本地存储中，不会上传到服务器。
              请妥善保管您的密钥，不要分享给他人。
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="btn-secondary"
            >
              取消
            </button>
            <button onClick={handleSave} className="btn-primary">
              保存配置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
