export interface Agent {
  id: string;
  name: string;
  description: string;
  role: 'citizen-service' | 'document-assistant' | 'policy-advisor' | 'cultural-guide' | 'legal-helper' | 'health-advisor';
  status: 'active' | 'inactive' | 'draft' | 'error';
  systemPrompt: string;
  capabilities: string[];
  knowledgeSources: string[]; // Dataset IDs
  config: {
    maxTokens: number;
    temperature: number;
    languages: string[];
  };
  deployments?: AgentDeployment[];
  metrics?: {
    totalInteractions: number;
    dailyInteractions: number;
    weeklyInteractions: number;
    satisfactionScore: number; // 0-1
    averageResponseTime: number; // ms
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  role: Agent['role'];
  systemPrompt: string;
  capabilities: string[];
  knowledgeSources: string[];
  isPublic: boolean;
  usageCount: number;
  createdBy: string;
}

export interface AgentDeployment {
  id: string;
  agentId: string;
  platform: 'console' | 'whatsapp' | 'telegram' | 'slack' | 'teams' | 'webhook';
  config: {
    endpoint?: string;
    apiKey?: string;
    webhookUrl?: string;
    [key: string]: any;
  };
  status: 'active' | 'inactive' | 'error';
  metrics: {
    totalMessages: number;
    uniqueUsers: number;
    averageSessionLength: number;
  };
  createdAt: Date;
  lastActiveAt?: Date;
}

export interface AgentInteraction {
  id: string;
  agentId: string;
  userId: string;
  platform: string;
  message: string;
  response: string;
  satisfactionRating?: number;
  responseTime: number;
  createdAt: Date;
}