export class ToolsResponseDto {
  tools: ToolDto[];

  constructor(tools: ToolDto[]) {
    this.tools = tools;
  }
}

export class ToolDto {
  name: string;
  description: string;
  parameters: ToolParameterDto;
  confirmationRequired?: boolean;

  constructor(
    name: string,
    description: string,
    parameters: ToolParameterDto,
    confirmationRequired?: boolean,
  ) {
    this.name = name;
    this.description = description;
    this.parameters = parameters;
    this.confirmationRequired = confirmationRequired;
  }
}

export class ToolParameterDto {
  type: 'object';
  properties: Record<string, PropertyDto>;
  required?: string[];

  constructor(
    properties: Record<string, PropertyDto>,
    required?: string[]
  ) {
    this.type = 'object';
    this.properties = properties;
    this.required = required;
  }
}

export class PropertyDto {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: string[];
  default?: string | number | boolean;
  items?: PropertyDto;

  constructor(
    type: 'string' | 'number' | 'boolean' | 'array' | 'object',
    description: string,
    enumValues?: string[],
    defaultValue?: string | number | boolean,
    items?: PropertyDto
  ) {
    this.type = type;
    this.description = description;
    this.enum = enumValues;
    this.default = defaultValue;
    this.items = items;
  }
}

export class BaseErrorResponseDto {
  success = false as const;
  error: {
    message: string;
    code: number | string;
    details: string;
  };

  constructor(
    message: string,
    code: number | string = 500,
    details: string = ''
  ) {
    this.error = {
      message,
      code,
      details,
    };
  }
}

export class BaseSuccessResponseDto<T> {
  success = true as const;
  responseType: string;
  data: {
    [key: string]: T;
  };

  constructor(data: T, responseType: 'text' | 'html' | 'media' | 'mixed') {
    this.responseType = responseType;
    if (responseType === 'text') {
      this.data = {
        text: data,
      };
    } else if (responseType === 'html') {
      this.data = {
        html: data,
      };
    } else if (responseType === 'media') {
      this.data = {
        media: data,
      };
    } else if (responseType === 'mixed') {
      // @ts-expect-error - data is of type T
      this.data = {
        ...data,
      };
    } else {
      this.data = { result: data };
    }
  }
}

export class ResponseMediaItem {
  type: string;
  url: string;
  mimeType: string;
  description: string;
  metadata: object;

  constructor(
    type: string,
    url: string,
    mimeType: string,
    description: string,
    metadata: object = {}
  ) {
    this.type = type;
    this.url = url;
    this.mimeType = mimeType;
    this.description = description;
    this.metadata = metadata;
  }
}

export class GitHubError extends Error {
  statusCode: number;
  originalError?: Error;

  constructor(message: string, statusCode: number = 500, originalError?: Error) {
    super(message);
    this.name = 'GitHubError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
} 