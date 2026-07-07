import {useEffect,useState} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {api} from '../api';
import {useAuth} from '../context/AuthContext';
import {ArrowLeft,Edit3,User,Phone,MapPin,Briefcase,GraduationCap,CreditCard} from 'lucide-react';

function DetailRow({label,value,icon:Icon}){
  return <div className="detail-row" style={{justifyContent:'flex-start',gap:16}}>
    {Icon&&<div style={{color:'#64748b'}}><Icon size={18}/></div>}
    <div style={{flex:1}}><div className="detail-label">{label}</div><div className="detail-value" style={{textAlign:'left'}}>{value||'—'}</div></div>
  </div>;
}

export default function CitizenProfile(){
  const {id}=useParams();
  const {user}=useAuth();
  const nav=useNavigate();
  const [c,setC]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [f,setF]=useState({});

  const load=()=>api(`/citizens/${id}`).then(d=>{setC(d);setF(d);}).catch(console.error);
  useEffect(()=>{load();},[id]);

  const doUpdate=async()=>{
    await api(`/citizens/${id}`,{method:'PUT',body:JSON.stringify(f)});
    setShowModal(false);load();
  };

  if(!c) return <p>Loading...</p>;

  return <>
    <div className="page-title row">
      <div><h1>{c.name}</h1><p>Citizen Profile</p></div>
      <div className="page-actions">
        <button className="btn-outline" onClick={()=>nav('/citizens')}><ArrowLeft size={16}/> Back</button>
        {user?.role==='admin'&&<button onClick={()=>setShowModal(true)}><Edit3 size={16}/> Edit Profile</button>}
      </div>
    </div>

    <div className="detail-grid">
      <div className="glass-card">
        <h3 className="detail-section-title">Personal Information</h3>
        <DetailRow icon={User} label="Full Name" value={c.name}/>
        <DetailRow icon={User} label="Father's Name" value={c.fatherName}/>
        <DetailRow icon={User} label="Gender" value={c.gender}/>
        <DetailRow icon={User} label="Date of Birth" value={c.dob?new Date(c.dob).toLocaleDateString():'—'}/>
        <DetailRow icon={CreditCard} label="Aadhar Number" value={c.aadhar_no}/>
        <DetailRow icon={User} label="Caste Category" value={c.caste_category}/>
      </div>
      
      <div>
        <div className="glass-card" style={{marginBottom:24}}>
          <h3 className="detail-section-title">Contact & Address</h3>
          <DetailRow icon={Phone} label="Phone Number" value={c.phone}/>
          <DetailRow icon={MapPin} label="Address" value={c.address}/>
        </div>
        
        <div className="glass-card">
          <h3 className="detail-section-title">Additional Details</h3>
          <DetailRow icon={GraduationCap} label="Education" value={c.education}/>
          <DetailRow icon={Briefcase} label="Occupation" value={c.occupation}/>
          <DetailRow label="Registered On" value={new Date(c.createdAt).toLocaleDateString()}/>
        </div>
      </div>
    </div>

    {showModal&&<div className="modal-overlay" onClick={()=>setShowModal(false)}>
      <div className="modal-content" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Edit Profile</div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Name</label><input value={f.name||''} onChange={e=>setF({...f,name:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Father's Name</label><input value={f.fatherName||''} onChange={e=>setF({...f,fatherName:e.target.value})}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Phone</label><input value={f.phone||''} onChange={e=>setF({...f,phone:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Occupation</label><input value={f.occupation||''} onChange={e=>setF({...f,occupation:e.target.value})}/></div>
        </div>
        <div className="form-group"><label className="form-label">Address</label><textarea value={f.address||''} onChange={e=>setF({...f,address:e.target.value})} rows={2}/></div>
        <div className="modal-actions"><button className="btn-outline" onClick={()=>setShowModal(false)}>Cancel</button><button onClick={doUpdate}>Save Changes</button></div>
      </div>
    </div>}
  </>;
}
