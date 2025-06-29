# Bhindi Agent Starter - API Examples

This document provides examples of how to use the Bhindi Agent Starter API, which combines calculator tools with basic GitHub functionality.

## Authentication

GitHub tool execution requires a GitHub personal access token in the `Authorization` header. Calculator tools are public and don't require authentication. The `/tools` endpoint is public and doesn't require authentication.

```bash
# Header for GitHub tool execution
Authorization: Bearer your-github-token-here
```

## Available Endpoints

### 1. Get Available Tools

**GET** `/tools`

Returns a list of all available tools (calculator + GitHub).

```bash
curl -X GET "http://localhost:3000/tools"
```

**Response:**
```json
{
  "tools": [
    {
      "name": "add",
      "description": "Add two numbers together",
      "parameters": {
        "type": "object",
        "properties": {
          "a": {
            "type": "number",
            "description": "First number"
          },
          "b": {
            "type": "number",
            "description": "Second number"
          }
        },
        "required": ["a", "b"]
      }
    },
    {
      "name": "listRepositories",
      "description": "List repositories for the authenticated GitHub user",
      "parameters": {
        "type": "object",
        "properties": {
          "per_page": {
            "type": "number",
            "description": "Number of repositories per page (1-100)",
            "default": 10
          },
          "sort": {
            "type": "string",
            "description": "Sort repositories by",
            "enum": ["created", "updated", "pushed", "full_name"],
            "default": "updated"
          }
        }
      },
      "confirmationRequired": false,
    }
  ]
}
```

## Calculator Tools

All calculator tools are public and don't require authentication.

### 2. Addition

**POST** `/tools/add`

Add two numbers together.

```bash
curl -X POST "http://localhost:3000/tools/add" \
  -H "Content-Type: application/json" \
  -d '{
    "a": 15,
    "b": 25
  }'
```

**Response:**
```json
{
  "success": true,
  "responseType": "text",
  "data": {
    "text": "40"
  }
}
```

### 3. Subtraction

**POST** `/tools/subtract`

Subtract two numbers.

```bash
curl -X POST "http://localhost:3000/tools/subtract" \
  -H "Content-Type: application/json" \
  -d '{
    "a": 50,
    "b": 30
  }'
```

### 4. Multiplication

**POST** `/tools/multiply`

Multiply two numbers.

```bash
curl -X POST "http://localhost:3000/tools/multiply" \
  -H "Content-Type: application/json" \
  -d '{
    "a": 7,
    "b": 8
  }'
```

### 5. Division

**POST** `/tools/divide`

Divide two numbers.

```bash
curl -X POST "http://localhost:3000/tools/divide" \
  -H "Content-Type: application/json" \
  -d '{
    "a": 100,
    "b": 4
  }'
```

**Error Response (Division by Zero):**
```json
{
  "success": false,
  "error": {
    "message": "Division by zero is not allowed",
    "code": 400
  }
}
```

### 6. Power

**POST** `/tools/power`

Calculate power (a^b).

```bash
curl -X POST "http://localhost:3000/tools/power" \
  -H "Content-Type: application/json" \
  -d '{
    "a": 2,
    "b": 8
  }'
```

### 7. Square Root

**POST** `/tools/sqrt`

Calculate square root.

```bash
curl -X POST "http://localhost:3000/tools/sqrt" \
  -H "Content-Type: application/json" \
  -d '{
    "number": 144
  }'
```

### 8. Percentage

**POST** `/tools/percentage`

Calculate percentage.

```bash
curl -X POST "http://localhost:3000/tools/percentage" \
  -H "Content-Type: application/json" \
  -d '{
    "percentage": 15,
    "total": 200
  }'
```

### 9. Factorial

**POST** `/tools/factorial`

Calculate factorial.

```bash
curl -X POST "http://localhost:3000/tools/factorial" \
  -H "Content-Type: application/json" \
  -d '{
    "number": 5
  }'
```

**Response:**
```json
{
  "success": true,
  "responseType": "text",
  "data": {
    "text": "120"
  }
}
```

### 10. Count Character Occurrences

**POST** `/tools/countCharacter`

Count how many times a specific character appears in text.

