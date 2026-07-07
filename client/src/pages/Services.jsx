import {useEffect,useState} from 'react';
import {api} from '../api';
import {useAuth} from '../context/AuthContext';
import {Link,useNavigate} from 'react-router-dom';
import {Search,ClipboardPlus} from 'lucide-react';

function Badge({status}){
  const m={submitted:'badge-blue',under_review:'badge-yellow',in_progress:'badge-yellow',completed:'badge-green',resolved:'badge-green',rejected:'badge-red',pending:'badge-yellow'};
  return <span className={`badge ${m[status]||'badge-gray'}`}>{(status||'').replace(/_/g,' ')}</span>;
}
function PBadge({p}){const m={low:'badge-low',medium:'badge-medium',high:'badge-high',urgent:'badge-urgent'};return <span className={`badge ${m[p]||'badge-gray'}`}>{p}</span>;}

export default function Services(){
  const {user}=useAuth();
  const nav=useNavigate();
  const [rows,setRows]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [f,setF]=useState({title:'',category:'Water Supply',description:'',priority:'medium',location:''});
  const [search,setSearch]=useState('');
  const [filterStatus,setFilterStatus]=useState('');

  const load=()=>api('/services/requests').then(d=>setRows(d.requests||d||[])).catch(console.error);
  useEffect(()=>{load();},[]);

  const save=async e=>{e.preventDefault();await api('/services/requests',{method:'POST',body:JSON.stringify(f)});setShowForm(false);setF({title:'',category:'Water Supply',description:'',priority:'medium',location:''});load();};

  const filtered=rows.filter(r=>{
    if(filterStatus && r.status!==filterStatus) return false;
    if(search){const q=search.toLowerCase();return (r.title||'').toLowerCase().includes(q)||(r.category||'').toLowerCase().includes(q);}
    return true;
  });

  return <>
    <div className="page-title row">
      <div><h1>Service Requests</h1><p>{rows.length} total requests</p></div>
      <button onClick={()=>setShowForm(!showForm)}><ClipboardPlus size={16} style={{marginRight:6}}/>New Request</button>
    </div>

    {showForm && <form className="glass-card" onSubmit={save} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
      <div className="form-group"><label className="form-label">Title *</label><input required placeholder="Request title" value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></div>
      <div className="form-group"><label className="form-label">Category</label><select value={f.category} onChange={e=>setF({...f,category:e.target.value})}>{['Water Supply','Road Repair','Sanitation','Electricity','Other'].map(x=><option key={x}>{x}</option>)}</select></div>
      <div className="form-group"><label className="form-label">Priority</label><select value={f.priority} onChange={e=>setF({...f,priority:e.target.value})}>{['low','medium','high','urgent'].map(x=><option key={x} value={x}>{x}</option>)}</select></div>
      <div className="form-group"><label className="form-label">Location</label><input placeholder="Location" value={f.location} onChange={e=>setF({...f,location:e.target.value})}/></div>
      <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Description *</label><textarea required placeholder="Describe the issue..." value={f.description} onChange={e=>setF({...f,description:e.target.value})}/></div>
      <div style={{gridColumn:'1/-1',display:'flex',gap:10}}><button type="submit">Submit Request</button><button type="button" className="btn-outline" onClick={()=>setShowForm(false)}>Cancel</button></div>
    </form>}

    <div className="panel table-wrap">
      <div className="table-toolbar">
        <div className="table-search"><Search size={16}/><input placeholder="Search requests..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <div className="table-filters">
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}><option value="">All Statuses</option>{['submitted','under_review','in_progress','completed','rejected'].map(x=><option key={x} value={x}>{x.replace(/_/g,' ')}</option>)}</select>
        </div>
      </div>
      <table><thead><tr><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>{filtered.map(x=><tr key={x._id} style={{cursor:'pointer'}} onClick={()=>nav(`/services/${x._id}`)}>
          <td><strong>{x.title}</strong></td><td>{x.category}</td><td><PBadge p={x.priority}/></td><td><Badge status={x.status}/></td><td>{new Date(x.createdAt).toLocaleDateString()}</td>
        </tr>)}</tbody>
      </table>
      {!filtered.length&&<p className="empty">No service requests found.</p>}
    </div>
  </>;
}
