"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Navigation } from '@/components/navigation';
import { DzongkhaInput } from '@/components/dzongkha-input';
import { CulturalCalendar } from '@/components/cultural-calendar';
import { mockChatMessages, mockAuditEntries } from '@/lib/mock-data';
import { dzongkhaNLP } from '@/lib/dzongkha-nlp';
import { culturalKnowledge } from '@/lib/cultural-knowledge';
import { Send, Upload, FileText, Clock, User, Bot, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage, AuditEntry } from '@/types';

interface MessageAnalysis {
  entities: any[];
  formality: string;
  complexity: number;
  sentiment: {
    polarity: number;
    cultural_context?: string;
  };
}

interface CulturalContext {
  culturalTerms: string[];
  appropriateGreeting: string;
  culturalSensitivities: string[];
  relatedConcepts: string[];
}

export default function ConsolePage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('druk-gpt-base');
  const [isDzongkha, setIsDzongkha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Simulate message analysis for demo purposes
    const messageAnalysis: MessageAnalysis = {
      entities: [],
      formality: 'formal',
      complexity: 0.5,
      sentiment: {
        polarity: 0.1,
        cultural_context: 'general'
      }
    };
    
    const culturalContext: CulturalContext = {
      culturalTerms: [],
      appropriateGreeting: 'བཀྲ་ཤིས་བདེ་ལེགས།',
      culturalSensitivities: [],
      relatedConcepts: []
    };

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
      metadata: {
        model: selectedModel,
        language: isDzongkha ? 'dz' : 'en',
        analysis: messageAnalysis,
        culturalContext: culturalContext,
      },
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Generate culturally appropriate response
      const culturalResponse = culturalContext.appropriateGreeting;
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: isDzongkha 
          ? `${culturalResponse} ཁྱེད་རང་གི་དྲི་བ་ལ་ལན་འདེབས་ཞུ་ན། འདི་ནི་DrukGPT ནས་ཕྱིར་ལོག་གི་ལན་ཞིག་ཡིན། ངོ་མའི་སྒྲིག་འཇུག་ནང་དུ་ནི་AI མོ་ཌེལ་གྱིས་གསར་སྐྲུན་བྱེད་ངེས།`
          : `${culturalResponse} This is a simulated response from DrukGPT with cultural awareness. The AI has detected ${messageAnalysis.entities.length} cultural references and adjusted its response accordingly.`,
        role: 'assistant',
        timestamp: new Date(),
        sources: [
          {
            id: 'source1',
            title: 'Relevant Document',
            url: 'https://example.com/doc',
            excerpt: 'Relevant information found in the knowledge base...',
            confidence: 0.85,
            type: 'document',
          },
        ],
        metadata: {
          model: selectedModel,
          language: isDzongkha ? 'dz' : 'en',
          tokens: 150,
          culturallyEnhanced: true,
          analysis: messageAnalysis,
          culturalContext: culturalContext,
        },
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
          
          {/* Main Chat Interface - 2/3 width */}
          <div className="lg:col-span-2 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 font-jomolhari">
                    <Bot className="h-5 w-5 text-crimson-700" />
                    DrukGPT Console
                    <span className="text-sm dzongkha-text text-muted-foreground ml-2">གླེང་སྟེགས།</span>
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="language-toggle" className="text-sm">
                        <span className={isDzongkha ? 'dzongkha-text' : ''}>{isDzongkha ? 'རྫོང་ཁ་' : 'English'}</span>
                      </Label>
                      <Switch
                        id="language-toggle"
                        checked={isDzongkha}
                        onCheckedChange={setIsDzongkha}
                      />
                    </div>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="druk-gpt-base">DrukGPT Base</SelectItem>
                        <SelectItem value="druk-gpt-large">DrukGPT Large</SelectItem>
                        <SelectItem value="druk-gpt-cultural">DrukGPT Cultural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "chat-message",
                          message.role === 'user' ? 'user' : 'assistant'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            message.role === 'user' 
                              ? "bg-crimson-100 dark:bg-crimson-900" 
                              : "bg-gold-100 dark:bg-gold-900"
                          )}>
                            {message.role === 'user' ? (
                              <User className="h-4 w-4 text-crimson-700" />
                            ) : (
                              <Bot className="h-4 w-4 text-gold-700" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">
                                {message.role === 'user' ? 'You' : 'DrukGPT'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="prose prose-sm max-w-none">
                              {message.content}
                            </div>
                            {message.metadata && (
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <span>Model: {message.metadata.model}</span>
                                {message.metadata.tokens && (
                                  <span>• Tokens: {message.metadata.tokens}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="chat-message assistant">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-gold-700" />
                          <span>DrukGPT is thinking...</span>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>
              
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <DzongkhaInput
                    value={inputMessage}
                    onChange={(value: string) => setInputMessage(value)}
                    placeholder={isDzongkha ? "ཞལ་འདེབས་གཅིག་བཀོད་དང་..." : "Ask DrukGPT anything..."}
                    className="flex-1"
                    showAnalysis={true}
                    enableTransliteration={!isDzongkha}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-crimson-950 hover:bg-crimson-800"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar - 1/3 width */}
          <div className="space-y-4 h-full max-h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
            
            {/* Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sources</CardTitle>
              </CardHeader>
              <CardContent className="max-h-48 overflow-y-auto">
                <Accordion type="single" collapsible>
                  {messages
                    .filter(m => m.role === 'assistant' && m.sources)
                    .slice(-3)
                    .map((message) => 
                      message.sources?.map((source) => (
                        <AccordionItem key={source.id} value={source.id}>
                          <AccordionTrigger className="text-sm">
                            {source.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                {source.excerpt}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                  {Math.round(source.confidence * 100)}% confidence
                                </span>
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))
                    )}
                </Accordion>
              </CardContent>
            </Card>

            {/* Tabs for Files and Audit */}
            <Card className="flex-1 flex flex-col min-h-0">
              <Tabs defaultValue="files" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="audit">Audit</TabsTrigger>
                  <TabsTrigger value="cultural">Cultural</TabsTrigger>
                </TabsList>
                
                <TabsContent value="files" className="p-4 flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded border text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 truncate">sample_document.pdf</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded border text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 truncate">data_analysis.xlsx</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="audit" className="p-4 flex-1 overflow-y-auto">
                  <div className="space-y-2">
                      {mockAuditEntries.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="p-2 rounded border text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {entry.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="font-medium">{entry.action}</div>
                          <div className="text-xs text-muted-foreground">
                            by {entry.user}
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="cultural" className="p-4 flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Cultural Events</h4>
                      <CulturalCalendar showUpcoming={2} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}