
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Users, Circle, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleBeginJourney = () => {
    navigate('/kyc');
  };

  const benefits = [
    {
      icon: Shield,
      title: 'Secure Digital Identity',
      description: 'Your identity secured by blockchain technology and traditional Bhutanese values of trust and integrity.'
    },
    {
      icon: Users,
      title: 'Global Business Opportunities',
      description: 'Access international markets while contributing to Bhutan\'s vision of Gross National Happiness.'
    },
    {
      icon: Circle,
      title: 'Contribute to GNH',
      description: 'Be part of the world\'s first carbon-negative country and contribute to sustainable development goals.'
    }
  ];

  const faqs = [
    {
      question: 'What is Druk e-Residency?',
      answer: 'Druk e-Residency is a digital identity program that allows global citizens to access Bhutanese digital services and contribute to the country\'s digital economy while maintaining our core values of Gross National Happiness.'
    },
    {
      question: 'How does blockchain ensure security?',
      answer: 'We use decentralized identity (DID) technology to create tamper-proof digital identities. Your personal information is cryptographically secured and you maintain full control over your data.'
    },
    {
      question: 'What services can I access?',
      answer: 'E-residents can access digital business registration, smart contract notarization, carbon credit trading, and Lightning Network payments, all while contributing to Bhutan\'s sustainable development.'
    },
    {
      question: 'Is this official government program?',
      answer: 'This is a demonstration of how Bhutan could implement e-residency using Web3 technology. It showcases the potential for secure, decentralized digital identity systems.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-hero"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            Your Digital Gateway to the 
            <span className="block text-druk-gold">Land of the Thunder Dragon</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/90 mb-8 animate-fade-in max-w-2xl mx-auto">
            Embrace Bhutan's digital future with secure, decentralized e-residency powered by Web3 technology
          </p>
          
          <Button 
            onClick={handleBeginJourney}
            className="btn-druk text-lg px-8 py-4 animate-float"
          >
            Begin Your e-Residency Journey
          </Button>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
          <div className="w-6 h-6 border-2 border-white/70 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gradient">
            Why Choose Druk e-Residency?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="card-druk hover:scale-105 transition-transform duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-druk rounded-full flex items-center justify-center">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-druk-red">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gradient">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="card-druk border-none"
              >
                <AccordionTrigger className="text-left text-druk-red hover:text-druk-gold transition-colors duration-200">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-druk">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Ready to Join the Digital Future?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Take the first step towards becoming a digital resident of the happiest country on Earth
          </p>
          <Button 
            onClick={handleBeginJourney}
            className="bg-white text-druk-red hover:bg-white/90 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Start Your Application
          </Button>
        </div>
      </section>

      {/* Support Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsChatOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-druk shadow-lg hover:shadow-xl animate-float"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </div>

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
