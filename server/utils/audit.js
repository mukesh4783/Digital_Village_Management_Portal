import Audit from '../models/Audit.js';
export async function logAudit(user, action, details='') { try { await Audit.create({username:user?.name||'system',action,details}); } catch(e) { console.error('Audit log failed:', e.message); } }
