import { Request, Response } from 'express';
import { CalculatorService } from '../services/calculatorService.js';
import { GitHubService } from '../services/githubService.js';
import { BhutanService } from '../services/bhutanService.js';
import { BaseSuccessResponseDto, BaseErrorResponseDto } from '../types/agent.js';

/**
 * App Controller
 * Handles both calculator tools (public, no auth) and GitHub tools (authenticated)
 * Demonstrates mixed authentication patterns for educational purposes
 */
export class AppController {
  private calculatorService: CalculatorService;
  private githubService: GitHubService;
  private bhutanService: BhutanService;

  constructor() {
    this.calculatorService = new CalculatorService();
    this.githubService = new GitHubService();
    this.bhutanService = new BhutanService();
  }

  /**
   * Handle tool execution - routes to appropriate handler based on tool type
   */
  async handleTool(req: Request, res: Response): Promise<void> {
    const { toolName } = req.params;
    const params = req.body;

    try {
      // Handle Calculator Tools (No Auth Required)
      if (this.isCalculatorTool(toolName)) {
        await this.handleCalculatorTool(toolName, params, res);
        return;
      }

      // Handle GitHub Tools (Auth Required)
      if (this.isGitHubTool(toolName)) {
        const token = this.extractBearerToken(req);
        if (!token) {
          const errorResponse = new BaseErrorResponseDto(
            'GitHub tools require authentication. Please provide a Bearer token.',
            401,
            'Missing Authorization header with Bearer token'
          );
          res.status(401).json(errorResponse);
          return;
        }
        await this.handleGitHubTool(toolName, params, token, res);
        return;
      }

      if (this.isBhutanTool(toolName)) {
        await this.handleBhutanTool(toolName, params, res);
        return;
      }

      // Unknown tool
      const errorResponse = new BaseErrorResponseDto(
        `Unknown tool: ${toolName}`,
        404,
        `Available tools: ${[...this.getCalculatorTools(), ...this.getGitHubTools()].join(', ')}`
      );
      res.status(404).json(errorResponse);
    } catch (error) {
      const errorResponse = new BaseErrorResponseDto(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500,
        'Tool execution failed'
      );
      res.status(500).json(errorResponse);
    }
  }

  /**
   * Handle calculator tool execution
   */
  private async handleCalculatorTool(toolName: string, params: any, res: Response): Promise<void> {
    let result: number;
    let operation: string;

    switch (toolName) {
      case 'add':
        this.validateParameters(params, ['a', 'b']);
        result = this.calculatorService.add(params.a, params.b);
        operation = `${params.a} + ${params.b}`;
        break;
      
      case 'subtract':
        this.validateParameters(params, ['a', 'b']);
        result = this.calculatorService.subtract(params.a, params.b);
        operation = `${params.a} - ${params.b}`;
        break;
      
      case 'multiply':
        this.validateParameters(params, ['a', 'b']);
        result = this.calculatorService.multiply(params.a, params.b);
        operation = `${params.a} × ${params.b}`;
        break;
      
      case 'divide':
        this.validateParameters(params, ['a', 'b']);
        result = this.calculatorService.divide(params.a, params.b);
        operation = `${params.a} ÷ ${params.b}`;
        break;
      
      case 'power':
        this.validateParameters(params, ['base', 'exponent']);
        result = this.calculatorService.power(params.base, params.exponent);
        operation = `${params.base}^${params.exponent}`;
        break;
      
      case 'sqrt':
        this.validateParameters(params, ['number']);
        result = this.calculatorService.sqrt(params.number);
        operation = `√${params.number}`;
        break;
      
      case 'percentage':
        this.validateParameters(params, ['percentage', 'of']);
        result = this.calculatorService.percentage(params.percentage, params.of);
        operation = `${params.percentage}% of ${params.of}`;
        break;
      
      case 'factorial':
        this.validateParameters(params, ['number']);
        result = this.calculatorService.factorial(params.number);
        operation = `${params.number}!`;
        break;
      
      case 'countCharacter':
        this.validateCharacterCountParameters(params);
        result = this.calculatorService.countCharacter(params.character, params.text);
        operation = `Count '${params.character}' in "${params.text.length > 30 ? params.text.substring(0, 30) + '...' : params.text}"`;
        break;
      
      default:
        throw new Error(`Unknown calculator tool: ${toolName}`);
    }

    const response = new BaseSuccessResponseDto({
      operation,
      result,
      message: `Calculated ${operation} = ${result}`,
      tool_type: 'calculator'
    }, 'mixed');

    res.json(response);
  }

