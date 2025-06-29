import { Router, Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ToolsResponseDto, ToolDto, BaseErrorResponseDto } from '@/types/agent.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

/**
 * GET /tools - Returns list of available tools
 * Public endpoint (no authentication required)
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // Read tools configuration from JSON file
    const toolsPath = path.join(__dirname, '../config/tools.json');
    const toolsData = await fs.readFile(toolsPath, 'utf-8');
    const toolsConfig = JSON.parse(toolsData);

    // Convert JSON config to DTO objects
    const tools: ToolDto[] = toolsConfig.map((tool: any) => new ToolDto(
      tool.name,
      tool.description,
      tool.parameters,
      tool.confirmationRequired,
    ));

    const response = new ToolsResponseDto(tools);
    res.json(response);
  } catch (error: any) {
    const errorResponse = new BaseErrorResponseDto(
      'Failed to load tools configuration',
      500,
      error.message
    );
    res.status(500).json(errorResponse);
  }
});

export default router; 