"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { mockDatasets } from '@/lib/mock-data';
import { mockAgentTemplates } from '@/lib/mock-agents';
import { Bot, Settings, Database, MessageSquare, TestTube } from 'lucide-react';
import { Agent, AgentTemplate } from '@/types/agents';

interface AgentBuilderFormData {
  name: string;
  description: string;
  role: 'citizen-service' | 'document-assistant' | 'policy-advisor' | 'cultural-guide' | 'legal-helper' | 'health-advisor';
  systemPrompt: string;
  capabilities: string[];
  knowledgeSources: string[];
  languages: string[];
  isPublic: boolean;
  maxTokens: number;
  temperature: number;
}

interface AgentBuilderProps {
  onClose: () => void;
  onSave: (agent: Agent) => void;
  template?: AgentTemplate;
}

export function AgentBuilder({ onClose, onSave, template }: AgentBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AgentBuilderFormData>({
    name: template?.name || '',
    description: template?.description || '',
    role: template?.role || 'citizen-service',
    systemPrompt: template?.systemPrompt || '',
    capabilities: template?.capabilities || [],
    knowledgeSources: template?.knowledgeSources || [],
    languages: ['en', 'dz'],
    isPublic: false,
    maxTokens: 2048,
    temperature: 0.7,
  });

  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState('');

  const steps = [
    { id: 'basic', title: 'Basic Information', icon: Bot },
    { id: 'config', title: 'Configuration', icon: Settings },
    { id: 'knowledge', title: 'Knowledge Sources', icon: Database },
    { id: 'test', title: 'Test & Deploy', icon: TestTube },
  ];

  const agentRoles = [
    { value: 'citizen-service', label: 'Citizen Service Agent', description: 'General government services and inquiries' },
    { value: 'document-assistant', label: 'Document Assistant', description: 'Help with forms, applications, and documentation' },
    { value: 'policy-advisor', label: 'Policy Advisor', description: 'Explain policies, regulations, and procedures' },
    { value: 'cultural-guide', label: 'Cultural Heritage Guide', description: 'Share Bhutanese culture and traditions' },
    { value: 'legal-helper', label: 'Legal Document Helper', description: 'Basic legal assistance and document drafting' },
    { value: 'health-advisor', label: 'Health Information Agent', description: 'Public health information and guidance' },
  ];

  const handleTestAgent = async () => {
    if (!testMessage.trim()) return;
    
    // Simulate agent response
    setTestResponse(`[Testing with ${formData.name}] This is a simulated response based on your configuration. The agent would process: "${testMessage}" using the selected knowledge sources and respond according to the system prompt.`);
  };

  const handleSave = () => {
    const newAgent: Agent = {
      id: `agent_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      role: formData.role as Agent['role'],
      status: 'draft',
      systemPrompt: formData.systemPrompt,
      capabilities: formData.capabilities,
      knowledgeSources: formData.knowledgeSources,
      config: {
        maxTokens: formData.maxTokens,
        temperature: formData.temperature,
        languages: formData.languages,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      metrics: {
        totalInteractions: 0,
        dailyInteractions: 0,
        weeklyInteractions: 0,
        satisfactionScore: 0,
        averageResponseTime: 0,
      },
    };

    onSave(newAgent);
  };

  const StepIndicator = ({ step, index }: { step: typeof steps[0], index: number }) => {
    const Icon = step.icon;
    const isActive = index === currentStep;
    const isCompleted = index < currentStep;

    return (
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isActive ? 'bg-crimson-950 text-white' : 
          isCompleted ? 'bg-green-600 text-white' : 
          'bg-muted text-muted-foreground'
        }`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="ml-2">
          <div className={`text-sm font-medium ${isActive ? 'text-crimson-950' : 'text-muted-foreground'}`}>
            {step.title}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Create Digital Civil Servant Agent
          </DialogTitle>
          <DialogDescription>
            Design an AI agent to serve Bhutanese citizens with cultural sensitivity and expertise
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <StepIndicator key={step.id} step={step} index={index} />
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 0 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="agent-name">Agent Name</Label>
                        <Input
                          id="agent-name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Tashi the Citizenship Helper"
                        />
                      </div>
                      <div>
                        <Label htmlFor="agent-role">Service Role</Label>
                        <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as AgentBuilderFormData['role'] }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {agentRoles.map(role => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="agent-description">Description</Label>
                      <Textarea
                        id="agent-description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what this agent does and how it helps citizens..."
                        rows={3}
                      />
                    </div>
                    
                    {/* Role-specific guidance */}
                    {formData.role && (
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Role Guidance: {agentRoles.find(r => r.value === formData.role)?.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {agentRoles.find(r => r.value === formData.role)?.description}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Agent Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="system-prompt">System Prompt</Label>
                      <Textarea
                        id="system-prompt"
                        value={formData.systemPrompt}
                        onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                        placeholder="You are a helpful Bhutanese government assistant who speaks both English and Dzongkha..."
                        rows={6}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Define the agent's personality, knowledge scope, and behavioral guidelines
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="max-tokens">Max Response Length</Label>
                        <Select value={formData.maxTokens.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, maxTokens: parseInt(value) }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="512">512 tokens (Short)</SelectItem>
                            <SelectItem value="1024">1024 tokens (Medium)</SelectItem>
                            <SelectItem value="2048">2048 tokens (Long)</SelectItem>
                            <SelectItem value="4096">4096 tokens (Very Long)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="temperature">Response Creativity</Label>
                        <Select value={formData.temperature.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, temperature: parseFloat(value) }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.3">0.3 (Factual)</SelectItem>
                            <SelectItem value="0.5">0.5 (Balanced)</SelectItem>
                            <SelectItem value="0.7">0.7 (Creative)</SelectItem>
                            <SelectItem value="0.9">0.9 (Very Creative)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="public-agent">Make Agent Public</Label>
                        <p className="text-xs text-muted-foreground">Allow other ministries to use this agent</p>
                      </div>
                      <Switch
                        id="public-agent"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Knowledge Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select datasets and knowledge sources for your agent to reference
                    </p>
                    
                    <div className="grid gap-3">
                      {mockDatasets.filter(d => d.status === 'verified').map(dataset => (
                        <div key={dataset.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={`dataset-${dataset.id}`}
                              checked={formData.knowledgeSources.includes(dataset.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    knowledgeSources: [...prev.knowledgeSources, dataset.id]
                                  }));
                                } else {
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    knowledgeSources: prev.knowledgeSources.filter(id => id !== dataset.id)
                                  }));
                                }
                              }}
                              className="w-4 h-4"
                            />
                            <div>
                              <div className="font-medium">{dataset.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {dataset.metadata.domain} • {(dataset.size / (1024 * 1024)).toFixed(1)} MB
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">{dataset.metadata.language}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Your Agent</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="test-message">Test Message</Label>
                      <div className="flex gap-2">
                        <Input
                          id="test-message"
                          value={testMessage}
                          onChange={(e) => setTestMessage(e.target.value)}
                          placeholder="How do I apply for citizenship?"
                          className="flex-1"
                        />
                        <Button onClick={handleTestAgent} disabled={!testMessage.trim()}>
                          Test
                        </Button>
                      </div>
                    </div>
                    
                    {testResponse && (
                      <div className="p-4 bg-muted rounded-lg">
                        <Label className="text-sm font-medium">Agent Response:</Label>
                        <p className="text-sm mt-2">{testResponse}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Agent Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <span className="text-sm font-medium">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Role:</span>
                        <span className="text-sm font-medium">
                          {agentRoles.find(r => r.value === formData.role)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Knowledge Sources:</span>
                        <span className="text-sm font-medium">{formData.knowledgeSources.length} datasets</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Languages:</span>
                        <div className="flex gap-1">
                          {formData.languages.map(lang => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang === 'dz' ? 'Dzongkha' : 'English'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button 
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  className="bg-crimson-950 hover:bg-crimson-800"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSave}
                  className="bg-crimson-950 hover:bg-crimson-800"
                  disabled={!formData.name || !formData.description}
                >
                  Create Agent
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}