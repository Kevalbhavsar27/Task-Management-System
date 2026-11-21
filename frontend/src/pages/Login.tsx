import { useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [show, setShow] = useState(false); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setError(''); setBusy(true); try { await login(email, password); navigate('/', { replace: true }); } catch (e) { setError(getErrorMessage(e)); } finally { setBusy(false); } }
  return <AuthLayout mode="login"><div className="form-heading"><span className="eyebrow">WELCOME BACK</span><h2>Good to see you.</h2><p>Log in to pick up where you left off.</p></div><form className="auth-form" onSubmit={submit}><label>Email address</label><div className="input-wrap"><Mail size={18}/><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></div><label>Password</label><div className="input-wrap"><LockKeyhole size={18}/><input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required/><button className="icon-button" type="button" onClick={() => setShow(!show)} aria-label="Toggle password visibility">{show ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div>{error && <div className="form-error">{error}</div>}<button className="primary-button" disabled={busy}>{busy ? 'Logging in…' : 'Log in'} <ArrowRight size={17}/></button></form><p className="form-note">Your workspace is just one step away.</p><p className="terms-note">By continuing, you agree to use TaskFlow responsibly.</p><Link className="sr-only" to="/signup">Create account</Link></AuthLayout>;
}
