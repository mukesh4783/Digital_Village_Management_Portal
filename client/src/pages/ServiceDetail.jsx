import {useEffect,useState} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {api} from '../api';
import {useAuth} from '../context/AuthContext';
import {ArrowLeft,Edit3} from 'lucide-react';

function Badge({status}){
  const m={submitted:'badge-blue',under_review:'badge-yellow',in_progress:'badge-yellow',completed:'badge-green',resolved:'badge-green',rejected:'badge-red',pending:'badge-yellow'};
  return <span className={`badge ${m[status]||'badge-gray'}`}>{(status||'').replace(/_/g,' ')}</span>;
}

function DetailRow({label,value}){return <div className="detail-row"><span className="detail-label">{label}</span><span className="detail-value">{value||'—'}</span></div>;}

export default function ServiceDetail(){
  const {id}=useParams();
  const {user}=useAuth();
  const nav=useNavigate();
  const [req,setReq]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [mf,setMf]=useState({status:'',assigned_to:'',status_note:''});

  useEffect(()=>{api(`/services/requests/${id}`).then(d=>{setReq(d);setMf({status:d.status,assigned_to:d.assigned_to||'',status_note:''});}).catch(console.error);},[id]);

  const updateStatus=async()=>{
    await api(`/services/requests/${id}`,{method:'PUT',body:JSON.stringify(mf)});
    setShowModal(false);
    api(`/services/requests/${id}`).then(setReq);
  };

  if(!req) return <p>Loading...</p>;
  const history=req.status_history||[];

  return <>
    <div className="page-title row">
      <div><h1>{req.title}</h1><p>{req.category} · <Badge status={req.status}/></p></div>
      <div className="page-actions">
        <button className="btn-outline" onClick={()=>nav('/services')}><ArrowLeft size={16}/> Back</button>
        {user?.role==='admin'&&<button onClick={()=>setShowModal(true)}><Edit3 size={16}/> Update Status</button>}
      </div>
    </div>

    <div className="detail-grid">
      <div>
        <div className="glass-card">
          <h3 className="detail-section-title">Request Details</h3>
          <DetailRow label="Category" value={req.category}/>
          <DetailRow label="Priority" value={req.priority}/>
          <DetailRow label="Status" value={<Badge status={req.status}/>}/>
          <DetailRow label="Description" value={req.description}/>
          <DetailRow label="Location" value={req.location}/>
          <DetailRow label="Submitted By" value={req.user?.name}/>
          <DetailRow label="Assigned To" value={req.assigned_to||'Unassigned'}/>
          <DetailRow label="Admin Notes" value={req.admin_notes}/>
          <DetailRow label="Submitted" value={new Date(req.createdAt).toLocaleString()}/>
          <DetailRow label="Last Updated" value={new Date(req.updatedAt).toLocaleString()}/>
        </div>
      </div>
      <div>
        <div className="glass-card">
          <h3 className="detail-section-title">Status Timeline</h3>
          <div className="timeline">
            {history.map((h,i)=>{
              const isLast=i===history.length-1;
              const cls=h.status==='completed'?'completed':(h.status==='rejected'?'rejected':(isLast?'active':'completed'));
              return <div className={`timeline-item ${cls}`} key={i}>
                <div className="timeline-dot"/>
                <div className="timeline-content">
                  <div className="timeline-title">{(h.status||'').replace(/_/g,' ')}</div>
                  <div className="timeline-text">{h.note||''}</div>
                  <div className="timeline-time">{new Date(h.changed_at).toLocaleString()} · by {h.changed_by}</div>
                </div>
              </div>;
            })}
            {!history.length&&<p className="empty">No status history available.</p>}
          </div>
        </div>
      </div>
    </div>

    {showModal && <div className="modal-overlay" onClick={()=>setShowModal(false)}>
      <div className="modal-content" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Update Request Status</div>
        <div className="form-group"><label className="form-label">Status</label>
          <select value={mf.status} onChange={e=>setMf({...mf,status:e.target.value})}>{['submitted','under_review','in_progress','completed','rejected'].map(x=><option key={x} value={x}>{x.replace(/_/g,' ')}</option>)}</select>
        </div>
        <div className="form-group"><label className="form-label">Assigned To</label><input value={mf.assigned_to} onChange={e=>setMf({...mf,assigned_to:e.target.value})} placeholder="Staff name"/></div>
        <div className="form-group"><label className="form-label">Note</label><textarea value={mf.status_note} onChange={e=>setMf({...mf,status_note:e.target.value})} placeholder="Add a note..." rows={3}/></div>
        <div className="modal-actions"><button className="btn-outline" onClick={()=>setShowModal(false)}>Cancel</button><button onClick={updateStatus}>Update</button></div>
      </div>
    </div>}
  </>;
}
