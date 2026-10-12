import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { 
  MessageSquare, 
  Send, 
  X, 
  Sparkles, 
  Bot, 
  User, 
  Maximize2, 
  Minimize2, 
  HelpCircle,
  Sprout,
  ShieldCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const AgronomistCopilot: React.FC = () => {
  const { language } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: language === 'ta' 
        ? 'வணக்கம்! நான் பெஸ்ட்கார்ட் வேளாண்மை AI உதவியாளர். பயிர் பூச்சிகள், நோய் அறிகுறிகள் அல்லது இயற்கை பூச்சி மேலாண்மை (IPM) பற்றி என்னிடம் கேளுங்கள்.'
        : 'Hello! I am your PestGuard Agronomist AI. Ask me anything about crop pests, symptoms, biological controls, or spray safety thresholds.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterQuestions = language === 'ta' ? [
    'படைப்புழு தாக்குதலை தடுப்பது எப்படி?',
    'தக்காளி இலை துளைப்பான் இயற்கை முறை கட்டுப்பாடு',
    'நெல் புகையான் பூச்சிக்கு எப்போது மருந்து அடிக்க வேண்டும்?'
  ] : [
    'How do I spot Fall Armyworm before whorl damage?',
    'What biological controls work best for Tomato Leafminer?',
    'When should I drain water for Brown Planthopper in rice?'
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/agronomist-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.text
          }))
        })
      });

      const data = await response.json();
      const botReplyText = data.reply || 'Ensure balanced fertilization and monitor fields weekly using pheromone traps.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'model',
        text: 'Integrated Pest Management recommends monitoring egg clusters and using neem-based botanicals before considering synthetic insecticides.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-[#174D35] hover:bg-[#1f5e42] text-white p-3.5 rounded-full shadow-2xl border-2 border-[#63A66A] flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          title="Ask Agronomist AI"
        >
          <div className="relative">
            <Sprout className="w-5 h-5 text-[#63A66A]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-xs font-bold pr-1 hidden sm:inline">Ask Agronomist AI</span>
        </button>
      )}

      {/* Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-[360px] sm:max-w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header */}
          <div className="bg-[#174D35] text-white p-3.5 flex items-center justify-between border-b border-[#216143]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#63A66A] flex items-center justify-center text-[#174D35]">
                <Sprout className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  <span>Agronomist AI Copilot</span>
                  <span className="text-[9px] bg-[#216143] text-[#A3C9A8] px-1.5 py-0.2 rounded border border-[#2e825a]">
                    AI Expert
                  </span>
                </h4>
                <p className="text-[10px] text-[#A3C9A8]">Instant Agronomic Advice & IPM Guidance</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="grow p-4 overflow-y-auto space-y-3 bg-[#F7F9F4] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-6 h-6 rounded-full bg-[#174D35] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-[#63A66A]" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#174D35] text-white rounded-br-xs'
                      : 'bg-white text-gray-800 border border-[#DDE6D5] rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.role === 'user' ? 'text-gray-300' : 'text-gray-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-gray-700" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-gray-500 text-xs">
                <div className="w-6 h-6 rounded-full bg-[#174D35] flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-[#63A66A] animate-pulse" />
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#63A66A] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#63A66A] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#63A66A] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Prompts Chips */}
          {messages.length < 3 && (
            <div className="px-3 pt-2 bg-[#F7F9F4] border-t border-gray-100 flex flex-wrap gap-1">
              {starterQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-[10px] text-[#174D35] bg-white hover:bg-[#EEF2E6] border border-[#DDE6D5] px-2 py-1 rounded-lg text-left truncate max-w-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              placeholder={language === 'ta' ? 'கேள்வியை உள்ளிடவும்...' : 'Ask about pests, IPM, dosage...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="grow px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#63A66A]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-[#174D35] text-white hover:bg-[#1f5e42] disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
