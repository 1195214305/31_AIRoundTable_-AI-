import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trash2, Clock, MessageSquare } from 'lucide-react';
import useStore from '../store/useStore';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { sessions, deleteSession, setCurrentSession } = useStore();

  const handleOpenSession = (id) => {
    setCurrentSession(id);
    navigate(`/session/${id}`);
  };

  const handleDeleteSession = (id, e) => {
    e.stopPropagation();
    if (confirm('确定要删除这个会话吗？')) {
      deleteSession(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">历史会话</h1>
          <p className="text-gray-600">查看和管理你的讨论记录</p>
        </div>

        {sessions.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">还没有历史会话</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary mt-4"
            >
              开始新讨论
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleOpenSession(session.id)}
                className="glass-card p-6 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {session.topic}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(session.createdAt).toLocaleString('zh-CN')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{session.messages.length} 条消息</span>
                      </div>
                      <span>轮次: {session.rounds}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
