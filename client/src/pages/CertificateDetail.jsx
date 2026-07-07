import {useEffect,useState} from 'react';
import {useParams,useNavigate,Link} from 'react-router-dom';
import {api} from '../api';
import {useAuth} from '../context/AuthContext';
import {ArrowLeft,Edit3,Printer} from 'lucide-react';

function Badge({status}){
  const m={requested:'badge-blue',processing:'badge-yellow',approved:'badge-green',issued:'badge-green',rejected:'badge-red'};
  return <span className={`badge ${m[status]||'badge-gray'}`}>{status}</span>;
}
function DetailRow({label,value}){return <div className="detail-row"><span className="detail-label">{label}</span><span className="detail-value">{value||'—'}</span></div>;}

export default function CertificateDetail(){
  const {id}=useParams();
  const {user}=useAuth();
  const nav=useNavigate();
  const [cert,setCert]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [mf,setMf]=useState({status:'',admin_notes:''});

  useEffect(()=>{api(`/certificates/${id}`).then(d=>{setCert(d);setMf({status:d.status,admin_notes:d.admin_notes||''});}).catch(console.error);},[id]);

  const doUpdate=async()=>{
    await api(`/certificates/${id}`,{method:'PUT',body:JSON.stringify(mf)});
    setShowModal(false);
    api(`/certificates/${id}`).then(setCert);
  };

  if(!cert) return <p>Loading...</p>;
  const history=cert.status_history||[];

  return <>
    <div className="page-title row">
      <div><h1>{cert.certificateNumber||'Certificate'}</h1><p style={{textTransform:'capitalize'}}>{cert.cert_type||cert.type} Certificate · <Badge status={cert.status}/></p></div>
      <div className="page-actions">
        <button className="btn-outline" onClick={()=>nav('/certificates')}><ArrowLeft size={16}/> Back</button>
        {cert.status==='issued'&&<Link to={`/certificates/${id}/preview`}><button className="btn-outline"><Printer size={16}/> Preview</button></Link>}
        {user?.role==='admin'&&<button onClick={()=>setShowModal(true)}><Edit3 size={16}/> Process</button>}
      </div>
    </div>
    <div className="detail-grid">
      <div className="glass-card">
        <h3 className="detail-section-title">Certificate Details</h3>
        <DetailRow label="Certificate ID" value={cert.certificateNumber}/>
        <DetailRow label="Type" value={<span style={{textTransform:'capitalize'}}>{cert.cert_type||cert.type}</span>}/>
        <DetailRow label="Status" value={<Badge status={cert.status}/>}/>
        <DetailRow label="Purpose" value={cert.purpose}/>
        <DetailRow label="Applicant" value={cert.citizen_name||cert.applicantName||cert.user?.name}/>
        <DetailRow label="Admin Notes" value={cert.admin_notes}/>
        <DetailRow label="Requested" value={new Date(cert.createdAt).toLocaleString()}/>
        <DetailRow label="Issue Date" value={cert.issue_date?new Date(cert.issue_date).toLocaleString():'Not yet issued'}/>
        {cert.additional_data&&Object.entries(cert.additional_data).map(([k,v])=>v?<DetailRow key={k} label={k.replace(/_/g,' ')} value={v}/>:null)}
      </div>
      <div className="glass-card">
        <h3 className="detail-section-title">Status Timeline</h3>
        <div className="timeline">
          {history.map((h,i)=>{
            const isLast=i===history.length-1;
            const cls=h.status==='issued'?'completed':(h.status==='rejected'?'rejected':(isLast?'active':'completed'));
            return <div className={`timeline-item ${cls}`} key={i}>
              <div className="timeline-dot"/><div className="timeline-content">
                <div className="timeline-title">{h.status}</div><div className="timeline-text">{h.note||''}</div>
                <div className="timeline-time">{new Date(h.changed_at).toLocaleString()} · by {h.changed_by}</div>
              </div>
            </div>;
          })}
        </div>
      </div>
    </div>

    {showModal&&<div className="modal-overlay" onClick={()=>setShowModal(false)}>
      <div className="modal-content" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Process Certificate</div>
        <div className="form-group"><label className="form-label">Status</label>
          <select value={mf.status} onChange={e=>setMf({...mf,status:e.target.value})}>{['requested','processing','approved','issued','rejected'].map(x=><option key={x} value={x}>{x}</option>)}</select>
        </div>
        <div className="form-group"><label className="form-label">Admin Notes</label><textarea value={mf.admin_notes} onChange={e=>setMf({...mf,admin_notes:e.target.value})} rows={3}/></div>
        <div className="modal-actions"><button className="btn-outline" onClick={()=>setShowModal(false)}>Cancel</button><button onClick={doUpdate}>Update</button></div>
      </div>
    </div>}
  </>;
}
