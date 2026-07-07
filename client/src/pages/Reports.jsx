import {useEffect,useState} from 'react';
import {api} from '../api';
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,ArcElement,Title,Tooltip,Legend} from 'chart.js';
import {Bar,Doughnut} from 'react-chartjs-2';
ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,Title,Tooltip,Legend);

const colors=['#16734a','#0d9488','#2563eb','#d97706','#dc2626','#6b21a8','#0891b2','#be185d'];

export default function Reports(){
  const [summary,setSummary]=useState(null);
  const [serviceData,setServiceData]=useState(null);
  const [welfareData,setWelfareData]=useState(null);
  const [err,setErr]=useState('');

  useEffect(()=>{
    api('/reports/summary').then(setSummary).catch(e=>setErr(e.message));
    api('/reports/services').then(setServiceData).catch(console.error);
    api('/reports/welfare').then(setWelfareData).catch(console.error);
  },[]);

  const exportCSV=()=>{
    if(!summary)return;
    const csv=Object.entries(summary).map(([k,v])=>`"${k.replace(/_/g,' ')}","${v}"`).join('\n');
    const blob=new Blob([`"Metric","Value"\n${csv}`],{type:'text/csv'});
    const url=window.URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='village_report.csv';a.click();
  };

  const chartOpts={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}};

  return <>
    <div className="page-title row"><div><h1>Reports & Analytics</h1><p>Live summary from database</p></div><button onClick={exportCSV}>Export to CSV</button></div>
    {err&&<div className="error">{err}</div>}

    <div className="stats">
      {summary&&Object.entries(summary).map(([k,v])=><div className="stat" key={k}><strong>{v}</strong><span>{k.replace(/_/g,' ')}</span></div>)}
    </div>

    {serviceData && <div className="charts-grid">
      <div className="chart-card"><div className="chart-card-header"><h3 className="chart-card-title">Service Requests by Month</h3></div>
        <div className="chart-wrapper"><Bar options={{...chartOpts,scales:{y:{beginAtZero:true}}}} data={{labels:Object.keys(serviceData.by_month||{}).map(m=>{const [y,mo]=m.split('-');return new Date(y,mo-1).toLocaleDateString('en',{month:'short',year:'2-digit'});}),datasets:[{label:'Requests',data:Object.values(serviceData.by_month||{}),backgroundColor:colors[0]}]}}/></div>
      </div>
      <div className="chart-card"><div className="chart-card-header"><h3 className="chart-card-title">Status Distribution</h3></div>
        <div className="chart-wrapper"><Doughnut options={{...chartOpts,plugins:{legend:{display:true,position:'bottom'}}}} data={{labels:Object.keys(serviceData.by_status||{}).map(s=>s.replace(/_/g,' ')),datasets:[{data:Object.values(serviceData.by_status||{}),backgroundColor:colors}]}}/></div>
      </div>
      <div className="chart-card"><div className="chart-card-header"><h3 className="chart-card-title">Requests by Category</h3></div>
        <div className="chart-wrapper"><Bar options={{...chartOpts,indexAxis:'y',scales:{x:{beginAtZero:true}}}} data={{labels:Object.keys(serviceData.by_category||{}),datasets:[{label:'Requests',data:Object.values(serviceData.by_category||{}),backgroundColor:colors[1]}]}}/></div>
      </div>
      {welfareData && <div className="chart-card"><div className="chart-card-header"><h3 className="chart-card-title">Welfare Applications by Scheme</h3></div>
        <div className="chart-wrapper"><Bar options={{...chartOpts,scales:{y:{beginAtZero:true}}}} data={{labels:Object.keys(welfareData.by_scheme||{}).map(s=>s.length>20?s.slice(0,20)+'...':s),datasets:[{label:'Applications',data:Object.values(welfareData.by_scheme||{}),backgroundColor:colors[2]}]}}/></div>
      </div>}
    </div>}
  </>;
}
