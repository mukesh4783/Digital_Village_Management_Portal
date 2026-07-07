import {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {Link,useNavigate} from 'react-router-dom';

export function Login(){
  const [f,setF]=useState({email:'',password:''});
  const [loginType, setLoginType] = useState('citizen'); // 'citizen' or 'admin'
  const [err,setErr]=useState('');
  const {login}=useAuth(),nav=useNavigate();
  
  const go=async e=>{
    e.preventDefault();
    try{
      await login(f.email,f.password, loginType);
      nav('/')
    }catch(x){
      setErr(x.message)
    }
  };
  
  return (
    <AuthBox title="Welcome Back">
      <div className="auth-tabs" style={{display: 'flex', marginBottom: '20px', gap: '10px'}}>
        <button 
          type="button" 
          className={loginType === 'citizen' ? '' : 'btn-outline'} 
          style={{flex: 1}} 
          onClick={() => setLoginType('citizen')}
        >
          Citizen
        </button>
        <button 
          type="button" 
          className={loginType === 'admin' ? '' : 'btn-outline'} 
          style={{flex: 1}} 
          onClick={() => setLoginType('admin')}
        >
          Admin
        </button>
      </div>

      <form onSubmit={go}>
        <input placeholder="Email Address" required type="email" onChange={e=>setF({...f,email:e.target.value})}/>
        <input type="password" placeholder="Password" required onChange={e=>setF({...f,password:e.target.value})}/>
        {err&&<p className="error">{err}</p>}
        <button>Login as {loginType === 'admin' ? 'Admin' : 'Citizen'}</button>
        <p>New {loginType}? <Link to={`/register?role=${loginType}`}>Create account</Link></p>
      </form>
    </AuthBox>
  );
}

export function Register(){
  const urlParams = new URLSearchParams(window.location.search);
  const initialRole = urlParams.get('role') === 'admin' ? 'admin' : 'citizen';
  
  const [f,setF]=useState({name:'',email:'',password:'',phone:'', role: initialRole, secretKey: ''});
  const {register}=useAuth(),nav=useNavigate();
  const [err,setErr] = useState('');

  const go=async e=>{
    e.preventDefault();
    try {
      await register(f);
      nav('/');
    } catch(x) {
      setErr(x.message);
    }
  };
  
  return (
    <AuthBox title={`${f.role === 'admin' ? 'Admin' : 'Citizen'} Registration`}>
      <div className="auth-tabs" style={{display: 'flex', marginBottom: '20px', gap: '10px'}}>
        <button 
          type="button" 
          className={f.role === 'citizen' ? '' : 'btn-outline'} 
          style={{flex: 1}} 
          onClick={() => setF({...f, role: 'citizen', secretKey: ''})}
        >
          Citizen
        </button>
        <button 
          type="button" 
          className={f.role === 'admin' ? '' : 'btn-outline'} 
          style={{flex: 1}} 
          onClick={() => setF({...f, role: 'admin'})}
        >
          Admin
        </button>
      </div>

      <form onSubmit={go}>
        <input type="text" placeholder="Full Name" required value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
        <input type="email" placeholder="Email Address" required value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
        <input type="tel" placeholder="Phone Number" required value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/>
        <input type="password" placeholder="Password" required value={f.password} onChange={e=>setF({...f,password:e.target.value})}/>
        
        {f.role === 'admin' && (
          <input 
            type="password" 
            placeholder="Admin Secret Key" 
            required 
            value={f.secretKey} 
            onChange={e=>setF({...f,secretKey:e.target.value})}
            style={{borderColor: '#ef4444', backgroundColor: '#fef2f2'}}
          />
        )}

        {err && <p className="error">{err}</p>}
        <button>Register</button>
        <p><Link to="/login">Back to login</Link></p>
      </form>
    </AuthBox>
  );
}

function AuthBox({title,children}){
  return (
    <div className="auth">
      <div className="auth-card">
        <div className="auth-logo">🌿</div>
        <h1 style={{fontSize: '24px', marginBottom: '8px', color: '#1e293b'}}>{title}</h1>
        <p style={{color: '#64748b', marginBottom: '24px'}}>Digital Village Management Portal</p>
        {children}
      </div>
    </div>
  );
}
