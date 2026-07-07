import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {api} from '../api';
import {ArrowLeft} from 'lucide-react';

export default function CitizenRegister(){
  const nav=useNavigate();
  const [step,setStep]=useState(1);
  const [f,setF]=useState({name:'',fatherName:'',gender:'Male',dob:'',phone:'',address:'',occupation:'',aadhar_no:'',caste_category:'General',education:''});
  const [msg,setMsg]=useState('');

  const submit=async e=>{
    e.preventDefault();
    try{
      await api('/citizens',{method:'POST',body:JSON.stringify(f)});
      setMsg('Citizen registered successfully!');
      setTimeout(()=>nav('/citizens'),1500);
    }catch(err){setMsg(err.message);}
  };

  const steps=[
    {num:1,label:'Personal'},
    {num:2,label:'Contact'},
    {num:3,label:'Additional'},
    {num:4,label:'Review'}
  ];

  return <>
    <div className="page-title row">
      <div><h1>Register Citizen</h1><p>Add a new citizen record</p></div>
      <button className="btn-outline" onClick={()=>nav('/citizens')}><ArrowLeft size={16}/> Back</button>
    </div>

    <div className="glass-card" style={{maxWidth:700,margin:'0 auto'}}>
      <div className="stepper">
        {steps.map((s,i)=><>
          <div className={`stepper-step ${step===s.num?'active':(step>s.num?'completed':'')}`} key={s.num}>
            <div className="stepper-circle">{s.num}</div>
            <div className="stepper-label">{s.label}</div>
          </div>
          {i<steps.length-1&&<div className={`stepper-line ${step>s.num?'completed':''}`}/>}
        </>)}
      </div>

      <form onSubmit={step===4?submit:e=>{e.preventDefault();setStep(step+1);}}>
        {step===1 && <>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Full Name *</label><input required value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Father's Name *</label><input required value={f.fatherName} onChange={e=>setF({...f,fatherName:e.target.value})}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Gender *</label><select value={f.gender} onChange={e=>setF({...f,gender:e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div className="form-group"><label className="form-label">Date of Birth</label><input type="date" value={f.dob} onChange={e=>setF({...f,dob:e.target.value})}/></div>
          </div>
        </>}

        {step===2 && <>
          <div className="form-group"><label className="form-label">Phone Number *</label><input required value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Address *</label><textarea required value={f.address} onChange={e=>setF({...f,address:e.target.value})} rows={3}/></div>
        </>}

        {step===3 && <>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Aadhar Number</label><input value={f.aadhar_no} onChange={e=>setF({...f,aadhar_no:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Caste Category</label><select value={f.caste_category} onChange={e=>setF({...f,caste_category:e.target.value})}><option>General</option><option>OBC</option><option>SC</option><option>ST</option></select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Education</label><input value={f.education} onChange={e=>setF({...f,education:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Occupation</label><input value={f.occupation} onChange={e=>setF({...f,occupation:e.target.value})}/></div>
          </div>
        </>}

        {step===4 && <>
          <h3 style={{marginBottom:16}}>Review Information</h3>
          <div className="detail-grid" style={{background:'#f8faf9',padding:20,borderRadius:12,marginBottom:20}}>
            <div>
              <div style={{fontSize:12,color:'#64748b'}}>Full Name</div><div style={{fontWeight:500,marginBottom:12}}>{f.name}</div>
              <div style={{fontSize:12,color:'#64748b'}}>Gender</div><div style={{fontWeight:500,marginBottom:12}}>{f.gender}</div>
              <div style={{fontSize:12,color:'#64748b'}}>Phone</div><div style={{fontWeight:500,marginBottom:12}}>{f.phone}</div>
              <div style={{fontSize:12,color:'#64748b'}}>Aadhar No</div><div style={{fontWeight:500,marginBottom:12}}>{f.aadhar_no||'—'}</div>
            </div>
            <div>
              <div style={{fontSize:12,color:'#64748b'}}>Father's Name</div><div style={{fontWeight:500,marginBottom:12}}>{f.fatherName}</div>
              <div style={{fontSize:12,color:'#64748b'}}>Date of Birth</div><div style={{fontWeight:500,marginBottom:12}}>{f.dob||'—'}</div>
              <div style={{fontSize:12,color:'#64748b'}}>Address</div><div style={{fontWeight:500,marginBottom:12}}>{f.address}</div>
              <div style={{fontSize:12,color:'#64748b'}}>Category / Job</div><div style={{fontWeight:500,marginBottom:12}}>{f.caste_category} / {f.occupation||'—'}</div>
            </div>
          </div>
        </>}

        {msg&&<div className={msg.includes('success')?'success':'error'}>{msg}</div>}
        
        <div style={{display:'flex',justifyContent:'space-between',marginTop:24,borderTop:'1px solid #f1f5f9',paddingTop:20}}>
          <button type="button" className="btn-outline" onClick={()=>step>1?setStep(step-1):nav('/citizens')} disabled={msg.includes('success')}>
            {step===1?'Cancel':'Back'}
          </button>
          <button type="submit" disabled={msg.includes('success')}>
            {step===4?'Complete Registration':'Next'}
          </button>
        </div>
      </form>
    </div>
  </>;
}
