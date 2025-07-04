# Agent Development Plan Template

This document provides a comprehensive template for implementing an agent that provides domain-specific operations via a REST API, following the Bhindi.io agent specification.

## Overview

An agent is a service that exposes tools and operations through a standardized REST API. This template helps you build agents that can integrate with Bhindi.io

### Core Requirements

- [ ] Endpoints:
  - [ ] `GET /tools` (Required): Returns the list of supported tools
  - [ ] `POST /tools/:toolName` (Required): Executes a specified tool with provided parameters
- [ ] Tools JSON: Define tool metadata in `src/config/tools.json`
- [ ] Authentication: Configurable authentication strategy for tool execution
- [ ] Error Handling: Standardized error responses following agent specification

### Agent Specification Compliance

This template follows the standard agent specification with:
- Standardized response formats (`BaseSuccessResponseDto`, `BaseErrorResponseDto`)
- Tool parameter validation using JSON Schema
- Proper HTTP status codes and error handling
- Optional confirmation

---

## 1. Project Setup

- [ ] Initialize a TypeScript + Node.js project. 
- [ ] Install core dependencies:
  - [ ] `express` - Web framework
  - [ ] `dotenv` - Environment variable management
  - [ ] Your domain-specific SDK/library (e.g., `@octokit/rest`, `@aws-sdk/client-s3`, etc.)
  - [ ] `typescript`, `ts-node`, `jest`, `eslint` - Development tools
  - [ ] `ts-jest` for TypeScript testing support
- [ ] Configure:
  - [ ] `tsconfig.json` for compilation settings
  - [ ] `eslint.config.js` for linting rules
  - [ ] Environment variables in `.env` (API keys, credentials, etc.)

### Example Domain-Specific Dependencies
Choose based on your agent's purpose:
- **File/Cloud Storage**: `@aws-sdk/client-s3`, `@google-cloud/storage`
- **Version Control**: `@octokit/rest`, `simple-git`
- **Database**: `mongodb`, `pg`, `mysql2`
- **Communication**: `@slack/web-api`, `discord.js`
- **AI/ML**: `openai`, `@anthropic-ai/sdk`

---

## 2. Tools Definition

- [ ] Create `src/config/tools.json` containing an array of tool definitions
  - [ ] `name`: string identifier (e.g., `listItems`, `createItem`)
  - [ ] `description`: brief explanation of what the tool does
  - [ ] `parameters`: JSON Schema object with `properties` and `required` fields
  - [ ] `confirmationRequired` (optional): boolean for dangerous operations

### Example Tool Structure
```json
{
  "name": "exampleTool",
  "description": "Example tool that demonstrates the pattern",
  "parameters": {
    "type": "object",
    "properties": {
      "requiredParam": {
        "type": "string",
        "description": "A required parameter"
      },
      "optionalParam": {
        "type": "string",
        "description": "An optional parameter"
      }
    },
    "required": ["requiredParam"]
  },
  "confirmationRequired": false,
}
```

### Common Tool Patterns
Consider implementing tools that follow these patterns:
- **List/Query**: `listItems`, `searchItems`, `getItem`
- **Create/Update**: `createItem`, `updateItem`, `patchItem`
- **Delete**: `deleteItem`, `archiveItem`
- **Batch Operations**: `batchCreate`, `batchUpdate`
- **Context**: `getUserContext`, `getSystemInfo`

---

## 3. Implement `GET /tools`

- [ ] Create route file `src/routes/toolsRoutes.ts`
- [ ] Read and parse `tools.json`
- [ ] Return a `ToolsResponseDto` containing the tools list
- [ ] Handle errors with `BaseErrorResponseDto`
- [ ] Configure authentication strategy (public or protected)

### Response Format
```typescript
interface ToolsResponseDto {
  responseType: 'success';
  data: {
    tools: ToolDefinition[];
  };
}
```

---

## 4. Implement Tool Execution

- [ ] Create route file for your domain (e.g., `src/routes/domainRoutes.ts`)
- [ ] Extract `toolName` from URL parameter and `params` from request body
- [ ] Validate `params` against the tool's JSON Schema requirements
- [ ] Dispatch to the corresponding handler function based on `toolName`
- [ ] Return results wrapped in `BaseSuccessResponseDto` or errors in `BaseErrorResponseDto`

