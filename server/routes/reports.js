import {Router} from 'express';import {auth,admin} from '../middleware/auth.js';import Citizen from '../models/Citizen.js';import Service from '../models/ServiceRequest.js';import Certificate from '../models/Certificate.js';import Resource from '../models/Resource.js';import {WelfareApplication} from '../models/Welfare.js';
const r=Router();r.use(auth,admin);
r.get('/summary',async(q,s)=>s.json({citizens:await Citizen.countDocuments(),services:await Service.countDocuments(),welfare:await WelfareApplication.countDocuments(),certificates:await Certificate.countDocuments(),resources:await Resource.countDocuments()}));
r.get('/demographics',async(q,s)=>s.json({total:await Citizen.countDocuments(),by_gender:await Citizen.aggregate([{$group:{_id:'$gender',count:{$sum:1}}}])}));
r.get('/services',async(q,s)=>s.json({total:await Service.countDocuments(),by_status:await Service.aggregate([{$group:{_id:'$status',count:{$sum:1}}}])}));
r.get('/welfare',async(q,s)=>s.json({total:await WelfareApplication.countDocuments(),by_status:await WelfareApplication.aggregate([{$group:{_id:'$status',count:{$sum:1}}}])}));
r.get('/certificates',async(q,s)=>s.json({total:await Certificate.countDocuments(),by_status:await Certificate.aggregate([{$group:{_id:'$status',count:{$sum:1}}}])}));
r.get('/resources',async(q,s)=>s.json({total:await Resource.countDocuments(),quantity:await Resource.aggregate([{$group:{_id:null,total:{$sum:'$quantity'},allocated:{$sum:'$allocated'}}}])}));export default r;
