import {Router} from 'express';
import Service from '../models/ServiceRequest.js';
import {auth,admin} from '../middleware/auth.js';
const r=Router();r.use(auth);

r.get('/categories',(q,s)=>s.json(['Water Supply','Road Repair','Sanitation','Electricity','Other']));

r.get('/requests',async(q,s)=>{
  const filter=q.user.role==='admin'?{}:{user:q.user.id};
  const reqs=await Service.find(filter).populate('user','name email').sort({createdAt:-1});
  s.json({requests:reqs,total:reqs.length});
});

r.post('/requests',async(q,s)=>{
  const svc=await Service.create({...q.body,user:q.user.id,status:'submitted',status_history:[{status:'submitted',note:'Request submitted',changed_by:q.user.name,changed_at:new Date()}]});
  s.status(201).json(svc);
});

r.get('/requests/:id',async(q,s)=>{
  const svc=await Service.findById(q.params.id).populate('user','name email');
  if(!svc) return s.status(404).json({error:'Not found'});
  s.json(svc);
});

r.put('/requests/:id',async(q,s)=>{
  const svc=await Service.findById(q.params.id);
  if(!svc) return s.status(404).json({error:'Not found'});
  const oldStatus=svc.status;
  Object.assign(svc,q.body);
  if(q.body.status && q.body.status!==oldStatus){
    svc.status_history.push({status:q.body.status,note:q.body.status_note||`Status changed to ${q.body.status}`,changed_by:q.user.name,changed_at:new Date()});
  }
  await svc.save();
  s.json(svc);
});

r.post('/requests/:id/comment',async(q,s)=>{
  const svc=await Service.findById(q.params.id);
  svc.comments.push({text:q.body.text,by:q.user.name});
  await svc.save();
  s.json(svc);
});

export default r;