### Implementation Options
- **Single Route**: `POST /tools/:toolName` for all tool execution
- **Hybrid**: Both patterns supported (recommended)

---

## 5. Tool Handlers Implementation

Design your tool handlers based on your domain. Here are common patterns:

### Data/Content Management Tools
- [ ] **List/Query Tools**: Retrieve and filter items from your data source
- [ ] **Read Tools**: Get specific item details or content
- [ ] **Create Tools**: Add new items to your system
- [ ] **Update Tools**: Modify existing items (full or partial updates)
- [ ] **Delete Tools**: Remove items from your system

### Context and Information Tools  
- [ ] **User Context**: Get user profile, preferences, recent activity
- [ ] **System Status**: Health checks, configuration info
- [ ] **Search Tools**: Advanced search and filtering capabilities

### Example Implementation Structure
```typescript
// src/services/domainService.ts
export class DomainService {
  async listItems(params: ListItemsParams): Promise<Item[]> {
    // Implementation here
  }
  
  async createItem(params: CreateItemParams): Promise<Item> {
    // Implementation here
  }
  
  // ... other methods
}

// src/controllers/domainController.ts  
export class DomainController {
  constructor(private domainService: DomainService) {}
  
  async handleListItems(params: any): Promise<BaseSuccessResponseDto> {
    // Validation, service call, response formatting
  }
  
  // ... other handlers
}
```

---

## 6. Authentication & Authorization

- [ ] Choose authentication strategy:
  - [ ] **API Key**: Simple server-to-server authentication
  - [ ] **Bearer Token**: User-specific tokens (OAuth, JWT, etc.)
  - [ ] **Custom**: Domain-specific authentication
  - [ ] **None**: Public endpoints (be careful!)

- [ ] Implement authentication middleware:
  - [ ] Extract credentials from headers
  - [ ] Validate credentials against your auth system
  - [ ] Instantiate domain client with proper authentication
  - [ ] Handle authentication errors (401, 403)

### Example Middleware Structure
```typescript
// src/middlewares/auth.ts
export const validateBearerToken = (req: Request, res: Response, next: NextFunction) => {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json(createErrorResponse('Authentication required'));
  }
  
  req.authToken = token;
  next();
};
```

---

## 7. Error Handling & Response Schema

- [ ] Implement standardized error responses using `BaseErrorResponseDto`
- [ ] Wrap successful data in `BaseSuccessResponseDto` with appropriate `responseType`
- [ ] Define shared DTOs in `src/types`
- [ ] Create domain-specific error types and status code mapping
- [ ] Implement user-friendly error messages
- [ ] Log technical details server-side only (security)

### Error Handling Best Practices
- **404**: Resource not found
- **401**: Authentication required
- **403**: Insufficient permissions  
- **400**: Invalid parameters or request
- **500**: Internal server errors
- **429**: Rate limiting (if implemented)

### Response Type Structure
```typescript
interface BaseSuccessResponseDto {
  responseType: 'success';
  data: any;
}

interface BaseErrorResponseDto {
  responseType: 'error';
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

---

## 8. Configuration & Environment

- [ ] Use `dotenv` to load environment variables
- [ ] Create configuration file `src/config/config.ts`
- [ ] Document required environment variables
- [ ] Implement configuration validation
- [ ] Support different environments (dev, staging, prod)

### Common Environment Variables
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Authentication
API_KEY=your-api-key-here
JWT_SECRET=your-jwt-secret

# Domain-Specific Configuration
DOMAIN_API_URL=https://api.yourdomain.com
DOMAIN_API_KEY=your-domain-api-key

# Optional Features
ENABLE_RATE_LIMITING=true
LOG_LEVEL=info
```

---

## 9. Testing

- [ ] Write unit tests with Jest for:
  - [ ] Individual tool handlers (mocking external dependencies)
  - [ ] Service layer functionality
  - [ ] Parameter validation
  - [ ] Error handling scenarios
  - [ ] Authentication middleware

- [ ] Configure Jest with TypeScript and ESM support
- [ ] Aim for high test coverage (>80%)
- [ ] Include integration tests for critical paths

