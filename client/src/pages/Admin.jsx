import {useEffect,useState} from 'react';
import {api} from '../api';
import {Link} from 'react-router-dom';
import {Users,Shield,Activity,Settings,Database} from 'lucide-react';

function ActionCard({icon:Icon,title,desc,color,to}){
  return <Link to={to} style={{textDecoration:'none',color:'inherit'}}>
    <div className="action-card" style={{padding:24}}>
      <div className={`action-card-icon ${color}`} style={{width:52,height:52,marginBottom:16}}><Icon size={24}/></div>
      <div className="action-card-title" style={{fontSize:16}}>{title}</div>
      <div className="action-card-desc">{desc}</div>
    </div>
  </Link>;
}

export default function Admin(){
  const [stats,setStats]=useState({});
  useEffect(()=>{
    api('/dashboard/stats').then(setStats).catch(console.error);
  },[]);

  return <>
    <div className="page-title"><h1>Admin Control Panel</h1><p>System configuration and management</p></div>

    <div className="stats">
      <div className="stat primary"><strong>{stats.total_users||0}</strong><span>System Users</span></div>
      <div className="stat secondary"><strong>{stats.total_citizens||0}</strong><span>Registered Citizens</span></div>
      <div className="stat warm"><strong>{stats.pending_requests||0}</strong><span>Pending Actions</span></div>
      <div className="stat blue"><strong>{(stats.total_welfare_schemes||0)}</strong><span>Active Schemes</span></div>
    </div>

    <div className="cards" style={{marginTop:32}}>
      <ActionCard icon={Users} title="User Management" desc="Manage system users, roles, and access permissions." color="primary" to="/admin/users"/>
      <ActionCard icon={Activity} title="Audit Logs" desc="View system activity, logins, and data modifications." color="blue" to="/admin/audit"/>
      <ActionCard icon={Settings} title="Village Settings" desc="Configure village profile, display names, and defaults." color="secondary" to="/admin"/>
      <ActionCard icon={Shield} title="Security" desc="Manage authentication settings and active sessions." color="warm" to="/admin"/>
      <ActionCard icon={Database} title="Data Backup" desc="Export system data and manage backups." color="primary" to="/admin"/>
    </div>
  </>;
}
