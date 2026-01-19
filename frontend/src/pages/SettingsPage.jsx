import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Info, Key, CheckCircle, XCircle } from 'lucide-react';
import useStore from '../store/useStore';

export default function SettingsPage() {
  const { models, addModel, updateModel, removeModel, setShowApiKeyModal, apiKeys, setApiKey } = useStore();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (model) => {
    setEditingId(model.id);
    setEditForm(model);
  };

  const handleSave = () => {
    updateModel(editingId, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    modelId: '',
    provider: 'qwen',
    systemPrompt: '你是一位AI助手。',
    avatar: '🤖'
  });

  const handleAddModel = () => {
    if (!newModel.name || !newModel.modelId) {
      alert('请填写模型名称和模型ID');
      return;
    }

    addModel({
      ...newModel,
      enabled: true
    });

    setNewModel({
      name: '',
      modelId: '',
      provider: 'qwen',
      systemPrompt: '你是一位AI助手。',
      avatar: '🤖'
    });
    setShowAddModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">设置</h1>
          <p className="text-gray-600">配置AI模型和系统参数</p>
        </div>

        {/* API Keys */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">API密钥配置</h2>
              <p className="text-sm text-gray-600">
                配置各AI提供商的API密钥以使用对应的模型
              </p>
            </div>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="btn-primary"
            >
              配置API密钥
            </button>
          </div>

          {/* 已配置的API密钥列表 */}
          {Object.keys(apiKeys).length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">已配置的密钥</h3>
              <div className="space-y-2">
                {Object.entries(apiKeys).map(([provider, key]) => {
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
                    <div
                      key={provider}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {providerNames[provider] || provider}
                          </p>
                          <p className="text-xs text-gray-500">
                            {key.substring(0, 8)}...{key.substring(key.length - 4)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowApiKeyModal(true)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          更换
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`确定要删除${providerNames[provider] || provider}的API密钥吗？`)) {
                              setApiKey(provider, '');
                            }
                          }}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <XCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                还未配置任何API密钥，请点击上方按钮进行配置
              </p>
            </div>
          )}
        </div>

        {/* Models */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">AI模型管理</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 btn-secondary"
            >
              <Plus className="w-4 h-4" />
              <span>添加模型</span>
            </button>
          </div>

          <div className="space-y-3">
            {models.map((model) => (
              <div
                key={model.id}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                {editingId === model.id ? (
                  // 编辑模式
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="input-field"
                      placeholder="模型名称"
                    />
                    <input
                      type="text"
                      value={editForm.avatar}
                      onChange={(e) =>
                        setEditForm({ ...editForm, avatar: e.target.value })
                      }
                      className="input-field"
                      placeholder="头像 (emoji)"
                    />
                    <textarea
                      value={editForm.systemPrompt}
                      onChange={(e) =>
                        setEditForm({ ...editForm, systemPrompt: e.target.value })
                      }
                      className="input-field min-h-[100px]"
                      placeholder="系统提示词"
                    />
                    <div className="flex items-center space-x-2">
                      <button onClick={handleSave} className="btn-primary">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={handleCancel} className="btn-secondary">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // 显示模式
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{model.avatar}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {model.name}
                          </h3>
                          <p className="text-xs text-gray-500">{model.provider}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={model.enabled}
                            onChange={(e) =>
                              updateModel(model.id, { enabled: e.target.checked })
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-600">启用</span>
                        </label>
                        <button
                          onClick={() => handleEdit(model)}
                          className="p-2 rounded-lg hover:bg-gray-100"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('确定要删除这个模型吗？')) {
                              removeModel(model.id);
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {model.systemPrompt}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 添加模型模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">添加AI模型</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI提供商
                  </label>
                  <select
                    value={newModel.provider}
                    onChange={(e) => setNewModel({ ...newModel, provider: e.target.value })}
                    className="input-field"
                  >
                    <option value="qwen">千问 (Qwen)</option>
                    <option value="openai">OpenAI (GPT)</option>
                    <option value="anthropic">Anthropic (Claude)</option>
                    <option value="google">Google (Gemini)</option>
                    <option value="ernie">文心一言 (ERNIE)</option>
                    <option value="spark">讯飞星火 (Spark)</option>
                    <option value="glm">智谱GLM (ChatGLM)</option>
                    <option value="moonshot">月之暗面 (Moonshot)</option>
                    <option value="deepseek">DeepSeek</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    模型名称（显示名称）
                  </label>
                  <input
                    type="text"
                    value={newModel.name}
                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                    placeholder="例如：Qwen-Max"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    模型ID（API调用时使用的模型标识）
                  </label>
                  <input
                    type="text"
                    value={newModel.modelId}
                    onChange={(e) => setNewModel({ ...newModel, modelId: e.target.value })}
                    placeholder="例如：qwen-max"
                    className="input-field"
                  />
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-800">
                        <p className="font-semibold mb-1">常用模型ID参考：</p>
                        <ul className="space-y-1">
                          <li>• 千问：qwen-plus, qwen-max, qwen-turbo</li>
                          <li>• OpenAI：gpt-4, gpt-3.5-turbo, gpt-4-turbo</li>
                          <li>• Claude：claude-3-opus-20240229, claude-3-sonnet-20240229</li>
                          <li>• Gemini：gemini-pro, gemini-1.5-pro</li>
                          <li>• 文心：ernie-4.0, ernie-3.5</li>
                          <li>• 星火：spark-3.5, spark-pro</li>
                          <li>• GLM：glm-4, glm-3-turbo</li>
                          <li>• Moonshot：moonshot-v1-8k, moonshot-v1-32k</li>
                          <li>• DeepSeek：deepseek-chat, deepseek-coder</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    系统提示词（人设）
                  </label>
                  <textarea
                    value={newModel.systemPrompt}
                    onChange={(e) => setNewModel({ ...newModel, systemPrompt: e.target.value })}
                    placeholder="定义AI的角色和行为..."
                    className="input-field min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    头像（Emoji）
                  </label>
                  <input
                    type="text"
                    value={newModel.avatar}
                    onChange={(e) => setNewModel({ ...newModel, avatar: e.target.value })}
                    placeholder="🤖"
                    className="input-field"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button onClick={handleAddModel} className="btn-primary">
                  添加模型
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