### Testing Structure
```
src/
  __tests__/
    services/
      domainService.test.ts
    controllers/
      domainController.test.ts
    middlewares/
      auth.test.ts
    utils/
      validation.test.ts
```

---

## 10. Documentation & Deployment

- [ ] Update `README.md` with:
  - [ ] Project overview and purpose
  - [ ] Setup and installation instructions
  - [ ] Environment variable requirements
  - [ ] API usage examples
  - [ ] Tool descriptions and parameters

- [ ] Create `examples.md` with:
  - [ ] curl commands for all endpoints
  - [ ] Example requests and responses
  - [ ] Common use cases and workflows

- [ ] Plan for deployment:
  - [ ] Docker containerization
  - [ ] CI/CD pipeline (GitHub Actions, etc.)
  - [ ] Environment-specific configurations
  - [ ] Monitoring and logging setup

---

## 11. Optional Enhancements

Consider these enhancements based on your agent's requirements:

### Performance & Reliability
- [ ] Rate limiting middleware
- [ ] Response caching for expensive operations
- [ ] Request/response logging
- [ ] Health check endpoints
- [ ] Metrics and monitoring

### Security
- [ ] Input sanitization and validation
- [ ] CORS configuration
- [ ] Request size limits
- [ ] Security headers middleware

### Developer Experience
- [ ] OpenAPI/Swagger documentation
- [ ] SDK generation for client libraries
- [ ] CLI tool for testing
- [ ] Development proxy/mock server

### Advanced Features
- [ ] Webhook support for real-time events
- [ ] Batch operation endpoints
- [ ] Async operation support with job queues
- [ ] Multi-tenant support
- [ ] Plugin system for extensibility

---

## 🚀 Getting Started Checklist

Use this checklist to track your progress:

### Phase 1: Foundation
- [ ] Project setup and dependencies installed
- [ ] Basic Express server running
- [ ] Environment configuration working
- [ ] Tools JSON structure defined

### Phase 2: Core Implementation  
- [ ] `GET /tools` endpoint implemented
- [ ] Tool execution endpoint implemented
- [ ] At least 3 core tools working
- [ ] Authentication middleware implemented

### Phase 3: Quality & Testing
- [ ] Error handling implemented
- [ ] Unit tests written and passing
- [ ] Documentation completed
- [ ] Manual testing completed

### Phase 4: Production Ready
- [ ] Deployment strategy defined
- [ ] Monitoring and logging configured
- [ ] Security review completed
- [ ] Performance testing completed

---

## 📋 Agent Patterns & Examples

### Common Agent Types
- **File System Agent**: File operations, directory management
- **Database Agent**: CRUD operations, queries, schema management
- **API Integration Agent**: Third-party service operations
- **Content Management Agent**: Document/media management
- **Development Tools Agent**: Code operations, deployment, testing
- **Communication Agent**: Messaging, notifications, team collaboration

### Tool Naming Conventions
- Use camelCase for tool names
- Start with verbs: `listRepositories`, `createFile`, `updateUser`
- Be descriptive but concise
- Group related tools with prefixes: `user_create`, `user_update`, `user_delete`

### Parameter Design Best Practices
- Use clear, descriptive parameter names
- Provide helpful descriptions in JSON Schema
- Make required vs optional parameters clear
- Use appropriate data types and validation
- Include examples in descriptions when helpful

---

## 🔗 Resources & References

- [Bhindi.io Agent Specification](https://bhindi.io/docs/agent-specification)
- [Bhindi.io App](https://bhindi.io)

---

## 💡 Tips for Success

1. **Start Simple**: Implement 2-3 core tools first, then expand
2. **Follow Standards**: Stick to the agent specification for compatibility
3. **Test Early**: Write tests as you build, not after
4. **Document Everything**: Good documentation saves time later
5. **Think Like a User**: Design tools that solve real problems
6. **Handle Errors Gracefully**: Users will encounter edge cases
7. **Secure by Default**: Implement proper authentication and validation
8. **Monitor Performance**: Track response times and error rates

---

**Ready to build your agent?** Copy this template, customize it for your domain, and start checking off the boxes! 🎯
