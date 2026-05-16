import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../lib/api';
import toast from 'react-hot-toast';
import styles from './Login.module.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password)
      return toast.error('All fields are required');
    setLoading(true);
    try {
      await authApi.register(form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.wave}>
          {[...Array(40)].map((_, i) => (
            <div key={i} className={styles.bar}
              style={{ animationDelay: `${(i * 0.07).toFixed(2)}s`,
                       height: `${20 + Math.sin(i * 0.5) * 40}%` }} />
          ))}
        </div>
        <div className={styles.leftContent}>
          <div className={styles.logo}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="var(--primary)"/>
              <path d="M26 14v8.5a3.5 3.5 0 1 1-2-3.15V14H26ZM17 24.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" fill="white"/>
            </svg>
            <span className={styles.logoText}>NCS <span>Admin</span></span>
          </div>
          <h1 className={styles.tagline}>Join the<br/>Ecosystem.</h1>
          <p className={styles.desc}>
            Create your admin account and start managing the NoCopyrightSounds catalog today.
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Create Account</h2>
            <p>Set up your NCS Admin access</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="username">Username</label>
              <input id="username" name="username" type="text"
                placeholder="johnadmin" value={form.username} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email"
                placeholder="admin@ncs.io" value={form.email} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password"
                placeholder="••••••••" value={form.password} onChange={handleChange} />
            </div>

            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Create Account'}
            </button>
          </form>

          <p className={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>Sign in</Link>
          </p>
        </div>
        <p className={styles.copyright}>© 2025 NCS Admin Dashboard</p>
      </div>
    </div>
  );
}
