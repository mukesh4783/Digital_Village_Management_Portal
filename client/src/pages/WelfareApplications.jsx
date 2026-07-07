import {useEffect,useState} from 'react';
import {api} from '../api';
import {useAuth} from '../context/AuthContext';
import {Link} from 'react-router-dom';
import {Plus,Edit3} from 'lucide-react';

function Badge({status}){
  const m={applied:'badge-blue',under_review:'badge-yellow',verified:'badge-purple',approved:'badge-green',rejected:'badge-red',disbursed:'badge-green'};
  return <span className={`badge ${m[status]||'badge-gray'}`}>{(status||'').replace(/_/g,' ')}</span>;
}

export default function WelfareApplications(){
  const {user}=useAuth();
  const [apps,setApps]=useState([]);
  const [showModal,setShowModal]=useState(false);
  const [selected,setSelected]=useState(null);
  const [mf,setMf]=useState({status:'',remarks:''});

  const load=()=>api('/welfare/applications').then(d=>setApps(d.applications||d||[])).catch(console.error);
  useEffect(()=>{load();},[]);

  const openUpdate=(app)=>{setSelected(app);setMf({status:app.status,remarks:app.remarks||''});setShowModal(true);};
  const doUpdate=async()=>{
    await api(`/welfare/applications/${selected._id}`,{method:'PUT',body:JSON.stringify(mf)});
    setShowModal(false);load();
  };

  return <>
    <div className="page-title row">
      <div><h1>Welfare Applications</h1><p>{apps.length} applications</p></div>
      <Link to="/welfare"><button><Plus size={16}/> New Application</button></Link>
    </div>

    <div className="panel table-wrap">
      <table><thead><tr><th>Scheme</th><th>Applicant</th><th>Status</th><th>Reason</th><th>Date</th>{user?.role==='admin'&&<th>Actions</th>}</tr></thead>
        <tbody>{apps.map(a=><tr key={a._id}>
          <td><strong>{a.scheme_name||a.scheme?.name||'—'}</strong></td>
          <td>{a.citizen_name||a.user?.name||'—'}</td>
          <td><Badge status={a.status}/></td>
          <td style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.reason||'—'}</td>
          <td>{new Date(a.createdAt).toLocaleDateString()}</td>
          {user?.role==='admin'&&<td><button className="btn-ghost" onClick={()=>openUpdate(a)}><Edit3 size={14}/></button></td>}
        </tr>)}</tbody>
      </table>
      {!apps.length&&<p className="empty">No applications found.</p>}
    </div>

    {showModal && <div className="modal-overlay" onClick={()=>setShowModal(false)}>
      <div className="modal-content" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Update Application</div>
        <div className="form-group"><label className="form-label">Status</label>
          <select value={mf.status} onChange={e=>setMf({...mf,status:e.target.value})}>{['applied','under_review','verified','approved','rejected','disbursed'].map(x=><option key={x} value={x}>{x.replace(/_/g,' ')}</option>)}</select>
        </div>
        <div className="form-group"><label className="form-label">Remarks</label><textarea value={mf.remarks} onChange={e=>setMf({...mf,remarks:e.target.value})} rows={3}/></div>
        <div className="modal-actions"><button className="btn-outline" onClick={()=>setShowModal(false)}>Cancel</button><button onClick={doUpdate}>Update</button></div>
      </div>
    </div>}
  </>;
}
