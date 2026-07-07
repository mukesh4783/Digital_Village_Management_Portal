import {useEffect,useState} from 'react';
import {api} from '../api';
import {Link} from 'react-router-dom';
import {Search,List} from 'lucide-react';

function Badge({status}){
  const m={active:'badge-green',inactive:'badge-gray',closed:'badge-red'};
  return <span className={`badge ${m[status]||'badge-gray'}`}>{status}</span>;
}

export default function Welfare(){
  const [schemes,setSchemes]=useState([]);
  const [search,setSearch]=useState('');

  useEffect(()=>{api('/welfare/schemes').then(d=>setSchemes(d.schemes||d||[])).catch(console.error);},[]);

  const filtered=schemes.filter(s=>{
    if(!search) return true;
    const q=search.toLowerCase();
    return s.name?.toLowerCase().includes(q)||s.department?.toLowerCase().includes(q);
  });

  return <>
    <div className="page-title row">
      <div><h1>Welfare Schemes</h1><p>{schemes.length} schemes available</p></div>
      <div className="page-actions">
        <Link to="/welfare/applications"><button className="btn-outline"><List size={16}/> My Applications</button></Link>
      </div>
    </div>

    <div style={{marginBottom:24,display:'flex',gap:12}}>
      <div className="table-search" style={{maxWidth:300}}><Search size={16}/><input placeholder="Search schemes..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
    </div>

    <div className="scheme-grid">
      {filtered.map(s=><div className="scheme-card" key={s._id}>
        <div className="scheme-card-header">
          <div><div className="scheme-card-title">{s.name}</div><div className="scheme-card-dept">{s.department||''}</div></div>
          <Badge status={s.status||'active'}/>
        </div>
        <div className="scheme-card-desc">{s.description||''}</div>
        <p style={{fontSize:12,color:'#64748b',marginBottom:12}}><strong>Eligibility:</strong> {s.eligibility||'—'}</p>
        <div className="scheme-card-footer">
          <span className="scheme-benefit">{s.benefit_amount?`₹${s.benefit_amount.toLocaleString()}`:(s.benefit||'Free')}</span>
          {(s.status||'active')==='active'&&<Link to={`/welfare/apply/${s._id}`}><button className="btn-sm">Apply</button></Link>}
        </div>
      </div>)}
      {!filtered.length&&<div className="panel">No schemes found.</div>}
    </div>
  </>;
}
