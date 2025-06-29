import { Request, Response } from 'express';
import { CalculatorService } from '../services/calculatorService.js';
import { GitHubService } from '../services/githubService.js';
import { BaseSuccessResponseDto, BaseErrorResponseDto } from '../types/agent.js';
import { ClassifierService } from '@/services/classifierService.js';
import { ServiceNavigatorService } from '@/services/servicenavigatorService.js';

/**
 * App Controller
 * Handles both calculator tools (public, no auth) and GitHub tools (authenticated)
 * Demonstrates mixed authentication patterns for educational purposes
 */
export class AppController {
  private calculatorService: CalculatorService;
  private githubService: GitHubService;
  private classifierService: ClassifierService;
  private servicenavigation: ServiceNavigatorService;

  constructor() {
    this.calculatorService = new CalculatorService();
    this.githubService = new GitHubService();
    this.classifierService = new ClassifierService('AIzaSyCmBWJsVC5I-OxvFCnhEepiw99EXmrMjDo', 
      { serviceId: 'service_d2q0hie', templateId: 'template_uwypvfq', publicKey: 'onWlYiqHMNbeHmj8H' }
    ,'omkarsubhashghongade21@gmail.com');
    this.servicenavigation = new ServiceNavigatorService('AIzaSyCmBWJsVC5I-OxvFCnhEepiw99EXmrMjDo');
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

      if( this.isClassifierTool(toolName)) {
        console.log('Classifier tool detected:', toolName);
        await this.classifierServices(toolName,req.body.question, res);
        return;
      }

      if (this.isServiceNavigationTool(toolName)) {
        console.log('Service navigation tool detected:', toolName);
        await this.serviceNavigation(toolName, req.body.question, res);
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

  private async classifierServices(toolName:string, question: string, res: Response): Promise<string> {
    switch (toolName) {
      case 'classify':
        if (!question) {
          throw new Error('Missing required parameter: question');
        }
        const categories = await this.classifierService.classify(question);
        console.log('Classification result:', categories);
        const response = new BaseSuccessResponseDto({
          categories,
          tool_type: 'classifier'
        }, 'mixed');
        res.json(response);
      default:
        throw new Error(`Unknown classifier tool: ${toolName}`);
    }
  }

  private async serviceNavigation(toolName:string, question: string, res: Response): Promise<string> {
    switch (toolName) {
      case 'helpwithservice':
        if (!question) {
          throw new Error('Missing required parameter: question');
        }
        const response = await this.servicenavigation.helpWithService(question);
        console.log('Service navigation result:', response);
        const successResponse = new BaseSuccessResponseDto({
          response,
          tool_type: 'servicenavigation'
        }, 'mixed');
        res.json(successResponse);
      default:
        throw new Error(`Unknown service navigation tool: ${toolName}`);
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

  private isClassifierTool(toolName: string): boolean {
    return this.classifier().includes(toolName);
  }

  private isServiceNavigationTool(toolName: string): boolean {
    return this.servicenavigations().includes(toolName);
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

  private classifier(): string[]{
    return ['classify'];
  }

  private servicenavigations(): string[]{
    return ['helpwithservice'];
  }
} 