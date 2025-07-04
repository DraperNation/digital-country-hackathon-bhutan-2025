import { Agent, AgentTemplate } from '@/types/agents';

export const mockAgents: Agent[] = [
  {
    id: 'agent_1',
    name: 'Tashi - Citizenship Helper',
    description: 'Assists citizens with citizenship applications, document requirements, and general government services inquiries.',
    role: 'citizen-service',
    status: 'active',
    systemPrompt: 'You are Tashi, a helpful Bhutanese government assistant. You specialize in citizenship services and speak both English and Dzongkha. Always be respectful, accurate, and culturally sensitive.',
    capabilities: [
      'Citizenship application guidance',
      'Document requirements explanation',
      'Government service information',
      'Appointment scheduling assistance',
      'Multilingual support (English/Dzongkha)'
    ],
    knowledgeSources: ['ds1', 'ds3'],
    config: {
      maxTokens: 2048,
      temperature: 0.5,
      languages: ['en', 'dz']
    },
    metrics: {
      totalInteractions: 2847,
      dailyInteractions: 156,
      weeklyInteractions: 892,
      satisfactionScore: 0.91,
      averageResponseTime: 1200
    },
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-15T14:30:00Z')
  },
  {
    id: 'agent_2',
    name: 'Dolma - Document Assistant',
    description: 'Helps citizens fill out government forms, understand document requirements, and provides guidance on application processes.',
    role: 'document-assistant',
    status: 'active',
    systemPrompt: 'You are Dolma, a patient and thorough document assistant for the Bhutanese government. Help citizens understand and complete forms accurately.',
    capabilities: [
      'Form completion guidance',
      'Document validation',
      'Application process explanation',
      'Error correction assistance',
      'Status tracking help'
    ],
    knowledgeSources: ['ds3'],
    config: {
      maxTokens: 1024,
      temperature: 0.3,
      languages: ['en', 'dz']
    },
    metrics: {
      totalInteractions: 1924,
      dailyInteractions: 89,
      weeklyInteractions: 623,
      satisfactionScore: 0.88,
      averageResponseTime: 980
    },
    createdAt: new Date('2024-01-12T11:00:00Z'),
    updatedAt: new Date('2024-01-15T16:45:00Z')
  },
  {
    id: 'agent_3',
    name: 'Karma - Cultural Heritage Guide',
    description: 'Shares knowledge about Bhutanese culture, traditions, festivals, and historical sites with both locals and visitors.',
    role: 'cultural-guide',
    status: 'active',
    systemPrompt: 'You are Karma, a knowledgeable cultural guide who loves sharing Bhutan\'s rich heritage. Be engaging, informative, and proud of our traditions.',
    capabilities: [
      'Cultural information sharing',
      'Festival explanations',
      'Historical site descriptions',
      'Traditional practice guidance',
      'Tourism assistance'
    ],
    knowledgeSources: ['ds1', 'ds5'],
    config: {
      maxTokens: 2048,
      temperature: 0.7,
      languages: ['en', 'dz']
    },
    metrics: {
      totalInteractions: 1456,
      dailyInteractions: 67,
      weeklyInteractions: 412,
      satisfactionScore: 0.94,
      averageResponseTime: 1450
    },
    createdAt: new Date('2024-01-08T15:30:00Z'),
    updatedAt: new Date('2024-01-15T10:20:00Z')
  },
  {
    id: 'agent_4',
    name: 'Pema - Policy Advisor',
    description: 'Explains government policies, regulations, and procedures in clear, understandable language for citizens.',
    role: 'policy-advisor',
    status: 'draft',
    systemPrompt: 'You are Pema, a policy expert who makes complex government policies easy to understand. Be clear, accurate, and helpful.',
    capabilities: [
      'Policy explanation',
      'Regulation interpretation',
      'Procedure guidance',
      'Legal requirement clarification',
      'Impact assessment explanation'
    ],
    knowledgeSources: ['ds3'],
    config: {
      maxTokens: 1024,
      temperature: 0.4,
      languages: ['en', 'dz']
    },
    metrics: {
      totalInteractions: 0,
      dailyInteractions: 0,
      weeklyInteractions: 0,
      satisfactionScore: 0,
      averageResponseTime: 0
    },
    createdAt: new Date('2024-01-14T13:00:00Z'),
    updatedAt: new Date('2024-01-14T13:00:00Z')
  },
  {
    id: 'agent_5',
    name: 'Norbu - Health Information Agent',
    description: 'Provides public health information, wellness guidance, and connects citizens with healthcare resources.',
    role: 'health-advisor',
    status: 'inactive',
    systemPrompt: 'You are Norbu, a health information specialist. Provide accurate health information while always recommending professional medical consultation for specific conditions.',
    capabilities: [
      'Public health information',
      'Wellness guidance',
      'Healthcare resource location',
      'Appointment assistance',
      'Health education'
    ],
    knowledgeSources: ['ds6'],
    config: {
      maxTokens: 1024,
      temperature: 0.3,
      languages: ['en', 'dz']
    },
    metrics: {
      totalInteractions: 567,
      dailyInteractions: 0,
      weeklyInteractions: 0,
      satisfactionScore: 0.85,
      averageResponseTime: 1100
    },
    createdAt: new Date('2024-01-05T08:00:00Z'),
    updatedAt: new Date('2024-01-10T17:30:00Z')
  }
];

