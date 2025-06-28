import userRoute from './user.js';
import legalEntityRoute from './legalEntity.js';
import aiRoute from './ai.js';
import identityRoute from './identity.js';
import { Router } from 'express';

const indexRouter = Router();

indexRouter.use('/users', userRoute);
indexRouter.use('/legal-entities', legalEntityRoute);
indexRouter.use('/ai', aiRoute);
indexRouter.use('/identity', identityRoute);

export default indexRouter;
