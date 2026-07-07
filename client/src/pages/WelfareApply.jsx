import {useEffect,useState} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {api} from '../api';

export default function WelfareApply(){
  const {id}=useParams();
  const nav=useNavigate();
  const [scheme,setScheme]=useState(null);
  const [reason,setReason]=useState('');
  const [msg,setMsg]=useState('');

  useEffect(()=>{if(id) api(`/welfare/schemes/${id}`).then(setScheme).catch(console.error);},[id]);

  const submit=async e=>{
    e.preventDefault();
    try{
      await api('/welfare/applications',{method:'POST',body:JSON.stringify({scheme_id:id,reason})});
      setMsg('Application submitted successfully!');
      setTimeout(()=>nav('/welfare/applications'),1500);
    }catch(err){setMsg(err.message);}
  };

  return <>
    <div className="page-title"><h1>Apply for Welfare Scheme</h1><p>{scheme?.name||'Loading...'}</p></div>
    {scheme && <div className="glass-card" style={{maxWidth:600}}>
      <h3 style={{marginBottom:8}}>{scheme.name}</h3>
      <p style={{color:'#64748b',marginBottom:4}}>{scheme.description}</p>
      <p style={{fontSize:13,marginBottom:16}}><strong>Eligibility:</strong> {scheme.eligibility||'—'}</p>
      <form onSubmit={submit}>
        <div className="form-group"><label className="form-label">Reason for Application *</label><textarea required value={reason} onChange={e=>setReason(e.target.value)} placeholder="Explain why you are applying..." rows={4}/></div>
        {msg&&<div className={msg.includes('success')?'success':'error'}>{msg}</div>}
        <div style={{display:'flex',gap:10}}><button type="submit">Submit Application</button><button type="button" className="btn-outline" onClick={()=>nav('/welfare')}>Cancel</button></div>
      </form>
    </div>}
  </>;
}
