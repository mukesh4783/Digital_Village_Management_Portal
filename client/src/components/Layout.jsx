import {useEffect, useState} from 'react';
import {NavLink,Outlet,useLocation} from 'react-router-dom';
import {Home,Users,House,ClipboardList,HeartHandshake,FileBadge,Bell,Package,BarChart3,Shield,LogOut} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import Chatbot from './Chatbot';
import {api} from '../api';

const items=[
  ['/','Dashboard',Home],
  ['/citizens','Citizens',Users],
  ['/households','Households',House],
  ['/services','Services',ClipboardList],
  ['/welfare','Welfare',HeartHandshake],
  ['/certificates','Certificates',FileBadge],
  ['/notifications','Notifications',Bell],
  ['/resources','Resources',Package],
  ['/reports','Reports',BarChart3],
  ['/admin','Admin',Shield]
];

export default function Layout(){
  const {user,logout}=useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if(user) {
      api('/notifications/unread-count')
        .then(res => setUnreadCount(res.count))
        .catch(console.error);
    }
    
    // Check every 30 seconds for new notifications
    const interval = setInterval(() => {
      api('/notifications/unread-count')
        .then(res => setUnreadCount(res.count))
        .catch(console.error);
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Clear badge when visiting the notifications page
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/notifications') {
      setUnreadCount(0);
    }
  }, [location]);

  return <>
    <div className="shell">
      <aside>
        <div className="brand">🌿 GramSetu</div>
        <div className="village">Digital Village Portal</div>
        <nav>
          {items.filter(x=>!['/citizens','/households','/resources','/reports','/admin'].includes(x[0])||user?.role==='admin').map(([to,label,Icon])=>
            <NavLink key={to} to={to} className={({isActive}) => isActive ? 'active' : ''}>
              <Icon size={18}/>
              {label}
              {to === '/notifications' && unreadCount > 0 && (
                <span className="badge" style={{background:'#ef4444', color:'white', padding:'2px 8px', borderRadius:'12px', fontSize:'11px', fontWeight:600, marginLeft:'auto'}}>
                  {unreadCount}
                </span>
              )}
            </NavLink>
          )}
        </nav>
        <button className="logout" onClick={logout}><LogOut size={18}/> Logout</button>
      </aside>
      <main>
        <header>
          <div>
            <b>Welcome, {user?.name}</b><small>{user?.role}</small>
          </div>
        </header>
        <section className="content">
          <Outlet/>
        </section>
      </main>
    </div>
    <Chatbot/>
  </>;
}
