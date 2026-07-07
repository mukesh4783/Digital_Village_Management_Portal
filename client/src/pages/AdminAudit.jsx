import {useEffect,useState} from 'react';
import {api} from '../api';
import {ArrowLeft,LogIn,PlusCircle,Edit3,Trash2,Activity} from 'lucide-react';
import {Link} from 'react-router-dom';

export default function AdminAudit(){
  const [logs,setLogs]=useState([]);
  useEffect(()=>{api('/admin/audit-log').then(setLogs).catch(console.error);},[]);

  return <>
    <div className="page-title row">
      <div><h1>Audit Logs</h1><p>System activity history</p></div>
      <Link to="/admin"><button className="btn-outline"><ArrowLeft size={16}/> Back to Admin</button></Link>
    </div>

    <div className="glass-card">
      <div className="activity-feed" style={{maxHeight:'none'}}>
        {logs.map(a=>{
          const iconMap={login:LogIn,create:PlusCircle,update:Edit3,delete:Trash2};
          const colorMap={login:'rgba(16,185,129,0.12)',create:'rgba(59,130,246,0.12)',update:'rgba(245,158,11,0.12)',delete:'rgba(239,68,68,0.12)'};
          const Icon=iconMap[a.action]||Activity;
          return <div className="activity-item" key={a._id} style={{padding:16,borderBottom:'1px solid #f1f5f9'}}>
            <div className="activity-icon" style={{background:colorMap[a.action]||colorMap.update}}><Icon size={16}/></div>
            <div className="activity-text">
              <div style={{fontWeight:600,marginBottom:4}}>{a.username||'System'} <span style={{fontWeight:400,color:'#94a3b8',fontSize:12}}>({a.ipAddress||'Local'})</span></div>
              <div>{a.details||a.action}</div>
            </div>
            <div className="activity-time">{new Date(a.createdAt).toLocaleString()}</div>
          </div>;
        })}
        {!logs.length&&<p className="empty">No audit logs found.</p>}
      </div>
    </div>
  </>;
}
