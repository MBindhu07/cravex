import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Plus, ArrowRight } from 'lucide-react';
import api from '../../services/api.ts';
import { FoodItem } from '../../types/index.ts';
import FoodCustomizationModal from './FoodCustomizationModal.tsx';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  recommendedDishes?: FoodItem[];
  recommendedRestaurants?: any[];
  timestamp: string;
}

export const CraveBotModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "👋 Hey foodie! I'm CraveBot, your personal AI food concierge. Tell me what you're craving, your budget, or your dietary preferences!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [selectedFoodForCustomization, setSelectedFoodForCustomization] = useState<FoodItem | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.chatWithCraveBot(text);
      if (res.success) {
        const botMsg: Message = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: res.botResponse || "Here are some mouth-watering options I handpicked for you:",
          recommendedDishes: res.recommendedDishes || [],
          recommendedRestaurants: res.recommendedRestaurants || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'bot',
          text: "I'm having a little trouble connecting to the food network right now. Try checking our top rated restaurants!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'What should I eat today?',
    'Suggest something under ₹200',
    'I want spicy vegetarian food',
    'Recommend healthy dinner options',
    'Find restaurants with 25-min delivery',
  ];

  return (
    <>
      {/* Floating CraveBot trigger pill */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-500 text-white font-bold text-xs shadow-glow hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span>Ask CraveBot AI</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
        </button>
      </div>

      {/* CraveBot Modal Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 bg-black/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-charcoal-800 rounded-t-3xl sm:rounded-3xl w-full sm:w-[440px] h-[85vh] sm:h-[620px] flex flex-col shadow-2xl border border-orange-100 dark:border-charcoal-700 overflow-hidden animate-in slide-in-from-bottom-6">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary to-orange-500 text-white flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm flex items-center gap-1.5">
                    <span>CraveBot</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  </h3>
                  <p className="text-[10px] text-orange-100">AI Food Discovery Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompt Carousel */}
            <div className="px-3 py-2 bg-orange-50/70 dark:bg-charcoal-900 border-b border-orange-100 dark:border-charcoal-700 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-charcoal-800 border border-orange-200/60 dark:border-charcoal-700 text-[10px] font-semibold text-charcoal-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-all shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Thread */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-br-none shadow-sm'
                        : 'bg-gray-100 dark:bg-charcoal-700 text-charcoal-800 dark:text-gray-100 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Render Interactive Recommended Dishes */}
                    {msg.recommendedDishes && msg.recommendedDishes.length > 0 && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-black/10 dark:border-white/10">
                        {msg.recommendedDishes.map((dish) => (
                          <div
                            key={dish._id}
                            className="bg-white dark:bg-charcoal-800 rounded-xl p-2.5 flex items-center gap-3 border border-orange-100/80 dark:border-charcoal-600 shadow-xs"
                          >
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-12 h-12 rounded-lg object-cover shrink-0"
                            />
                            <div className="flex-grow min-w-0">
                              <p className="font-bold text-xs text-charcoal-800 dark:text-white truncate">
                                {dish.name}
                              </p>
                              <p className="text-[10px] text-gray-500 truncate">
                                {dish.restaurantName || 'Gourmet Kitchen'} • ₹{dish.price}
                              </p>
                            </div>
                            <button
                              onClick={() => setSelectedFoodForCustomization(dish)}
                              className="px-2.5 py-1 rounded-lg bg-primary text-white text-[10px] font-bold hover:bg-primary-600 transition-colors shrink-0 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-gray-100 dark:bg-charcoal-700 text-xs text-gray-500 w-24">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-charcoal-900 border-t border-gray-100 dark:border-charcoal-700 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask CraveBot anything..."
                className="flex-grow px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-charcoal-800 border border-gray-200 dark:border-charcoal-700 text-xs text-charcoal-800 dark:text-gray-100 focus:outline-none focus:border-primary"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputText.trim() || loading}
                className="p-2.5 rounded-2xl bg-primary text-white hover:bg-primary-600 disabled:opacity-40 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedFoodForCustomization && (
        <FoodCustomizationModal
          food={selectedFoodForCustomization}
          isOpen={!!selectedFoodForCustomization}
          onClose={() => setSelectedFoodForCustomization(null)}
        />
      )}
    </>
  );
};

export default CraveBotModal;
