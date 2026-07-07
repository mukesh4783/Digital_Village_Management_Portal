import {Router} from 'express';
import {auth,admin} from '../middleware/auth.js';
import Citizen from '../models/Citizen.js';
import Household from '../models/Household.js';
import Service from '../models/ServiceRequest.js';
import Certificate from '../models/Certificate.js';
import {WelfareScheme,WelfareApplication} from '../models/Welfare.js';
import Notification from '../models/Notification.js';
import Resource from '../models/Resource.js';
const r=Router();r.use(auth);

r.get('/summary',admin,async(q,s)=>{
  const [citizens,households,services,certs,schemes,apps,notifs,resources]=await Promise.all([
    Citizen.countDocuments(),Household.countDocuments(),Service.countDocuments(),
    Certificate.countDocuments(),WelfareScheme.countDocuments(),WelfareApplication.countDocuments(),
    Notification.countDocuments(),Resource.countDocuments()
  ]);
  s.json({total_citizens:citizens,total_households:households,total_service_requests:services,total_certificates:certs,total_welfare_schemes:schemes,total_welfare_applications:apps,total_notifications:notifs,total_resources:resources});
});

r.get('/services',admin,async(q,s)=>{
  const reqs=await Service.find().lean();
  const by_status={};const by_category={};const by_month={};
  reqs.forEach(r=>{
    by_status[r.status]=(by_status[r.status]||0)+1;
    by_category[r.category]=(by_category[r.category]||0)+1;
    if(r.createdAt){const d=new Date(r.createdAt);const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;by_month[key]=(by_month[key]||0)+1;}
  });
  s.json({by_status,by_category,by_month,total:reqs.length});
});

r.get('/welfare',admin,async(q,s)=>{
  const apps=await WelfareApplication.find().populate('scheme').lean();
  const by_scheme={};const by_status={};
  apps.forEach(a=>{
    const name=a.scheme?.name||'Unknown';
    by_scheme[name]=(by_scheme[name]||0)+1;
    by_status[a.status]=(by_status[a.status]||0)+1;
  });
  s.json({by_scheme,by_status,total:apps.length});
});

export default r;
