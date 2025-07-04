import express, { Application, Request, Response } from 'express';
import { errorHandler, notFound } from '@/middlewares/errorHandler.js';
import toolsRoutes from '@/routes/toolsRoutes.js';
import appRoutes from '@/routes/appRoutes.js';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createApp = async (): Promise<Application> => {
  const app: Application = express();

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from public directory
  app.use(express.static(path.join(__dirname, '../public')));

  // Serve static files from uploads directory
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // CORS headers (basic implementation)
  app.use((req: Request, res: Response, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Landing page route
  app.get('/', async (req: Request, res: Response) => {
    try {
      const readmePath = path.join(__dirname, '../README.md');
      const readmeContent = await fs.readFile(readmePath, 'utf-8');
      res.type('text/plain').send(readmeContent);
    } catch (error) {
      console.error('Failed to read README.md:', error);
      res.status(500).send('Failed to load README.md');
    }
  });

  // Load swagger document
  let swaggerDocument: any;
  try {
    swaggerDocument = JSON.parse(
      await fs.readFile(path.join(__dirname, '../public/swagger.json'), 'utf-8')
    );
  } catch (error) {
    console.error('Failed to load swagger.json:', error);
    swaggerDocument = { openapi: '3.0.3', info: { title: 'API', version: '1.0.0' }, paths: {} };
  }

  // Documentation route using swagger-ui-express
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Handle service worker requests (prevent 404 spam)
  app.get('/sw.js', (req: Request, res: Response) => {
    res.status(204).end(); // No Content - service worker not implemented
  });

  // Health check route
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Calculator + GitHub Agent is running!',
      timestamp: new Date().toISOString(),
      tools: {
        calculator: 'No authentication required',
        github: 'Bearer token authentication required'
      }
    });
  });

  // Agent routes
  app.use('/tools', toolsRoutes);
  app.use('/', appRoutes);

  // 404 handler
  app.use(notFound);

  // Error handler
  app.use(errorHandler);

  return app;
};

export default createApp; 