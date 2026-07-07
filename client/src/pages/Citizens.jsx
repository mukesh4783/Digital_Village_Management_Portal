import {useEffect,useState} from 'react';
import {api} from '../api';
import {useAuth} from '../context/AuthContext';
import {Link,useNavigate} from 'react-router-dom';
import {Search,UserPlus,Eye,Download} from 'lucide-react';

export default function Citizens(){
  const nav=useNavigate();
  const [citizens,setCitizens]=useState([]);
  const [search,setSearch]=useState('');
  const [genderFilter,setGenderFilter]=useState('');

  useEffect(()=>{api('/citizens').then(d=>setCitizens(Array.isArray(d)?d:[])).catch(console.error);},[]);

  const filtered=citizens.filter(c=>{
    if(genderFilter && c.gender!==genderFilter) return false;
    if(search){
      const q=search.toLowerCase();
      return (c.name||'').toLowerCase().includes(q)||(c.phone||'').includes(q)||(c.address||'').toLowerCase().includes(q);
    }
    return true;
  });

  const exportCSV=()=>{
    const csv=['Name,Father Name,Gender,Phone,Address,Occupation'].concat(filtered.map(c=>`"${c.name}","${c.fatherName}","${c.gender}","${c.phone}","${c.address}","${c.occupation}"`)).join('\n');
    const blob=new Blob([csv],{type:'text/csv'});
    const url=window.URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='citizens.csv';a.click();
  };

  return <>
    <div className="page-title row">
      <div><h1>Citizens</h1><p>{citizens.length} registered citizens</p></div>
      <div className="page-actions">
        <button className="btn-outline" onClick={exportCSV}><Download size={16}/> Export</button>
        <Link to="/citizens/register"><button><UserPlus size={16}/> Register Citizen</button></Link>
      </div>
    </div>

    <div className="panel table-wrap">
      <div className="table-toolbar">
        <div className="table-search"><Search size={16}/><input placeholder="Search name, phone, address..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <div className="table-filters">
          <select value={genderFilter} onChange={e=>setGenderFilter(e.target.value)}>
            <option value="">All Genders</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
          </select>
        </div>
      </div>
      <table><thead><tr><th>Name</th><th>Father's Name</th><th>Gender</th><th>Phone</th><th>Occupation</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map(c=><tr key={c._id}>
          <td><strong>{c.name}</strong></td>
          <td>{c.fatherName}</td>
          <td>{c.gender}</td>
          <td>{c.phone}</td>
          <td>{c.occupation||'—'}</td>
          <td><button className="btn-ghost" onClick={()=>nav(`/citizens/${c._id}`)}><Eye size={14}/></button></td>
        </tr>)}</tbody>
      </table>
      {!filtered.length&&<p className="empty">No citizens found.</p>}
    </div>
  </>;
}
