import {useEffect,useState} from 'react';
import {api} from '../api';
import {Link,useNavigate} from 'react-router-dom';
import {FilePlus,Eye} from 'lucide-react';

function Badge({status}){
  const m={requested:'badge-blue',processing:'badge-yellow',approved:'badge-green',issued:'badge-green',rejected:'badge-red',pending:'badge-yellow'};
  return <span className={`badge ${m[status]||'badge-gray'}`}>{status}</span>;
}

export default function Certificates(){
  const nav=useNavigate();
  const [certs,setCerts]=useState([]);
  const load=()=>api('/certificates').then(d=>setCerts(d.certificates||d||[])).catch(console.error);
  useEffect(()=>{load();},[]);

  return <>
    <div className="page-title row">
      <div><h1>Certificates</h1><p>{certs.length} requests</p></div>
      <Link to="/certificates/new"><button><FilePlus size={16}/> Request Certificate</button></Link>
    </div>
    <div className="panel table-wrap">
      <table><thead><tr><th>ID</th><th>Type</th><th>Applicant</th><th>Purpose</th><th>Status</th><th>Requested</th><th>Issued</th><th></th></tr></thead>
        <tbody>{certs.map(c=><tr key={c._id}>
          <td>{c.certificateNumber||'—'}</td>
          <td style={{textTransform:'capitalize'}}>{c.cert_type||c.type||'—'}</td>
          <td>{c.citizen_name||c.applicantName||c.user?.name||'—'}</td>
          <td>{c.purpose||'—'}</td>
          <td><Badge status={c.status}/></td>
          <td>{new Date(c.createdAt).toLocaleDateString()}</td>
          <td>{c.issue_date?new Date(c.issue_date).toLocaleDateString():'—'}</td>
          <td><button className="btn-ghost" onClick={()=>nav(`/certificates/${c._id}`)}><Eye size={14}/></button></td>
        </tr>)}</tbody>
      </table>
      {!certs.length&&<p className="empty">No certificates found.</p>}
    </div>
  </>;
}
