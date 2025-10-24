// src/components/GeminiChat.tsx
import React, { useState } from 'react';
import { PaperPlaneTilt, Spinner } from '@phosphor-icons/react';
import { generateWidgetConfig } from '../services/geminiService';
import type { WidgetConfig } from '../services/geminiService';

interface Message {
  text: string;
  isUser: boolean;
}

interface GeminiChatProps {
  onNewWidget: (widgetConfig: WidgetConfig) => void;
  onError: (errorMessage: string) => void;
}

const GeminiChat: React.FC<GeminiChatProps> = ({ onNewWidget, onError }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = { text: trimmedInput, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await generateWidgetConfig(trimmedInput);
    setIsLoading(false);

    if (result && 'error' in result) {
      const errorMessage = String(result.error || 'Sorry, I was unable to create that widget.');
      const errorResponse: Message = { text: errorMessage, isUser: false };
      setMessages(prev => [...prev, errorResponse]);
      onError(errorMessage);
    } else {
      const title = typeof result.title === 'string' ? result.title : 'your request';
      const successMessage: Message = { text: `✅ Widget created for "${title}".`, isUser: false };
      setMessages(prev => [...prev, successMessage]);
      onNewWidget(result);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-96 bg-stone-50 dark:bg-gray-800 rounded-lg shadow-xl flex flex-col h-[500px] border dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="font-bold text-lg dark:text-white">VitalFlux AI Assistant</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs rounded-lg px-3 py-2 ${msg.isUser ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start gap-2">
                 <div className="max-w-xs rounded-lg px-3 py-2 bg-gray-200 dark:bg-gray-700">
                    <Spinner size={20} className="animate-spin" />
                 </div>
            </div>
        )}
      </div>
      <div className="p-4 border-t dark:border-gray-700 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="e.g., show patient risk levels"
          className="w-full px-3 py-2 border rounded-md bg-stone-100 text-gray-900 placeholder-gray-500 border-stone-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={isLoading}
        />
        <button 
            onClick={handleSend} 
            className="ml-2 p-2 rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:bg-primary-300" 
            disabled={isLoading || !input.trim()}
        >
          <PaperPlaneTilt size={20} />
        </button>
      </div>
    </div>
  );
};

export default GeminiChat;
