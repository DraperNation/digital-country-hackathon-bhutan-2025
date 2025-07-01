import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ChatOllama } from '@langchain/ollama';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';

const prisma = new PrismaClient();

// In-memory storage for chat sessions (in production, use Redis or database)
const chatSessions = new Map<string, { messages: any[]; userId: string }>();

// Initialize LangChain chat model
const chatModel = new ChatOllama({
  model: 'llama3.2',
  temperature: 0.7,
});

const BHUTANESE_AI_SYSTEM_PROMPT = `You are a helpful AI assistant for the Kingdom of Bhutan's digital citizen platform. You provide accurate, helpful information about:

- Bhutanese laws, regulations, and government policies
- Government services and procedures
- Cultural information and traditions
- Document requirements and applications
- Tourism and travel information
- Education and healthcare services
- Business registration and compliance
- Tax information and procedures
- Immigration and customs
- Local customs and etiquette

Always respond in a helpful, respectful manner that reflects Bhutanese values. If you don't know something specific about Bhutan, acknowledge the limitation and suggest where the user might find more information.

Respond in clear, concise language that is accessible to both Bhutanese citizens and visitors.`;

export const createChatSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize session with system message
    chatSessions.set(sessionId, {
      messages: [
        {
          role: 'system',
          content: BHUTANESE_AI_SYSTEM_PROMPT,
        },
      ],
      userId,
    });

    res.status(201).json({
      success: true,
      sessionId,
      message: 'Chat session created successfully',
    });
    return;
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat session',
    });
    return;
  }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, message, userId } = req.body;

    if (!sessionId || !message || !userId) {
      res.status(400).json({
        success: false,
        message: 'Session ID, message, and user ID are required',
      });
      return;
    }

    let session = chatSessions.get(sessionId);

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Chat session not found',
      });
      return;
    }

    // Add user message to session
    session.messages.push({
      role: 'user',
      content: message,
    });

    try {
      // Convert session messages to LangChain format
      const langchainMessages = session.messages
        .map((msg: any) => {
          if (msg.role === 'system') {
            return new SystemMessage(msg.content);
          } else if (msg.role === 'user') {
            return new HumanMessage(msg.content);
          } else if (msg.role === 'assistant') {
            return new AIMessage(msg.content);
          }
          return null;
        })
        .filter((msg): msg is SystemMessage | HumanMessage | AIMessage => msg !== null);

      // Get AI response using LangChain
      const response = await chatModel.invoke(langchainMessages);
      const aiResponse = response.content as string;

      // Add AI response to session
      session.messages.push({
        role: 'assistant',
        content: aiResponse,
      });

      res.json({
        success: true,
        response: aiResponse,
        sessionId,
      });
      return;
    } catch (aiError) {
      console.error('AI model error:', aiError);

      // Fallback response if AI model fails
      const fallbackResponse =
        "I apologize, but I'm currently experiencing technical difficulties. Please try again later or contact support for assistance.";

      session.messages.push({
        role: 'assistant',
        content: fallbackResponse,
      });

      res.json({
        success: true,
        response: fallbackResponse,
        sessionId,
      });
      return;
    }
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
    });
    return;
  }
};

export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        message: 'Session ID is required',
      });
      return;
    }

    const session = chatSessions.get(sessionId);

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Chat session not found',
      });
      return;
    }

    // Return messages excluding the system message
    const userMessages = session.messages.filter((msg: any) => msg.role !== 'system');

    res.json({
      success: true,
      messages: userMessages,
    });
    return;
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat history',
    });
    return;
  }
};

export const deleteChatSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        message: 'Session ID is required',
      });
      return;
    }

    const session = chatSessions.get(sessionId);

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Chat session not found',
      });
      return;
    }

    chatSessions.delete(sessionId);

    res.json({
      success: true,
      message: 'Chat session deleted successfully',
    });
    return;
  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat session',
    });
    return;
  }
};

export const getLegalGuidance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { legalArea, question, userId } = req.body;

    if (!legalArea || !question || !userId) {
      res.status(400).json({
        success: false,
        message: 'Legal area, question, and user ID are required',
      });
      return;
    }

    // Create a specialized system prompt for legal queries
    const legalSystemPrompt = `You are a specialized Bhutanese Legal AI Assistant. You provide accurate, helpful information about Bhutanese laws and regulations.

Legal Area: ${legalArea}

Key Guidelines:
1. **Bhutanese Legal Context**: Always provide information relevant to Bhutan's legal system
2. **Accuracy**: If you're unsure about specific Bhutanese laws, acknowledge the limitation and suggest consulting official sources
3. **Practical Guidance**: Provide practical steps and procedures when applicable
4. **Disclaimer**: Always remind users that this is for informational purposes and not legal advice
5. **Official Sources**: Reference official Bhutanese legal documents when possible

Areas of Expertise:
- Bhutanese Constitution and fundamental rights
- Business and commercial law
- Tax laws and regulations
- Property and land law
- Employment and labor law
- Family law and personal matters
- Criminal law and procedures
- Administrative law and government procedures

Respond in clear, structured language with practical guidance and appropriate disclaimers.`;

    try {
      // Create messages for the legal query
      const messages = [
        new SystemMessage(legalSystemPrompt),
        new HumanMessage(`Legal Area: ${legalArea}\n\nQuestion: ${question}`),
      ];

      // Get AI response using LangChain
      const response = await chatModel.invoke(messages);
      const legalResponse = response.content as string;

      res.json({
        success: true,
        response: legalResponse,
        legalArea,
        question,
      });
    } catch (aiError) {
      console.error('AI model error:', aiError);

      // Fallback response if AI model fails
      const fallbackResponse =
        "I apologize, but I'm currently experiencing technical difficulties with legal queries. Please try again later or consult with a qualified Bhutanese lawyer for specific legal advice.";

      res.json({
        success: true,
        response: fallbackResponse,
        legalArea,
        question,
      });
    }
  } catch (error) {
    console.error('Error getting legal guidance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get legal guidance',
    });
  }
};

