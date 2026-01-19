import { Link } from 'react-router-dom';
import { Settings, History, MessageSquare } from 'lucide-react';

export default function Header() {
  return (
    <header className="glass-card sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                AI圆桌会议
              </h1>
              <p className="text-xs text-gray-500">多模型协作讨论平台</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-2">
            <Link
              to="/history"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="历史会话"
            >
              <History className="w-5 h-5 text-gray-600" />
            </Link>
            <Link
              to="/settings"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="设置"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
