import express from 'express';
import connectDB from './config/db.js';
import cors from "cors"
import compression from "compression"
import { environment } from './config/environment.js';
import initRoutes from './routes/index.js';


const app = express()
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true
    })
)
initRoutes(app)
// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

// Start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const PORT = environment.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
