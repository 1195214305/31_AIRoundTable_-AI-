import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import useStore from '../store/useStore';

export default function SettingsPage() {
  const { models, addModel, updateModel, removeModel, setShowApiKeyModal } = useStore();
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

  const handleAddModel = () => {
    const name = prompt('输入模型名称:');
    if (!name) return;

    const provider = prompt('输入提供商 (qwen/openai/anthropic/google):');
    if (!provider) return;

    addModel({
      name,
      provider,
      systemPrompt: '你是一位AI助手。',
      enabled: true,
      avatar: '🤖'
    });
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
          <h2 className="text-xl font-bold text-gray-900">API密钥配置</h2>
          <p className="text-sm text-gray-600">
            配置各AI提供商的API密钥以使用对应的模型
          </p>
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="btn-primary"
          >
            配置API密钥
          </button>
        </div>

        {/* Models */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">AI模型管理</h2>
            <button
              onClick={handleAddModel}
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
    </div>
  );
}
