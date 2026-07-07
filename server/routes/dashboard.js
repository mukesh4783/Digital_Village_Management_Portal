import {Router} from 'express';import {auth} from '../middleware/auth.js';import User from '../models/User.js';import Citizen from '../models/Citizen.js';import Household from '../models/Household.js';import Service from '../models/ServiceRequest.js';import {WelfareApplication, WelfareScheme} from '../models/Welfare.js';import Certificate from '../models/Certificate.js';const r=Router();r.use(auth);
r.get('/stats',async(q,s)=>{
  const pendingServices = await Service.countDocuments({status: { $in: ['submitted', 'under_review'] }});
  const pendingWelfare = await WelfareApplication.countDocuments({status: { $in: ['applied', 'under_review'] }});
  const pendingCerts = await Certificate.countDocuments({status: { $in: ['requested', 'processing'] }});
  
  s.json({
    total_users: await User.countDocuments(),
    total_citizens: await Citizen.countDocuments(),
    pending_requests: pendingServices + pendingWelfare + pendingCerts,
    total_welfare_schemes: await WelfareScheme.countDocuments()
  });
});
r.get('/citizen-stats',async(q,s)=>s.json({my_service_requests:await Service.countDocuments({user:q.user.id}),my_pending_requests:await Service.countDocuments({user:q.user.id,status: { $in: ['submitted', 'under_review'] }}),my_welfare_applications:await WelfareApplication.countDocuments({user:q.user.id}),my_certificates:await Certificate.countDocuments({user:q.user.id})}));r.get('/recent-activity',(q,s)=>s.json([]));export default r;
