import {useEffect,useState} from 'react';
import {api} from '../api';
import {ArrowLeft,Trash2,ShieldAlert} from 'lucide-react';
import {Link} from 'react-router-dom';

export default function AdminUsers(){
  const [users,setUsers]=useState([]);
  const load=()=>api('/admin/users').then(setUsers).catch(console.error);
  useEffect(()=>{load();},[]);

  const del=async(id)=>{
    if(confirm('Are you sure you want to delete this user?')){
      await api(`/admin/users/${id}`,{method:'DELETE'});
      load();
    }
  };

  const changeRole=async(id,role)=>{
    await api(`/admin/users/${id}/role`,{method:'PUT',body:JSON.stringify({role})});
    load();
  };

  return <>
    <div className="page-title row">
      <div><h1>User Management</h1><p>{users.length} registered system users</p></div>
      <Link to="/admin"><button className="btn-outline"><ArrowLeft size={16}/> Back to Admin</button></Link>
    </div>

    <div className="panel table-wrap">
      <table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Registered</th><th>Actions</th></tr></thead>
        <tbody>{users.map(u=><tr key={u._id}>
          <td><strong>{u.name}</strong></td>
          <td>{u.email}</td>
          <td>
            <select value={u.role} onChange={e=>changeRole(u._id,e.target.value)} style={{padding:'4px 8px',fontSize:13}}>
              <option value="citizen">Citizen</option>
              <option value="admin">Admin</option>
            </select>
          </td>
          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
          <td><button className="btn-ghost" style={{color:'#dc2626'}} onClick={()=>del(u._id)}><Trash2 size={16}/></button></td>
        </tr>)}</tbody>
      </table>
    </div>
  </>;
}
