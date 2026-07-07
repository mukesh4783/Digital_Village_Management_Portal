import {Router} from 'express';
import Notification from '../models/Notification.js';
import {auth,admin} from '../middleware/auth.js';

const r=Router();
r.use(auth);

r.get('/',async(q,s)=>{
  const filter = q.user.role === 'admin' 
    ? {} 
    : { $or: [{target_user: null}, {target_user: q.user.id}] };
  const notifs = await Notification.find(filter).sort({createdAt:-1});
  s.json(notifs);
});

r.post('/',admin,async(q,s)=>{
  const n = await Notification.create({...q.body,createdBy:q.user.name});
  s.status(201).json(n);
});

export default r;
