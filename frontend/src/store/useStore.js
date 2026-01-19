import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // API配置
      apiKeys: {},
      setApiKey: (provider, key) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: key }
        })),

      // AI模型配置
      models: [
        {
          id: 'qwen-1',
          name: 'Qwen-Plus',
          modelId: 'qwen-plus',
          provider: 'qwen',
          systemPrompt: '你是一位富有创造力的思考者，善于提出新颖的观点和解决方案。',
          enabled: true,
          avatar: '🤖'
        },
        {
          id: 'gpt-1',
          name: 'GPT-4',
          modelId: 'gpt-4',
          provider: 'openai',
          systemPrompt: '你是一位严谨的分析师，善于逻辑推理和批判性思考。',
          enabled: false,
          avatar: '🧠'
        },
        {
          id: 'claude-1',
          name: 'Claude-3-Sonnet',
          modelId: 'claude-3-sonnet-20240229',
          provider: 'anthropic',
          systemPrompt: '你是一位平衡的协调者，善于综合各方观点并寻找共识。',
          enabled: false,
          avatar: '💡'
        }
      ],
      addModel: (model) =>
        set((state) => ({
          models: [...state.models, { ...model, id: `model-${Date.now()}` }]
        })),
      updateModel: (id, updates) =>
        set((state) => ({
          models: state.models.map((m) => (m.id === id ? { ...m, ...updates } : m))
        })),
      removeModel: (id) =>
        set((state) => ({
          models: state.models.filter((m) => m.id !== id)
        })),

      // 会话管理
      sessions: [],
      currentSessionId: null,
      createSession: (topic) => {
        const session = {
          id: `session-${Date.now()}`,
          topic,
          messages: [],
          rounds: 0,
          status: 'idle', // idle, running, paused, completed
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          sessions: [session, ...state.sessions],
          currentSessionId: session.id
        }));
        return session.id;
      },
      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s))
        })),
      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          currentSessionId: state.currentSessionId === id ? null : state.currentSessionId
        })),
      setCurrentSession: (id) => set({ currentSessionId: id }),

      // 消息管理
      addMessage: (sessionId, message) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, { ...message, id: `msg-${Date.now()}` }] }
              : s
          )
        })),

      // 模板管理
      templates: [
        {
          id: 'brainstorm',
          name: '头脑风暴',
          description: '多角度探讨创意想法',
          topic: '如何提升产品的用户体验？',
          systemPrompts: {
            'qwen-1': '你是创意专家，专注于提出新颖独特的想法。',
            'gpt-1': '你是实用主义者，关注可行性和实施细节。',
            'claude-1': '你是用户体验专家，从用户角度思考问题。'
          }
        },
        {
          id: 'debate',
          name: '辩论赛',
          description: '正反方深度辩论',
          topic: '人工智能是否会取代人类工作？',
          systemPrompts: {
            'qwen-1': '你是正方辩手，论证AI将取代大部分人类工作。',
            'gpt-1': '你是反方辩手，论证AI只是工具，不会取代人类。',
            'claude-1': '你是裁判，客观评价双方观点并总结。'
          }
        },
        {
          id: 'problem-solving',
          name: '问题解决',
          description: '协作解决复杂问题',
          topic: '如何在有限预算内提升团队效率？',
          systemPrompts: {
            'qwen-1': '你是战略顾问，提供高层次的解决方案框架。',
            'gpt-1': '你是执行专家，关注具体的实施步骤。',
            'claude-1': '你是风险评估师，指出潜在问题和改进建议。'
          }
        }
      ],

      // UI状态
      showSettings: false,
      showApiKeyModal: false,
      setShowSettings: (show) => set({ showSettings: show }),
      setShowApiKeyModal: (show) => set({ showApiKeyModal: show })
    }),
    {
      name: 'ai-roundtable-storage',
      partialize: (state) => ({
        apiKeys: state.apiKeys,
        models: state.models,
        sessions: state.sessions,
        templates: state.templates
      })
    }
  )
);

export default useStore;
