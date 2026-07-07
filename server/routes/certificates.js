import {Router} from 'express';
import Certificate from '../models/Certificate.js';
import Citizen from '../models/Citizen.js';
import Notification from '../models/Notification.js';
import {auth,admin} from '../middleware/auth.js';
const r=Router();r.use(auth);

r.get('/',async(q,s)=>{
  const filter=q.user.role==='admin'?{}:{user:q.user.id};
  const certs=await Certificate.find(filter).populate('user','name email').sort({createdAt:-1});
  s.json({certificates:certs,total:certs.length});
});

r.get('/:id',async(q,s)=>{
  const cert=await Certificate.findById(q.params.id).populate('user','name email');
  if(!cert) return s.status(404).json({error:'Not found'});
  s.json(cert);
});

r.get('/:id/preview',async(q,s)=>{
  const cert=await Certificate.findById(q.params.id).populate('user','name email').lean();
  if(!cert) return s.status(404).json({error:'Not found'});
  // Try to find citizen data
  const citizens=await Citizen.find().lean();
  const citizen=citizens.find(c=>c.name===cert.citizen_name||c.name===cert.applicantName)||{};
  cert.citizen=citizen;
  cert.village_settings={village_name:'Sundarpur',district:'Gorakhpur',state:'Uttar Pradesh',pincode:'273152'};
  s.json(cert);
});

r.post('/',async(q,s)=>{
  const total=await Certificate.countDocuments();
  const certNum=`CERT-${String(total+1).padStart(4,'0')}`;
  const cert=await Certificate.create({
    ...q.body,
    user:q.user.id,
    citizen_name:q.user.name,
    certificateNumber:certNum,
    status:'requested',
    status_history:[{status:'requested',note:'Certificate request submitted',changed_by:q.user.name,changed_at:new Date()}]
  });
  s.status(201).json(cert);
});

r.put('/:id',admin,async(q,s)=>{
  const cert=await Certificate.findById(q.params.id);
  if(!cert) return s.status(404).json({error:'Not found'});
  const oldStatus=cert.status;
  Object.assign(cert,q.body);
  if(q.body.status==='issued') cert.issue_date=new Date();
  if(q.body.status && q.body.status!==oldStatus){
    cert.status_history.push({status:q.body.status,note:q.body.admin_notes||`Status changed to ${q.body.status}`,changed_by:q.user.name,changed_at:new Date()});
    if (cert.user) {
      await Notification.create({
        type: 'alert',
        title: 'Certificate Update',
        message: `Your ${cert.cert_type||cert.type} certificate request has been updated to "${q.body.status}".`,
        target_user: cert.user,
        createdBy: q.user.name
      });
    }
  }
  await cert.save();
  s.json(cert);
});

export default r;