  /**
   * Handle GitHub tool execution
   */
  private async handleGitHubTool(toolName: string, params: any, token: string, res: Response): Promise<void> {
    switch (toolName) {
      case 'listUserRepositories':
        const repositories = await this.githubService.listUserRepositories(token, {
          per_page: params.per_page,
          sort: params.sort,
          direction: params.direction,
          type: params.type
        });

        const response = new BaseSuccessResponseDto({
          ...repositories,
          tool_type: 'github',
          authenticated: true
        }, 'mixed');

        res.json(response);
        break;
      
      default:
        throw new Error(`Unknown GitHub tool: ${toolName}`);
    }
  }

  private async handleBhutanTool(toolName: string, params: any, res: Response): Promise<void> {
    switch (toolName) {
      case 'STT':
        // Handle Speech to Text
        if (!params.audio) {
          throw new Error('Missing required parameter: audio');
        }
        const sttResult = await this.bhutanService.speechToText(params.audio);
        const sttResponse = new BaseSuccessResponseDto({
          ...sttResult,
          tool_type: 'bhutan'
        }, 'mixed');
        res.json(sttResponse);
        break;

      case 'TTS':
        // Handle Text to Speech
        if (!params.text) {
          throw new Error('Missing required parameter: text');
        }
        const ttsResult = await this.bhutanService.textToSpeech(params.text);
        const ttsResponse = new BaseSuccessResponseDto({
          ...ttsResult.data,
          tool_type: 'bhutan'
        }, 'mixed');
        res.json(ttsResponse);
        break;

      default:
        throw new Error(`Unknown Bhutan tool: ${toolName}`);
    }
  }

  /**
   * Validate required parameters
   */
  private validateParameters(params: any, required: string[]): void {
    for (const param of required) {
      if (params[param] === undefined || params[param] === null) {
        throw new Error(`Missing required parameter: ${param}`);
      }
      if (typeof params[param] !== 'number') {
        throw new Error(`Parameter '${param}' must be a number`);
      }
    }
  }

  /**
   * Validate parameters for character count tool
   */
  private validateCharacterCountParameters(params: any): void {
    if (params.character === undefined || params.character === null) {
      throw new Error('Missing required parameter: character');
    }
    if (params.text === undefined || params.text === null) {
      throw new Error('Missing required parameter: text');
    }
    if (typeof params.character !== 'string') {
      throw new Error("Parameter 'character' must be a string");
    }
    if (typeof params.text !== 'string') {
      throw new Error("Parameter 'text' must be a string");
    }
    if (params.character.length !== 1) {
      throw new Error('Character parameter must be exactly one character');
    }
  }

  /**
   * Extract Bearer token from request
   */
  private extractBearerToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  /**
   * Check if tool is a calculator tool
   */
  private isCalculatorTool(toolName: string): boolean {
    return this.getCalculatorTools().includes(toolName);
  }

  /**
   * Check if tool is a GitHub tool
   */
  private isGitHubTool(toolName: string): boolean {
    return this.getGitHubTools().includes(toolName);
  }

  private isBhutanTool(toolName: string): boolean {   
    return this.bhutan().includes(toolName);
  }

  /**
   * Get list of calculator tools
   */
  private getCalculatorTools(): string[] {
    return ['add', 'subtract', 'multiply', 'divide', 'power', 'sqrt', 'percentage', 'factorial', 'countCharacter'];
  }

  /**
   * Get list of GitHub tools
   */
  private getGitHubTools(): string[] {
    return ['listUserRepositories'];
  }

  private bhutan(): string[] {
    return ['STT','TTS'];
  }
} 