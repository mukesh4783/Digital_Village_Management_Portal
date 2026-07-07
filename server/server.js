import 'dotenv/config';import express from 'express';import cors from 'cors';import path from 'path';import {fileURLToPath} from 'url';import {connectDB} from './config/db.js';import authRoutes from './routes/auth.js';import dashboard from './routes/dashboard.js';import services from './routes/services.js';import welfare from './routes/welfare.js';import notifications from './routes/notifications.js';import reports from './routes/reports.js';import adminRoutes from './routes/admin.js';import chatRoute from './routes/chat.js';import certificatesRoute from './routes/certificates.js';import {crudRouter} from './routes/crud.js';import Citizen from './models/Citizen.js';import Household from './models/Household.js';import Resource from './models/Resource.js';
const __filename=fileURLToPath(import.meta.url);const __dirname=path.dirname(__filename);
const app=express();app.use(cors());app.use(express.json());
// Ensure DB connection is established for serverless environments before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});
app.get('/api/health',(q,s)=>s.json({status:'ok',stack:'MERN'}));app.use('/api/auth',authRoutes);app.use('/api/dashboard',dashboard);app.use('/api/citizens',crudRouter(Citizen,{adminWrite:true}));app.use('/api/households',crudRouter(Household,{adminWrite:true}));app.use('/api/services',services);app.use('/api/welfare',welfare);app.use('/api/certificates',certificatesRoute);app.use('/api/notifications',notifications);app.use('/api/resources',crudRouter(Resource,{adminWrite:true}));app.use('/api/reports',reports);app.use('/api/admin',adminRoutes);app.use('/api/chat',chatRoute);app.use((e,q,s,n)=>s.status(500).json({error:e.message}));
if(!process.env.VERCEL){
  const port=process.env.PORT||5000;
  app.listen(port,()=>console.log(`Server running on http://localhost:${port}`));
}
export default app;
