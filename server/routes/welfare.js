import {Router} from 'express';
import {WelfareScheme,WelfareApplication} from '../models/Welfare.js';
import {auth,admin} from '../middleware/auth.js';
const r=Router();r.use(auth);

// Schemes
r.get('/schemes',async(q,s)=>s.json({schemes:await WelfareScheme.find(),total:await WelfareScheme.countDocuments()}));
r.get('/schemes/:id',async(q,s)=>s.json(await WelfareScheme.findById(q.params.id)));
r.post('/schemes',admin,async(q,s)=>s.status(201).json(await WelfareScheme.create(q.body)));
r.put('/schemes/:id',admin,async(q,s)=>s.json(await WelfareScheme.findByIdAndUpdate(q.params.id,q.body,{new:true})));

// Applications
r.get('/applications',async(q,s)=>{
  const filter=q.user.role==='admin'?{}:{user:q.user.id};
  const apps=await WelfareApplication.find(filter).populate('scheme').populate('user','name email').sort({createdAt:-1});
  s.json({applications:apps,total:apps.length});
});

r.post('/applications',async(q,s)=>{
  const scheme=await WelfareScheme.findById(q.body.scheme_id);
  const app=await WelfareApplication.create({
    scheme:q.body.scheme_id,
    user:q.user.id,
    scheme_name:scheme?.name||'',
    citizen_name:q.user.name,
    reason:q.body.reason||'',
    status:'applied'
  });
  s.status(201).json(app);
});

r.put('/applications/:id',admin,async(q,s)=>s.json(await WelfareApplication.findByIdAndUpdate(q.params.id,q.body,{new:true})));

export default r;
