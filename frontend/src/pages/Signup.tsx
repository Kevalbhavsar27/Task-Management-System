import { useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
export default function Signup() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [username, setUsername] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [show, setShow] = useState(false); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setError(''); setBusy(true); try { await register(username, email, password); navigate('/', { replace: true }); } catch (e) { setError(getErrorMessage(e)); } finally { setBusy(false); } }
  return <AuthLayout mode="signup"><div className="form-heading"><span className="eyebrow">GET STARTED — IT'S FREE</span><h2>Create your account.</h2><p>A fresh start for everything on your list.</p></div><form className="auth-form" onSubmit={submit}><label>Username</label><div className="input-wrap"><UserRound size={18}/><input value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" minLength={3} maxLength={30} autoComplete="username" required/></div><label>Email address</label><div className="input-wrap"><Mail size={18}/><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></div><label>Password</label><div className="input-wrap"><LockKeyhole size={18}/><input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" minLength={8} autoComplete="new-password" required/><button className="icon-button" type="button" onClick={() => setShow(!show)} aria-label="Toggle password visibility">{show ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div>{error && <div className="form-error">{error}</div>}<button className="primary-button" disabled={busy}>{busy ? 'Creating account…' : 'Create account'} <ArrowRight size={17}/></button></form><p className="terms-note">Your account is personal. Your tasks are private.</p></AuthLayout>;
}
