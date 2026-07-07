import {useEffect,useState} from 'react';
import {api} from '../api';
import {useAuth} from '../context/AuthContext';
import {Link} from 'react-router-dom';
import {UserPlus,ClipboardPlus,FilePlus,Megaphone,LogIn,PlusCircle,Edit3,Trash2,Activity} from 'lucide-react';
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,ArcElement,Title,Tooltip,Legend} from 'chart.js';
import {Bar,Doughnut} from 'react-chartjs-2';
ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,Title,Tooltip,Legend);

const colors=['#16734a','#0d9488','#2563eb','#d97706','#dc2626','#6b21a8','#0891b2','#be185d'];

function StatCard({value,label,color}){
  return <div className={`stat ${color||''}`}><strong>{value||0}</strong><span>{label}</span></div>;
}

function ActionCard({icon:Icon,title,desc,color,to}){
  return <Link to={to} style={{textDecoration:'none',color:'inherit'}}>
    <div className="action-card"><div className={`action-card-icon ${color}`}><Icon size={20}/></div><div><div className="action-card-title">{title}</div><div className="action-card-desc">{desc}</div></div></div>
  </Link>;
}

function timeAgo(d){if(!d)return '';const s=Math.floor((Date.now()-new Date(d))/1000);if(s<60)return 'just now';if(s<3600)return Math.floor(s/60)+'m ago';if(s<86400)return Math.floor(s/3600)+'h ago';return Math.floor(s/86400)+'d ago';}

