import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseMarkdown, shouldCollapse } from '../utils/markdown';

export default function MessageBubble({ message, isUser }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsCollapse = shouldCollapse(message.content);

  const displayContent = needsCollapse && !isExpanded
    ? message.content.slice(0, 500) + '...'
    : message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar and Name */}
        <div className={`flex items-center space-x-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {!isUser && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg">
              {message.avatar || '🤖'}
            </div>
          )}
          <span className="text-sm font-medium text-gray-700">
            {isUser ? '你' : message.modelName}
          </span>
          {isUser && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-lg">
              👤
            </div>
          )}
        </div>

        {/* Message Content */}
        <div
          className={`glass-card p-4 ${
            isUser
              ? 'bg-gradient-to-br from-secondary-50 to-secondary-100'
              : 'bg-white'
          }`}
        >
          <div
            className="markdown-content prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(displayContent) }}
          />

          {/* Expand/Collapse Button */}
          {needsCollapse && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>收起</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>展开全文</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString('zh-CN')}
        </div>
      </div>
    </motion.div>
  );
}