```bash
curl -X POST "http://localhost:3000/tools/countCharacter" \
  -H "Content-Type: application/json" \
  -d '{
    "character": "l",
    "text": "Hello World! This is a sample text."
  }'
```

**Response:**
```json
{
  "success": true,
  "responseType": "text",
  "data": {
    "text": "3"
  }
}
```

**Example Use Cases:**

**Count spaces in text:**
```bash
curl -X POST "http://localhost:3000/tools/countCharacter" \
  -H "Content-Type: application/json" \
  -d '{
    "character": " ",
    "text": "Count the spaces in this sentence"
  }'
```

**Count vowels:**
```bash
curl -X POST "http://localhost:3000/tools/countCharacter" \
  -H "Content-Type: application/json" \
  -d '{
    "character": "a",
    "text": "How many letter a appear in this text?"
  }'
```

## GitHub Tools

GitHub tools require authentication via Bearer token.

### 11. List Repositories

**POST** `/tools/listRepositories`

List repositories for the authenticated GitHub user.

```bash
curl -X POST "http://localhost:3000/tools/listRepositories" \
  -H "Authorization: Bearer your-github-token" \
  -H "Content-Type: application/json" \
  -d '{
    "per_page": 5,
    "sort": "updated",
    "direction": "desc",
    "type": "owner"
  }'
```

**Response:**
```json
{
  "success": true,
  "responseType": "mixed",
  "data": {
    "repositories": [
      {
        "id": 123456,
        "name": "my-repo",
        "full_name": "username/my-repo",
        "description": "My awesome repository",
        "private": false,
        "html_url": "https://github.com/username/my-repo",
        "language": "TypeScript",
        "stargazers_count": 5,
        "forks_count": 2,
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-02T00:00:00Z",
        "pushed_at": "2023-01-02T12:00:00Z"
      }
    ],
    "total_count": 1,
    "message": "Found 1 repositories for authenticated user"
  }
}
```

## Error Responses

All endpoints return standardized error responses.

**Standard Error Format:**
```json
{
  "success": false,
  "error": {
    "message": "User-friendly error description",
    "code": 400,
    "details": ""
  }
}
```

**Common Error Scenarios:**

**Invalid Authentication (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired GitHub token",
    "code": 401,
    "details": ""
  }
}
```

**Rate Limit Exceeded (403):**
```json
{
  "success": false,
  "error": {
    "message": "GitHub API rate limit exceeded or insufficient permissions",
    "code": 403,
    "details": ""
  }
}
```

**Missing Parameters (400):**
```json
{
  "success": false,
  "error": {
    "message": "Missing required parameters: a, b",
    "code": 400,
    "details": ""
  }
}
```

**Calculator Error (400):**
```json
{
  "success": false,
  "error": {
    "message": "Cannot calculate square root of negative number",
    "code": 400,
    "details": ""
  }
}
```

**Character Count Error (400):**
```json
{
  "success": false,
  "error": {
    "message": "Character parameter must be exactly one character",
    "code": 400,
    "details": ""
  }
}
```

## Common Error Codes

- `400`: Invalid parameters, calculator errors (division by zero, negative square root, etc.)
- `401`: Missing, invalid, or expired Bearer token (GitHub tools only)
- `403`: GitHub API rate limit exceeded or insufficient permissions
- `404`: Tool not found
- `500`: Internal server error

## Environment Setup

1. Set up your environment variables:
   ```bash
   PORT=3000
   NODE_ENV=development
   GITHUB_TOKEN=your-github-token-here  # Optional, for testing
   ```

2. For GitHub functionality, ensure you have a valid GitHub personal access token with:
   - `repo` scope for repository access
   - `user` scope for user information

3. Start the server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`.

## Use Cases

This hybrid agent is perfect for:

- **Educational projects**: Learn about building agents with mixed authentication patterns
- **Calculator applications**: Perform mathematical calculations via API
- **Basic GitHub integration**: List user repositories for simple GitHub workflows
- **Agent development**: Use as a starting point for more complex agent implementations

## Next Steps

- Add more calculator functions (trigonometry, logarithms, etc.)
- Extend GitHub functionality (repository creation, file operations)
- Implement more sophisticated authentication patterns
- Add database integration for storing calculation history 