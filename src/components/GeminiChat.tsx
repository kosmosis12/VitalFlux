import React, { useState } from 'react';
import { PaperPlaneTilt, Spinner } from '@phosphor-icons/react';
import { generateWidgetConfig } from '../services/geminiService'; // Import the service

// Define the message structure
interface Message {
  text: string;
  isUser: boolean;
}

// Update props to include error handling
interface GeminiChatProps {
  onNewWidget: (widgetConfig: any) => void;
  onError: (errorMessage: string) => void;
}

const GeminiChat: React.FC<GeminiChatProps> = ({ onNewWidget, onError }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Call the actual geminiService to get the widget configuration
    const result = await generateWidgetConfig(userMessage.text);
    setIsLoading(false);

    // Handle the response from the API
    if (result && !result.error) {
      const aiResponse: Message = {
        text: `Of course. Here is the chart for "${result.title}".`,
        isUser: false,
      };
      setMessages(prev => [...prev, aiResponse]);
      onNewWidget(result);
    } else {
      const errorMessage = result?.error || 'Sorry, I was unable to create that chart.';
      const errorResponse: Message = { text: errorMessage, isUser: false };
      setMessages(prev => [...prev, errorResponse]);
      onError(errorMessage);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col h-[500px] border dark:border-gray-700">
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
        {/* Show a spinner when the AI is "thinking" */}
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
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={isLoading}
        />
        <button 
            onClick={handleSend} 
            className="ml-2 p-2 rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:bg-primary-300" 
            disabled={isLoading}
        >
          <PaperPlaneTilt size={20} />
        </button>
      </div>
    </div>
  );
};

export default GeminiChat;