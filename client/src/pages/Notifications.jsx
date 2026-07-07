import {useEffect,useState} from 'react';
import {api} from '../api';
import {useAuth} from '../context/AuthContext';
import {Bell,AlertCircle,CheckCircle,Info} from 'lucide-react';

export default function Notifications(){
  const {user} = useAuth();
  const [notifs,setNotifs]=useState([]);

  const load=()=>api('/notifications').then(setNotifs).catch(console.error);
  
  useEffect(()=>{
    load();
    // Mark as read when opening the page
    api('/notifications/read-all', {method: 'PUT'}).catch(console.error);
  },[]);

  return <>
    <div className="page-title">
      <h1>Notifications</h1>
      <p>System announcements and alerts</p>
    </div>

    <div className="glass-card">
      <div className="activity-feed" style={{maxHeight:'none'}}>
        {notifs.map(n=>{
          const icon = n.type === 'alert' ? AlertCircle : Info;
          const color = n.type === 'alert' ? '#ef4444' : '#3b82f6';
          const Icon = icon;
          
          return <div className={`activity-item ${!n.is_read ? 'unread' : ''}`} key={n._id} style={{padding:16,borderBottom:'1px solid #f1f5f9', background: !n.is_read ? '#f8fafc' : 'transparent'}}>
            <div className="activity-icon" style={{color, background:`${color}15`}}><Icon size={16}/></div>
            <div className="activity-text">
              <div style={{fontWeight:600,marginBottom:4}}>{n.title}</div>
              <div style={{color:'#475569'}}>{n.message}</div>
            </div>
            <div className="activity-time">{new Date(n.createdAt).toLocaleString()}</div>
          </div>;
        })}
        {!notifs.length&&<p className="empty">No notifications yet.</p>}
      </div>
    </div>
  </>;
}
