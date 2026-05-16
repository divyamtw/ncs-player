import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './Login.module.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back, Admin!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Left panel */}
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
          <h1 className={styles.tagline}>Your Music.<br/>Your Rules.</h1>
          <p className={styles.desc}>
            Manage your catalog, track listener data, and control the full
            NoCopyrightSounds experience from one powerful dashboard.
          </p>
          <div className={styles.features}>
            {['Full song CRUD management', 'Genre & popularity filters', 'Real-time catalog stats'].map(f => (
              <div key={f} className={styles.feature}>
                <div className={styles.featureDot} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Sign In</h2>
            <p>Access the NCS Admin Dashboard</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email" name="email" type="email"
                placeholder="admin@ncs.io"
                value={form.email} onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password" name="password" type="password"
                placeholder="••••••••"
                value={form.password} onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <div className={styles.forgotRow}>
              <a href="#" className={styles.forgot}>Forgot password?</a>
            </div>

            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M10 14 21 3M21 14v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className={styles.footer}>
            Don&apos;t have an account?{' '}
            <Link to="/register" className={styles.link}>Register here</Link>
          </p>
        </div>

        <p className={styles.copyright}>© 2025 NCS Admin Dashboard</p>
      </div>
    </div>
  );
}
