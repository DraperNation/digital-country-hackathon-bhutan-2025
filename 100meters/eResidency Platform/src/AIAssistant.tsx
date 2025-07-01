import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const AIAssistant: React.FC = () => {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: state.language === 'en' 
        ? "Hello! I'm your Bhutan eResidency assistant. I can help you with business formation, compliance questions, and guide you through the entire process. How can I assist you today?"
        : "བཀྲ་ཤིས་བདེ་ལེགས། ང་ཁྱེད་ཀྱི་འབྲུག་གི་ཨི་རེསིཌེནསི་རོགས་རམ་པ་ཡིན། ང་གིས་ཁྱེད་ལ་ཚོང་ལས་གསར་འཛུགས་དང་མཐུན་སྒྲིག་གི་དྲི་བ་ཚོར་རོགས་རམ་བྱེད་ཐུབ། ད་རེས་ང་གིས་ཁྱེད་ལ་ཇི་ལྟར་རོགས་རམ་བྱེད་ཐུབ་བམ?",
      timestamp: new Date(),
      suggestions: [
        state.language === 'en' ? 'How do I start my eResidency application?' : 'ཨི་རེསིཌེནསི་ཞུ་ཡིག་ཇི་ལྟར་འགོ་བཙུགས?',
        state.language === 'en' ? 'What documents do I need for KYC?' : 'KYC ལ་ཡིག་ཆ་གང་དགོས?',
        state.language === 'en' ? 'How long does company formation take?' : 'ཚོང་ལས་གསར་འཛུགས་ལ་དུས་ཚོད་ག་ཚོད་འགོར?',
        state.language === 'en' ? 'What are the tax benefits?' : 'ཁྲལ་གྱི་ཕན་ཐོགས་གང་ཡོད?'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('kyc') || lowerMessage.includes('document')) {
      return state.language === 'en'
        ? "For KYC verification, you'll need: 1) Government-issued photo ID (passport or national ID), 2) A clear selfie holding your ID, and 3) Proof of address (utility bill or bank statement from last 3 months). Our AI system will verify these documents in under 30 seconds!"
        : "KYC ར་སྤྲོད་ཀྱི་དོན་དུ་ཁྱེད་ལ་དགོས་པ་ནི། ༡) གཞུང་གིས་སྤྲད་པའི་པར་དང་བཅས་པའི་ཐོབ་ཐང་ཡིག་ཆ། ༢) ཁྱེད་ཀྱི་ཐོབ་ཐང་ཡིག་ཆ་འཛིན་པའི་གསལ་པོའི་པར། ༣) ཁྱེད་ཀྱི་གནས་ཡུལ་གྱི་སྒྲུབ་ཆ། ང་ཚོའི་AI རིམ་ལུགས་ཀྱིས་སྐར་མ་༣༠་ནང་ཡིག་ཆ་ཚོ་ར་སྤྲོད་བྱེད་ཐུབ།";
    }
    
    if (lowerMessage.includes('company') || lowerMessage.includes('business') || lowerMessage.includes('incorporate')) {
      return state.language === 'en'
        ? "Company formation in Bhutan takes just 15 minutes! You can choose from LLC, Corporation, or Non-Profit structures. The process includes: name availability check, document generation, virtual office assignment, and tax registration. Would you like me to guide you through the specific steps?"
        : "འབྲུག་ནང་ཚོང་ལས་གསར་འཛུགས་བྱེད་པ་ལ་སྐར་མ་༡༥ ཙམ་ལས་མི་འགོར། ཁྱེད་ཀྱིས་LLC, Corporation, ཡང་ན་Non-Profit གི་བཀོད་པ་འདེམས་ཆོག ལས་རིམ་ལ་མིང་ཐོབ་ཚུགས་མིན་ཞིབ་བཤེར་དང་ཡིག་ཆ་བཟོ་བ། བར་སྣང་ཡིག་ཚང་སྤྲོད་པ། ཁྲལ་ཐོ་འགོད་བཅས་ཚུད་ཡོད།";
    }
    
    if (lowerMessage.includes('tax') || lowerMessage.includes('benefit')) {
      return state.language === 'en'
        ? "Bhutan offers excellent tax benefits: 25% corporate tax rate, extensive double taxation treaty network, no capital gains tax on qualifying investments, and R&D incentives. Most international businesses save $15,000+ annually. Would you like me to calculate your potential savings?"
        : "འབྲུག་གིས་ཁྲལ་གྱི་ཕན་ཐོགས་ཡག་པོ་སྤྲད་ཡོད། ཚོང་ལས་ཁྲལ་ཚད་༢༥%། ཁྲལ་ཐེངས་གཉིས་སྤྲོད་མི་དགོས་པའི་མཐུན་འགྲེལ་དྲ་བ་རྒྱ་ཆེ། ཚད་ལྡན་རྒྱུ་སྦྱོར་ལ་རྩ་འབྲས་ཁྲལ་མེད། རྒྱལ་སྤྱིའི་ཚོང་ལས་མང་པོས་ལོ་རེར་དངུལ་༡༥,༠༠༠+ ཉུང་ཐུབ།";
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('how long')) {
      return state.language === 'en'
        ? "Here's the typical timeline: KYC verification (30 seconds - 24 hours), eResidency application review (24 hours - 7 days depending on your plan), and company formation (15 minutes). Fast-track processing is available for premium users!"
        : "སྤྱིར་བཏང་གི་དུས་ཚོད་ནི། KYC ར་སྤྲོད (སྐར་མ་༣༠ - ཆུ་ཚོད་༢༤)། ཨི་རེསིཌེནསི་ཞུ་ཡིག་ཞིབ་བཤེར (ཆུ་ཚོད་༢༤ - ཉིན་༧ ཁྱེད་ཀྱི་འཆར་གཞི་ལ་རག་ལས)། ཚོང་ལས་གསར་འཛུགས (སྐར་མ་༡༥)། མཐོ་རིམ་སྤྱོད་མཁན་ལ་མགྱོགས་པོའི་བྱ་རིམ་ཡོད།";
    }

    if (lowerMessage.includes('learning') || lowerMessage.includes('discount') || lowerMessage.includes('badge')) {
      return state.language === 'en'
        ? "Our gamified learning system lets you earn up to 5% discount on eResidency services! Complete educational modules about business, compliance, and Bhutanese culture to unlock achievement badges and rewards. You can earn 0.5% discount per completed module, with badges ranging from common to legendary rarity!"
        : "ང་ཚོའི་རྩེད་རིགས་སློབ་སྦྱོང་རིམ་ལུགས་ཀྱིས་ཁྱེད་ལ་ཨི་རེསིཌེནསི་ཞབས་ཏོག་ལ་༥% ཚུན་གྱི་ཕབ་ཆ་ཐོབ་ཐུབ། ཚོང་ལས་དང་མཐུན་སྒྲིག། འབྲུག་གི་རིག་གཞུང་སྐོར་སློབ་སྦྱོང་ཚར་བ་བྱས་ན་གྲུབ་འབྲས་ཁ་འདེབས་དང་རྒྱུགས་སྐྱེད་ཐོབ་ཐུབ།";
    }

    if (lowerMessage.includes('community') || lowerMessage.includes('network')) {
      return state.language === 'en'
        ? "Join our global community of 2,847+ eResidents! Connect with entrepreneurs worldwide through our forum, participate in virtual events, find mentors, and discover business partnership opportunities. The community platform includes discussion forums, event calendar, and professional networking features."
        : "ང་ཚོའི་འཛམ་གླིང་གི་ཨི་རེསིཌེནཊ་༢,༨༤༧+ གི་སྤྱི་ཚོགས་ལ་ཞུགས་རོགས། འཛམ་གླིང་ཡོངས་ཀྱི་ཚོང་པ་ཚོ་དང་འབྲེལ་བ་འདྲིས་ཏེ་གླེང་སྟེགས། བར་སྣང་མཛད་སྒོ། དགེ་རྒན་འཚོལ་བ། ཚོང་ལས་མཉམ་ལས་གོ་སྐབས་རྙེད་ཐུབ།";
    }

    if (lowerMessage.includes('banking') || lowerMessage.includes('account')) {
      return state.language === 'en'
        ? "Our Banking Hub partners with 4 major international banks including HSBC, DBS, Standard Chartered, and Revolut Business. You can open business accounts with special eResident benefits like reduced fees, faster processing, and dedicated support. Most accounts can be opened in 3-7 days!"
        : "ང་ཚོའི་དངུལ་ཁང་ལྟེ་གནས་ཀྱིས་HSBC, DBS, Standard Chartered, དང་Revolut Business བཅས་རྒྱལ་སྤྱིའི་དངུལ་ཁང་ཆེན་པོ་༤ དང་མཉམ་ལས་བྱེད། ཁྱེད་ཀྱིས་ཨི་རེསིཌེནཊ་གི་ཁྱད་ཆོས་ཐོག་ཚོང་ལས་རྩིས་ཁྲ་ཕྱེ་ཐུབ།";
    }
    
    return state.language === 'en'
      ? "I understand you're asking about our eResidency platform. I can help with applications, document requirements, company formation, tax benefits, timelines, compliance questions, learning rewards, community features, and banking services. Could you please be more specific about what you'd like to know?"
      : "ང་གོ་བ་ཐུབ་སོང་ཁྱེད་ཀྱིས་ང་ཚོའི་ཨི་རེསིཌེནསི་མཉེན་ཆས་སྐོར་དྲི་བ་དྲིས་འདུག ང་གིས་ཞུ་ཡིག་དང་ཡིག་ཆ་དགོས་མཁོ། ཚོང་ལས་གསར་འཛུགས། ཁྲལ་གྱི་ཕན་ཐོགས། དུས་ཚོད། མཐུན་སྒྲིག་གི་དྲི་བ་ཚོར་རོགས་རམ་བྱེད་ཐུབ། ཁྱེད་ཀྱིས་ཅི་ཤེས་འདོད་པ་གསལ་པོར་བཤད་ཐུབ་བམ?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await getAIResponse(inputValue);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        suggestions: [
          state.language === 'en' ? 'Tell me more about this' : 'འདི་སྐོར་ཁ་སྐོང་བཤད',
          state.language === 'en' ? 'What are the next steps?' : 'རྗེས་མའི་གོ་རིམ་གང་ཡིན?',
          state.language === 'en' ? 'Show me an example' : 'དཔེ་ཞིག་སྟོན',
          state.language === 'en' ? 'How much does it cost?' : 'གོང་ཚད་ག་ཚོད?'
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: state.language === 'en' 
          ? "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team."
          : "དགོངས་དག ད་ལྟ་ང་ལ་ཁྱེད་ཀྱི་ཞུ་ཡིག་བྱེད་སྒོ་ཁག་པོ་འདུག ཡང་བསྐྱར་ཚོད་ལྟ་གནང་རོགས་ཡང་ན་ང་ཚོའི་རམ་འདེགས་སྡེ་ཚན་དང་འབྲེལ་བ་འདྲིས་རོགས།",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        data-chat-button
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40 flex items-center justify-center ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="h-6 w-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className={`fixed bottom-6 right-6 w-96 h-[600px] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border ${
              state.theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {state.language === 'en' ? 'AI Assistant' : 'AI རོགས་རམ་པ'}
                  </h3>
                  <p className="text-xs text-yellow-100">
                    {state.language === 'en' ? 'Online • Instant replies' : 'ཐོག་མར་ཡོད • འཕྲལ་དུ་ལན'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-yellow-600 text-white' 
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      }`}>
                        {message.type === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                      </div>
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-yellow-600 text-white'
                          : state.theme === 'dark'
                            ? 'bg-gray-700 text-gray-100'
                            : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' 
                            ? 'text-yellow-200' 
                            : state.theme === 'dark' 
                              ? 'text-gray-400' 
                              : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.type === 'assistant' && (
                      <div className="mt-2 ml-10 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`block w-full text-left px-3 py-1 text-xs rounded-lg transition-colors ${
                              state.theme === 'dark'
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className="flex space-x-1">
                        <div className={`w-2 h-2 rounded-full animate-bounce ${
                          state.theme === 'dark' ? 'bg-gray-400' : 'bg-gray-400'
                        }`} />
                        <div className={`w-2 h-2 rounded-full animate-bounce ${
                          state.theme === 'dark' ? 'bg-gray-400' : 'bg-gray-400'
                        }`} style={{ animationDelay: '0.1s' }} />
                        <div className={`w-2 h-2 rounded-full animate-bounce ${
                          state.theme === 'dark' ? 'bg-gray-400' : 'bg-gray-400'
                        }`} style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${
              state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={state.language === 'en' ? 'Type your message...' : 'ཁྱེད་ཀྱི་འཕྲིན་ཡིག་འབྲི་རོགས...'}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none ${
                      state.theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    rows={1}
                    style={{ minHeight: '40px', maxHeight: '100px' }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};