
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Tashi Delek! Welcome to Druk e-Residency. I\'m here to help you with any questions about our digital residency program. How can I assist you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const predefinedResponses: Record<string, string> = {
    'hello': 'Tashi Delek! How can I help you with your e-residency journey?',
    'hi': 'Tashi Delek! How can I help you with your e-residency journey?',
    'help': 'I can help you with information about e-residency, the application process, required documents, benefits, and technical support. What would you like to know?',
    'application': 'To apply for e-residency, click "Begin Your e-Residency Journey" on the homepage. You\'ll need to connect your MetaMask wallet and complete the KYC process.',
    'kyc': 'KYC (Know Your Customer) involves providing your full name, phone number, email, and connecting your MetaMask wallet. We use blockchain technology to secure your digital identity.',
    'metamask': 'MetaMask is a digital wallet that allows you to interact with blockchain applications. You can download it from metamask.io. We use it to create your secure digital identity.',
    'benefits': 'E-residents can access digital business registration, smart contract notarization, carbon credit trading, Lightning Network payments, and contribute to Bhutan\'s digital economy.',
    'cost': 'This is a demonstration platform. In a real implementation, fees would support Bhutan\'s digital infrastructure and GNH initiatives.',
    'security': 'We use decentralized identity (DID) technology and blockchain to ensure your data is secure and tamper-proof. You maintain full control over your digital identity.',
    'gnh': 'Gross National Happiness is Bhutan\'s development philosophy that values collective happiness and well-being over GDP. E-residents contribute to sustainable development aligned with GNH principles.',
    'blockchain': 'We use blockchain technology to create secure, verifiable digital identities that cannot be tampered with. Your e-residency is recorded on the blockchain for transparency and security.'
  };

  const getBotResponse = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (lowercaseMessage.includes(keyword)) {
        return response;
      }
    }
    
    return 'Thank you for your question! For detailed information about e-residency, please explore our FAQ section or contact our support team. Is there anything specific about the application process, benefits, or technology that I can help clarify?';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getBotResponse(inputValue),
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-end p-6 z-50">
      <Card className="w-full max-w-md h-96 flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 bg-gradient-druk text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <CardTitle className="text-lg">Druk Assistant</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-druk-blue text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm" className="bg-druk-blue">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