export const getDzongkhaTranslation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sourceLanguage, targetLanguage, text, userId, serviceType } = req.body;

    if (!sourceLanguage || !targetLanguage || !text || !userId) {
      res.status(400).json({
        success: false,
        message: 'Source language, target language, text, and user ID are required',
      });
      return;
    }

    // Create specialized system prompt for Dzongkha services
    let systemPrompt = '';

    if (serviceType === 'translation') {
      systemPrompt = `You are a specialized Dzongkha Language AI Assistant. You provide accurate translations between English and Dzongkha.

Source Language: ${sourceLanguage}
Target Language: ${targetLanguage}

Key Guidelines:
1. **Accurate Translation**: Provide precise translations maintaining the original meaning
2. **Cultural Context**: Include cultural nuances and appropriate honorifics when translating to Dzongkha
3. **Formal vs Informal**: Use appropriate formality levels based on context
4. **Bhutanese Context**: Ensure translations are appropriate for Bhutanese cultural context
5. **Romanization**: When translating Dzongkha to English, provide both Dzongkha script and romanized pronunciation

Translation Rules:
- For English to Dzongkha: Provide Dzongkha script with romanized pronunciation
- For Dzongkha to English: Provide English translation with cultural context
- Use appropriate honorifics and formal language for official documents
- Maintain cultural sensitivity and respect for Bhutanese traditions

Please translate the following text:`;
    } else if (serviceType === 'document_help') {
      systemPrompt = `You are a Dzongkha Document Assistant. You help with understanding and filling out Dzongkha documents.

Key Guidelines:
1. **Document Understanding**: Explain the purpose and requirements of Dzongkha documents
2. **Filling Instructions**: Provide step-by-step guidance for completing forms
3. **Cultural Context**: Explain cultural significance and proper protocols
4. **Official Language**: Help with formal Dzongkha language used in official documents
5. **Common Phrases**: Provide commonly used phrases and their meanings

Please help with the following Dzongkha document question:`;
    } else if (serviceType === 'language_learning') {
      systemPrompt = `You are a Dzongkha Language Learning Assistant. You help people learn Dzongkha language basics.

Key Guidelines:
1. **Basic Phrases**: Teach common greetings, expressions, and basic vocabulary
2. **Pronunciation**: Provide romanized pronunciation guides
3. **Cultural Context**: Explain when and how to use different phrases
4. **Grammar Basics**: Explain basic Dzongkha grammar structures
5. **Progressive Learning**: Start with basics and build up to more complex phrases

Please help with the following Dzongkha learning question:`;
    } else if (serviceType === 'cultural_guide') {
      systemPrompt = `You are a Bhutanese Cultural Guide. You provide information about Bhutanese culture, traditions, and customs.

Key Guidelines:
1. **Cultural Traditions**: Explain traditional customs and their significance
2. **Social Etiquette**: Provide guidance on proper behavior and respect
3. **Historical Context**: Share relevant historical background
4. **Modern Bhutan**: Explain how traditions relate to modern Bhutanese life
5. **Cultural Sensitivity**: Ensure information is respectful and accurate

Please help with the following cultural question:`;
    } else {
      systemPrompt = `You are a Dzongkha Language and Cultural AI Assistant. You help with Dzongkha language and Bhutanese cultural services.

Please assist with the following request:`;
    }

    try {
      // Create messages for the Dzongkha service
      const messages = [new SystemMessage(systemPrompt), new HumanMessage(`Request: ${text}`)];

      // Get AI response using LangChain
      const response = await chatModel.invoke(messages);
      const dzongkhaResponse = response.content as string;

      res.json({
        success: true,
        response: dzongkhaResponse,
        sourceLanguage,
        targetLanguage,
        serviceType,
        originalText: text,
      });
    } catch (aiError) {
      console.error('AI model error:', aiError);

      // Fallback response if AI model fails
      const fallbackResponse =
        "I apologize, but I'm currently experiencing technical difficulties with Dzongkha services. Please try again later or consult with a Dzongkha language expert.";

      res.json({
        success: true,
        response: fallbackResponse,
        sourceLanguage,
        targetLanguage,
        serviceType,
        originalText: text,
      });
    }
  } catch (error) {
    console.error('Error getting Dzongkha translation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Dzongkha translation',
    });
  }
};