export default function Dashboard(){
  const {user}=useAuth();
  const [stats,setStats]=useState({});
  const [notifications,setNotifications]=useState([]);
  const [serviceData,setServiceData]=useState(null);
  const [welfareData,setWelfareData]=useState(null);
  const [audit,setAudit]=useState([]);

  useEffect(()=>{
    api(user.role==='admin'?'/dashboard/stats':'/dashboard/citizen-stats').then(setStats).catch(console.error);
    api('/notifications').then(d=>setNotifications(Array.isArray(d)?d:[])).catch(console.error);
    if(user.role==='admin'){
      api('/reports/services').then(setServiceData).catch(console.error);
      api('/reports/welfare').then(setWelfareData).catch(console.error);
      api('/admin/audit-log').then(setAudit).catch(console.error);
    }
  },[user.role]);

  const adminCards=[
    {v:stats.total_citizens,l:'Total Citizens',c:'primary'},
    {v:stats.total_households,l:'Households',c:'secondary'},
    {v:stats.pending_requests,l:'Pending Requests',c:'warm'},
    {v:stats.welfare_beneficiaries,l:'Welfare Beneficiaries',c:'blue'}
  ];
  const citizenCards=[
    {v:stats.my_service_requests,l:'My Requests',c:'primary'},
    {v:stats.my_pending_requests,l:'Pending',c:'warm'},
    {v:stats.my_welfare_applications,l:'Welfare Applications',c:'secondary'},
    {v:stats.my_certificates,l:'Certificates',c:'blue'}
  ];
  const cards=user.role==='admin'?adminCards:citizenCards;

  const chartOpts={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}};

  return <>
    <div className="page-title"><h1>Dashboard</h1><p>Welcome to the Digital Village Management Portal</p></div>
    <div className="stats">{cards.map(c=><StatCard key={c.l} value={c.v} label={c.l} color={c.c}/>)}</div>

    {user.role==='admin' && serviceData && <div className="charts-grid">
      <div className="chart-card"><div className="chart-card-header"><h3 className="chart-card-title">Service Requests by Month</h3></div>
        <div className="chart-wrapper"><Bar options={{...chartOpts,scales:{y:{beginAtZero:true}}}} data={{labels:Object.keys(serviceData.by_month||{}).map(m=>{const [y,mo]=m.split('-');return new Date(y,mo-1).toLocaleDateString('en',{month:'short'});}),datasets:[{label:'Requests',data:Object.values(serviceData.by_month||{}),backgroundColor:colors[0]}]}}/></div>
      </div>
      <div className="chart-card"><div className="chart-card-header"><h3 className="chart-card-title">Request Status Distribution</h3></div>
        <div className="chart-wrapper"><Doughnut options={{...chartOpts,plugins:{legend:{display:true,position:'bottom'}}}} data={{labels:Object.keys(serviceData.by_status||{}).map(s=>s.charAt(0).toUpperCase()+s.slice(1)),datasets:[{data:Object.values(serviceData.by_status||{}),backgroundColor:colors}]}}/></div>
      </div>
      <div className="chart-card"><div className="chart-card-header"><h3 className="chart-card-title">Requests by Category</h3></div>
        <div className="chart-wrapper"><Bar options={{...chartOpts,indexAxis:'y',scales:{x:{beginAtZero:true}}}} data={{labels:Object.keys(serviceData.by_category||{}),datasets:[{label:'Requests',data:Object.values(serviceData.by_category||{}),backgroundColor:colors[1]}]}}/></div>
      </div>
      {welfareData && <div className="chart-card"><div className="chart-card-header"><h3 className="chart-card-title">Welfare Scheme Applications</h3></div>
        <div className="chart-wrapper"><Bar options={{...chartOpts,scales:{y:{beginAtZero:true}}}} data={{labels:Object.keys(welfareData.by_scheme||{}).map(s=>s.length>20?s.slice(0,20)+'...':s),datasets:[{label:'Applications',data:Object.values(welfareData.by_scheme||{}),backgroundColor:colors[2]}]}}/></div>
      </div>}
    </div>}

    <div className="charts-grid">
      {user.role==='admin' && <div className="glass-card">
        <h3 className="chart-card-title" style={{marginBottom:16}}>Recent Activity</h3>
        <div className="activity-feed">
          {(audit||[]).slice(0,10).map((a,i)=>{
            const iconMap={login:LogIn,create:PlusCircle,update:Edit3,delete:Trash2};
            const colorMap={login:'rgba(16,185,129,0.12)',create:'rgba(59,130,246,0.12)',update:'rgba(245,158,11,0.12)',delete:'rgba(239,68,68,0.12)'};
            const Icon=iconMap[a.action]||Activity;
            return <div className="activity-item" key={a._id||i}>
              <div className="activity-icon" style={{background:colorMap[a.action]||colorMap.update}}><Icon size={14}/></div>
              <div className="activity-text"><strong>{a.username||'System'}</strong> — {a.details||a.action}</div>
              <div className="activity-time">{timeAgo(a.createdAt)}</div>
            </div>;
          })}
          {!audit?.length&&<p className="empty">No recent activity.</p>}
        </div>
      </div>}
      <div className="glass-card">
        <h3 className="chart-card-title" style={{marginBottom:16}}>Quick Actions</h3>
        <div className="action-grid">
          {user.role==='admin'?<>
            <ActionCard icon={UserPlus} title="Register Citizen" desc="Add new citizen record" color="primary" to="/citizens"/>
            <ActionCard icon={ClipboardPlus} title="New Request" desc="Submit service request" color="blue" to="/services"/>
            <ActionCard icon={FilePlus} title="Issue Certificate" desc="Process certificate request" color="secondary" to="/certificates"/>
            <ActionCard icon={Megaphone} title="Announcement" desc="Create notification" color="warm" to="/notifications"/>
          </>:<>
            <ActionCard icon={ClipboardPlus} title="New Service Request" desc="Submit a complaint or request" color="primary" to="/services"/>
            <ActionCard icon={FilePlus} title="Request Certificate" desc="Apply for certificates" color="blue" to="/certificates/new"/>
            <ActionCard icon={Megaphone} title="Apply for Scheme" desc="Browse welfare schemes" color="secondary" to="/welfare"/>
            <ActionCard icon={Activity} title="Notifications" desc="View announcements" color="warm" to="/notifications"/>
          </>}
        </div>
      </div>
    </div>

    <div className="glass-card">
      <h3 className="chart-card-title" style={{marginBottom:16}}>Notice Board / Announcements</h3>
      {notifications.map(n=><div key={n._id} style={{padding:'10px 0',borderBottom:'1px solid #eee'}}>
        <strong>{n.title}</strong><span style={{float:'right',fontSize:'12px',color:'#888'}}>{new Date(n.createdAt).toLocaleDateString()}</span>
        <p style={{margin:'5px 0 0 0'}}>{n.message}</p>
      </div>)}
      {!notifications.length&&<p className="empty">No recent announcements.</p>}
    </div>
  </>;
}
