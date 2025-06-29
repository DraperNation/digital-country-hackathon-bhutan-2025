import createApp from '@/app.js';
import config from '@/config/config.js';

const startServer = async (): Promise<void> => {
  try {
    const app = await createApp();
    
    app.listen(config.port, () => {
      console.log(`⚡️[server]: Bhindi.io Agent Starter server is running at http://localhost:${config.port}`);
      console.log(`⚡️[server]: Environment: ${config.nodeEnv}`);
      console.log(`⚡️[server]: Tools listing available at http://localhost:${config.port}/tools`);
      console.log(`⚡️[server]: Health check available at http://localhost:${config.port}/health`);
      console.log(`📖[server]: API documentation available at http://localhost:${config.port}/docs`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});

startServer(); 