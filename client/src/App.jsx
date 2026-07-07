import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import {useAuth} from './context/AuthContext';
import Layout from './components/Layout';
import {Login,Register} from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CrudPage from './pages/CrudPage';

import Citizens from './pages/Citizens';
import CitizenRegister from './pages/CitizenRegister';
import CitizenProfile from './pages/CitizenProfile';

import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';

import Welfare from './pages/Welfare';
import WelfareApply from './pages/WelfareApply';
import WelfareApplications from './pages/WelfareApplications';

import Certificates from './pages/Certificates';
import CertificateRequest from './pages/CertificateRequest';
import CertificateDetail from './pages/CertificateDetail';
import CertificatePreview from './pages/CertificatePreview';

import Reports from './pages/Reports';

import Admin from './pages/Admin';
import AdminUsers from './pages/AdminUsers';
import AdminAudit from './pages/AdminAudit';

function Guard({children}){return useAuth().user?children:<Navigate to="/login"/>}

export default function App(){
  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      
      <Route element={<Guard><Layout/></Guard>}>
        <Route index element={<Dashboard/>}/>
        
        <Route path="citizens" element={<Citizens/>}/>
        <Route path="citizens/register" element={<CitizenRegister/>}/>
        <Route path="citizens/:id" element={<CitizenProfile/>}/>
        
        <Route path="households" element={<CrudPage title="Households" endpoint="/households" fields={['houseNumber','headName','address','members','category']}/>}/>
        
        <Route path="services" element={<Services/>}/>
        <Route path="services/:id" element={<ServiceDetail/>}/>
        
        <Route path="welfare" element={<Welfare/>}/>
        <Route path="welfare/apply/:id" element={<WelfareApply/>}/>
        <Route path="welfare/applications" element={<WelfareApplications/>}/>
        
        <Route path="certificates" element={<Certificates/>}/>
        <Route path="certificates/new" element={<CertificateRequest/>}/>
        <Route path="certificates/:id" element={<CertificateDetail/>}/>
        <Route path="certificates/:id/preview" element={<CertificatePreview/>}/>
        
        <Route path="notifications" element={<CrudPage title="Announcements" endpoint="/notifications" fields={['title','message','type']}/>}/>
        <Route path="resources" element={<CrudPage title="Resources" endpoint="/resources" fields={['name','category','quantity','allocated','location']}/>}/>
        
        <Route path="reports" element={<Reports/>}/>
        
        <Route path="admin" element={<Admin/>}/>
        <Route path="admin/users" element={<AdminUsers/>}/>
        <Route path="admin/audit" element={<AdminAudit/>}/>
      </Route>
    </Routes>
  </BrowserRouter>;
}
