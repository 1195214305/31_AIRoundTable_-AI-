import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, Users, Zap, Key } from 'lucide-react';
import useStore from '../store/useStore';

export default function HomePage() {
  const navigate = useNavigate();
  const { createSession, templates, apiKeys, setShowApiKeyModal } = useStore();
  const [topic, setTopic] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleStart = () => {
    // 检查是否配置了API密钥
    const hasApiKey = Object.keys(apiKeys).length > 0;
    if (!hasApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    const finalTopic = selectedTemplate ? selectedTemplate.topic : topic;
    if (!finalTopic.trim()) {
      alert('请输入讨论话题或选择模板');
      return;
    }

    const sessionId = createSession(finalTopic);
    navigate(`/session/${sessionId}`);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setTopic(template.topic);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-12"
      >
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-block"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 bg-clip-text text-transparent">
            AI圆桌会议
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            让多个AI模型围绕话题展开讨论，通过协作迭代出更优秀的答案
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 space-y-3"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900">多模型协作</h3>
              <p className="text-sm text-gray-600">
                支持千问、GPT、Claude等多个AI模型同时参与讨论
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 space-y-3"
            >
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-gray-900">智能迭代</h3>
              <p className="text-sm text-gray-600">
                AI模型轮次发言，相互启发，逐步完善答案
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 space-y-3"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">边缘加速</h3>
              <p className="text-sm text-gray-600">
                基于阿里云ESA边缘计算，响应速度更快
              </p>
            </motion.div>
          </div>
        </div>

        {/* Start Section */}
        <div className="glass-card p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">开始新的讨论</h2>

          {/* Topic Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              讨论话题
            </label>
            <textarea
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setSelectedTemplate(null);
              }}
              placeholder="输入你想讨论的话题，例如：如何提升产品的用户体验？"
              className="input-field min-h-[100px] resize-none"
            />
          </div>

          {/* Templates */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              或选择讨论模板
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTemplate?.id === template.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-gray-600">{template.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* API Key Notice */}
          {Object.keys(apiKeys).length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
              <Key className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-yellow-800">
                  <strong>提示：</strong>首次使用需要配置API密钥。点击开始后将引导您配置。
                </p>
              </div>
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={!topic.trim() && !selectedTemplate}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            开始讨论
          </button>
        </div>

        {/* How it works */}
        <div className="glass-card p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">如何使用</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">配置API密钥</h3>
                <p className="text-sm text-gray-600">
                  在设置中配置千问、GPT、Claude等AI提供商的API密钥
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">发起讨论</h3>
                <p className="text-sm text-gray-600">
                  输入讨论话题或选择预设模板，启动AI圆桌会议
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">观察讨论</h3>
                <p className="text-sm text-gray-600">
                  AI模型按轮次发言，您可以随时介入引导讨论方向
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">导出结果</h3>
                <p className="text-sm text-gray-600">
                  讨论结束后可导出为Markdown文件，方便保存和分享
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
