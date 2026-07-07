import {Router} from 'express'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import User from '../models/User.js';
import Citizen from '../models/Citizen.js';

const r=Router(); 
const token=u=>jwt.sign({id:u._id,role:u.role,name:u.name},process.env.JWT_SECRET||'gramsetu_secure_jwt_secret_2024',{expiresIn:'7d'});

r.post('/register',async(req,res)=>{
  try{
    if(await User.findOne({email:req.body.email})) {
      return res.status(400).json({error:'Email already registered'});
    }
    
    let role = 'citizen';
    if(req.body.role === 'admin') {
      if(req.body.secretKey !== '1234') {
        return res.status(403).json({error: 'Invalid admin secret key'});
      }
      role = 'admin';
    }

    const u=await User.create({
      ...req.body,
      role,
      password:await bcrypt.hash(req.body.password,10)
    });
    
    // Auto-create a linked Citizen profile when a user registers
    await Citizen.create({
      name: u.name,
      email: u.email,
      phone: req.body.phone || '',
      status: 'active'
    });
    
    res.status(201).json({token:token(u),user:{id:u._id,name:u.name,email:u.email,role:u.role}});
  }catch(e){
    res.status(400).json({error:e.message});
  }
});

r.post('/login',async(req,res)=>{
  const u=await User.findOne({email:req.body.email});
  if(!u||!await bcrypt.compare(req.body.password,u.password)) {
    return res.status(401).json({error:'Invalid credentials'});
  }
  
  if (req.body.loginType === 'admin' && u.role !== 'admin') {
    return res.status(403).json({error: 'Access denied. You do not have admin privileges.'});
  }
  
  res.json({token:token(u),user:{id:u._id,name:u.name,email:u.email,role:u.role}});
});

r.get('/me',async(req,res)=>{
  try{
    const p=req.headers.authorization?.split(' ')[1];
    const d=jwt.verify(p,process.env.JWT_SECRET||'gramsetu_secure_jwt_secret_2024');
    const u=await User.findById(d.id).select('-password');
    res.json(u);
  }catch{
    res.status(401).json({error:'Authentication required'});
  }
}); 

r.post('/logout',(req,res)=>res.json({message:'Logged out'})); 

export default r;
