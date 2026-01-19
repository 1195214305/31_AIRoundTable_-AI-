import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Download, Play, Pause, RotateCcw, Loader2 } from 'lucide-react';
import useStore from '../store/useStore';
import MessageBubble from '../components/MessageBubble';
import { chatAPI, sessionAPI } from '../utils/api';

export default function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const { sessions, updateSession, addMessage, models, apiKeys } = useStore();
  const session = sessions.find((s) => s.id === id);

  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  if (!session) return null;

  const enabledModels = models.filter((m) => m.enabled);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isProcessing) return;

    // 添加用户消息
    addMessage(id, {
      role: 'user',
      content: userInput,
      timestamp: new Date().toISOString()
    });

    setUserInput('');
    setIsProcessing(true);
    updateSession(id, { status: 'running' });

    // 开始AI轮次讨论
    await startRound();
  };

  const startRound = async () => {
    const currentSession = sessions.find((s) => s.id === id);

    for (let i = 0; i < enabledModels.length; i++) {
      setCurrentModelIndex(i);
      const model = enabledModels[i];

      // 检查API密钥
      if (!apiKeys[model.provider]) {
        addMessage(id, {
          role: 'assistant',
          content: `⚠️ 未配置${model.provider}的API密钥，跳过${model.name}`,
          modelName: model.name,
          avatar: model.avatar,
          timestamp: new Date().toISOString()
        });
        continue;
      }

      // 构建消息历史
      const messages = currentSession.messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({
          role: m.role,
          content: m.content
        }));

      try {
        // 调用AI API
        const response = await chatAPI.sendMessage(
          model.provider,
          model.name,
          messages,
          apiKeys[model.provider],
          model.systemPrompt
        );

        // 添加AI回复
        addMessage(id, {
          role: 'assistant',
          content: response.content,
          modelName: model.name,
          avatar: model.avatar,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error(`${model.name} 响应失败:`, error);
        addMessage(id, {
          role: 'assistant',
          content: `❌ ${model.name}响应失败: ${error.message}`,
          modelName: model.name,
          avatar: model.avatar,
          timestamp: new Date().toISOString()
        });
      }

      // 等待一小段时间，避免请求过快
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // 更新会话状态
    updateSession(id, {
      rounds: (currentSession.rounds || 0) + 1,
      status: 'paused'
    });
    setIsProcessing(false);
    setCurrentModelIndex(0);
  };

  const handleExport = () => {
    sessionAPI.downloadMarkdown(session);
  };

  const handleReset = () => {
    if (confirm('确定要重置会话吗？所有消息将被清空。')) {
      updateSession(id, {
        messages: [],
        rounds: 0,
        status: 'idle'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{session.topic}</h1>
              <p className="text-sm text-gray-500 mt-1">
                轮次: {session.rounds} · 消息: {session.messages.length} ·
                状态: {session.status === 'running' ? '讨论中' : session.status === 'paused' ? '已暂停' : '待开始'}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleExport}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="导出为Markdown"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="重置会话"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* 参与模型 */}
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-gray-600">参与模型:</span>
            <div className="flex items-center space-x-2">
              {enabledModels.map((model, index) => (
                <div
                  key={model.id}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                    isProcessing && index === currentModelIndex
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>{model.avatar}</span>
                  <span>{model.name}</span>
                  {isProcessing && index === currentModelIndex && (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="glass-card p-6 min-h-[500px] max-h-[600px] overflow-y-auto">
          {session.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg">还没有消息</p>
                <p className="text-sm mt-2">输入你的问题开始讨论</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {session.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isUser={message.role === 'user'}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="glass-card p-4">
          <div className="flex items-end space-x-3">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="输入你的问题或引导语..."
              className="input-field flex-1 min-h-[80px] resize-none"
              disabled={isProcessing}
            />
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isProcessing}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>
      </motion.div>
    </div>
  );
}