export const mockAgentTemplates: AgentTemplate[] = [
  {
    id: 'template_1',
    name: 'Citizenship Service Agent',
    description: 'A comprehensive agent for handling all citizenship-related inquiries, applications, and document guidance. Perfect for immigration and naturalization departments.',
    role: 'citizen-service',
    systemPrompt: 'You are a helpful Bhutanese citizenship service agent. Assist citizens with citizenship applications, document requirements, and related government services. Always be respectful and culturally sensitive.',
    capabilities: [
      'Citizenship eligibility assessment',
      'Application form guidance',
      'Document requirement explanation',
      'Processing timeline information',
      'Appeal process assistance',
      'Multilingual support'
    ],
    knowledgeSources: ['ds1', 'ds3'],
    isPublic: true,
    usageCount: 15,
    createdBy: 'system'
  },
  {
    id: 'template_2',
    name: 'Document Processing Assistant',
    description: 'Specialized in helping citizens complete government forms, understand requirements, and track application status.',
    role: 'document-assistant',
    systemPrompt: 'You are a patient document processing assistant. Help citizens understand forms, complete applications accurately, and track their progress through government systems.',
    capabilities: [
      'Form completion guidance',
      'Field validation assistance',
      'Document checklist creation',
      'Application status tracking',
      'Error correction help',
      'Digital submission support'
    ],
    knowledgeSources: ['ds3'],
    isPublic: true,
    usageCount: 8,
    createdBy: 'system'
  },
  {
    id: 'template_3',
    name: 'Policy & Regulation Advisor',
    description: 'Expert at explaining complex government policies, regulations, and legal requirements in simple terms.',
    role: 'policy-advisor',
    systemPrompt: 'You are a policy expert who makes government regulations accessible to citizens. Explain complex policies clearly and help people understand their rights and obligations.',
    capabilities: [
      'Policy interpretation',
      'Regulation explanation',
      'Legal requirement clarification',
      'Impact assessment',
      'Compliance guidance',
      'Rights and obligations explanation'
    ],
    knowledgeSources: ['ds3'],
    isPublic: true,
    usageCount: 12,
    createdBy: 'system'
  },
  {
    id: 'template_4',
    name: 'Cultural Heritage Guide',
    description: 'Shares Bhutanese culture, traditions, festivals, and history with both citizens and visitors.',
    role: 'cultural-guide',
    systemPrompt: 'You are a knowledgeable cultural ambassador for Bhutan. Share our rich heritage, traditions, and values with pride and accuracy. Help preserve and promote Bhutanese culture.',
    capabilities: [
      'Cultural history sharing',
      'Festival information',
      'Traditional practice explanation',
      'Historical site descriptions',
      'Language preservation support',
      'Tourism cultural guidance'
    ],
    knowledgeSources: ['ds1', 'ds5'],
    isPublic: true,
    usageCount: 6,
    createdBy: 'system'
  },
  {
    id: 'template_5',
    name: 'Legal Document Helper',
    description: 'Assists with basic legal document understanding, contract explanation, and legal procedure guidance.',
    role: 'legal-helper',
    systemPrompt: 'You are a legal assistant who helps citizens understand basic legal documents and procedures. Always recommend professional legal counsel for complex matters.',
    capabilities: [
      'Legal document explanation',
      'Contract term clarification',
      'Legal procedure guidance',
      'Rights explanation',
      'Legal resource referral',
      'Court process overview'
    ],
    knowledgeSources: ['ds3'],
    isPublic: true,
    usageCount: 4,
    createdBy: 'system'
  },
  {
    id: 'template_6',
    name: 'Public Health Information Agent',
    description: 'Provides health information, wellness guidance, and healthcare resource connections for citizens.',
    role: 'health-advisor',
    systemPrompt: 'You are a public health information specialist. Provide accurate health information while always recommending professional medical consultation for specific health concerns.',
    capabilities: [
      'Public health information',
      'Wellness program guidance',
      'Healthcare facility location',
      'Appointment scheduling help',
      'Health education delivery',
      'Emergency procedure guidance'
    ],
    knowledgeSources: ['ds6'],
    isPublic: true,
    usageCount: 7,
    createdBy: 'system'
  }
];