import {useEffect,useState} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {api} from '../api';
import {ArrowLeft,Printer} from 'lucide-react';

function cap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):'';}
function fmtDate(d){return d?new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}):'—';}

export default function CertificatePreview(){
  const {id}=useParams();
  const nav=useNavigate();
  const [cert,setCert]=useState(null);

  useEffect(()=>{api(`/certificates/${id}/preview`).then(setCert).catch(console.error);},[id]);

  if(!cert) return <p>Loading...</p>;
  const citizen=cert.citizen||{};
  const settings=cert.village_settings||{};
  const addr=citizen.address||{};
  const addl=cert.additional_data||{};
  const type=cap(cert.cert_type||cert.type||'');

  let body='';
  switch(cert.cert_type||cert.type){
    case 'birth':body=`This is to certify that <strong>${citizen.name||cert.citizen_name||cert.applicantName||''}</strong>, born on <strong>${fmtDate(citizen.date_of_birth||citizen.dob)}</strong>${addl.father_name?`, son/daughter of <strong>${addl.father_name}</strong>`:''}${addl.mother_name?` and <strong>${addl.mother_name}</strong>`:''}, at <strong>${addl.place_of_birth||addr.village||''}</strong>, is a registered citizen of this village.`;break;
    case 'income':body=`This is to certify that <strong>${citizen.name||cert.citizen_name||''}</strong>, resident of ${addr.village||''}, ${addr.district||''}, has an annual income of <strong>₹${addl.annual_income||'—'}</strong> from all sources. This certificate is issued for the purpose of ${cert.purpose||'—'}.`;break;
    case 'caste':body=`This is to certify that <strong>${citizen.name||cert.citizen_name||''}</strong>, resident of ${addr.village||''}, ${addr.district||''}, ${addr.state||''}, belongs to the <strong>${citizen.caste_category||'—'}</strong> category.`;break;
    case 'residence':body=`This is to certify that <strong>${citizen.name||cert.citizen_name||''}</strong> is a permanent resident of ${addr.door_no||''} ${addr.street||''}, ${addr.village||''}, ${addr.taluk||''}, ${addr.district||''}, ${addr.state||''} — ${addr.pincode||''}. This certificate is issued for the purpose of ${cert.purpose||'—'}.`;break;
    default:body=`This is to certify that <strong>${citizen.name||cert.citizen_name||cert.applicantName||''}</strong>, resident of ${addr.village||''}, is known to this office. This ${type} certificate is issued for the purpose of <strong>${cert.purpose||'—'}</strong>.`;
  }

  return <>
    <div className="page-title row no-print">
      <div><h1>Certificate Preview</h1><p>{cert.certificateNumber} — {type} Certificate</p></div>
      <div className="page-actions">
        <button className="btn-outline" onClick={()=>nav(`/certificates/${id}`)}><ArrowLeft size={16}/> Back</button>
        <button onClick={()=>window.print()}><Printer size={16}/> Print</button>
      </div>
    </div>
    <div className="certificate-preview">
      <div className="certificate-header">
        <div style={{fontSize:14,letterSpacing:1}}>GRAM PANCHAYAT</div>
        <div style={{fontSize:28,fontWeight:800,margin:'8px 0'}}>{settings.village_name||'Sundarpur'}</div>
        <div style={{fontSize:13,color:'#666'}}>District: {settings.district||'Gorakhpur'} · State: {settings.state||'Uttar Pradesh'} · Pin: {settings.pincode||'273152'}</div>
        <h2 className="certificate-title" style={{marginTop:24}}>{type} Certificate</h2>
        <div style={{fontSize:13,color:'#888',marginTop:4}}>Certificate No: {cert.certificateNumber}</div>
      </div>
      <div className="certificate-body">
        <p style={{marginBottom:16}}>Date: {fmtDate(cert.issue_date||cert.createdAt)}</p>
        <p style={{textAlign:'justify'}} dangerouslySetInnerHTML={{__html:body}}/>
        <p style={{marginTop:20}}>This certificate is issued upon the request of the above-named person for the purpose of <strong>{cert.purpose||'—'}</strong>.</p>
      </div>
      <div className="certificate-footer">
        <div className="certificate-signature"><div className="certificate-signature-line">Village Seal</div></div>
        <div className="certificate-signature"><div className="certificate-signature-line">Sarpanch / Village Head<br/>{settings.village_name||'Sundarpur'} Gram Panchayat</div></div>
      </div>
    </div>
  </>;
}
