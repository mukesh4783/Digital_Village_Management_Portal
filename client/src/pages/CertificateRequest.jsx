import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {api} from '../api';

export default function CertificateRequest(){
  const nav=useNavigate();
  const [f,setF]=useState({cert_type:'birth',purpose:'',additional_data:{}});
  const [msg,setMsg]=useState('');

  const submit=async e=>{
    e.preventDefault();
    try{
      const result=await api('/certificates',{method:'POST',body:JSON.stringify(f)});
      setMsg(`Certificate requested: ${result.certificateNumber}`);
      setTimeout(()=>nav('/certificates'),1500);
    }catch(err){setMsg(err.message);}
  };

  const addlFields={
    birth:[{key:'father_name',label:'Father Name'},{key:'mother_name',label:'Mother Name'},{key:'place_of_birth',label:'Place of Birth'}],
    income:[{key:'annual_income',label:'Annual Income (₹)'},{key:'source_of_income',label:'Source of Income'}],
    caste:[],
    residence:[{key:'years_of_residence',label:'Years of Residence'}]
  };

  return <>
    <div className="page-title"><h1>Request Certificate</h1><p>Submit a new certificate application</p></div>
    <div className="glass-card" style={{maxWidth:600}}>
      <form onSubmit={submit}>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Certificate Type *</label>
            <select value={f.cert_type} onChange={e=>setF({...f,cert_type:e.target.value,additional_data:{}})}>
              <option value="birth">Birth Certificate</option><option value="income">Income Certificate</option>
              <option value="caste">Caste Certificate</option><option value="residence">Residence Certificate</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">Purpose *</label><input required value={f.purpose} onChange={e=>setF({...f,purpose:e.target.value})} placeholder="e.g., School admission, Government job"/></div>
        </div>
        {(addlFields[f.cert_type]||[]).map(af=><div className="form-group" key={af.key}>
          <label className="form-label">{af.label}</label>
          <input value={f.additional_data[af.key]||''} onChange={e=>setF({...f,additional_data:{...f.additional_data,[af.key]:e.target.value}})} placeholder={af.label}/>
        </div>)}
        {msg&&<div className={msg.includes('requested')?'success':'error'}>{msg}</div>}
        <div style={{display:'flex',gap:10,marginTop:16}}><button type="submit">Submit Request</button><button type="button" className="btn-outline" onClick={()=>nav('/certificates')}>Cancel</button></div>
      </form>
    </div>
  </>;
}
