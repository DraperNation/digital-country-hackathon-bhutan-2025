export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: Source[];
  metadata?: {
    model?: string;
    language?: string;
    tokens?: number;
    analysis?: any;
    culturalContext?: any;
    culturallyEnhanced?: boolean;
  };
}

export interface Source {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  confidence: number;
  type: 'document' | 'web' | 'dataset';
}

export interface Dataset {
  id: string;
  name: string;
  type: 'text' | 'audio' | 'video' | 'image';
  size: number;
  license: string;
  checksum: string;
  uploadedAt: Date;
  status: 'pending' | 'processing' | 'verified' | 'failed';
  blockchain?: {
    network: 'ethereum' | 'polygon' | 'solana' | 'avalanche' | 'binance-smart-chain';
    txId: string;
    blockNumber?: number;
    confirmations: number;
    gasUsed?: number;
    timestamp: Date;
    explorerUrl: string;
  };
  metadata: {
    language?: string;
    domain?: string;
    quality?: number;
  };
}

export interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  resource: string;
  details: Record<string, any>;
  status: 'success' | 'warning' | 'error';
}

export interface Job {
  id: string;
  name: string;
  type: 'fine-tuning' | 'evaluation' | 'deployment';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  config: {
    model: string;
    dataset: string;
    epochs?: number;
    learningRate?: number;
  };
  metrics?: {
    loss?: number;
    accuracy?: number;
    perplexity?: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'researcher' | 'user';
  permissions: string[];
  lastLogin?: Date;
}

export interface Integration {
  id: string;
  name: string;
  type: 'messaging' | 'collaboration' | 'productivity' | 'social' | 'webhook';
  status: 'connected' | 'disconnected' | 'requires-setup' | 'error';
  description: string;
  icon: string;
  provider: string;
  config: {
    apiKey?: string;
    webhookUrl?: string;
    botToken?: string;
    workspaceId?: string;
    channelId?: string;
    [key: string]: any;
  };
  lastSync?: Date;
  usage?: {
    dailyMessages: number;
    monthlyMessages: number;
    activeUsers: number;
  };
  features: string[];
  setupInstructions?: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}