import DashboardLayout from '../components/DashboardLayout';
import styles from './Dashboard.module.css';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const quickActions = [
    { label: 'Add New Song', desc: 'Upload a custom track to the catalog', icon: '🎵', to: '/songs', accent: 'var(--primary)' },
    { label: 'Manage Songs', desc: 'View, edit and delete songs', icon: '📋', to: '/songs', accent: 'var(--success)' },
    { label: 'Settings', desc: 'Configure dashboard preferences', icon: '⚙️', to: '/settings', accent: 'var(--amber)' },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className={styles.welcome}>
        <h2>{greeting}, {user?.username || 'Admin'}!</h2>
        <p>Welcome back to the NCS Admin Dashboard. Here's your overview.</p>
      </div>

      <div className={styles.quickGrid}>
        {quickActions.map(({ label, desc, icon, to, accent }) => (
          <Link key={label} to={to} className={styles.quickCard}>
            <div className={styles.quickIcon} style={{ background: `${accent}18`, color: accent }}>
              {icon}
            </div>
            <div className={styles.quickText}>
              <div className={styles.quickLabel}>{label}</div>
              <div className={styles.quickDesc}>{desc}</div>
            </div>
            <svg className={styles.quickArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        ))}
      </div>

      <div className={styles.infoCard}>
        <div className={styles.infoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-lt)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
        </div>
        <div>
          <div className={styles.infoTitle}>Getting Started</div>
          <div className={styles.infoText}>
            Navigate to <strong>Songs</strong> to manage your catalog. Use the <strong>Add Song</strong> button
            to upload custom tracks with MP3 URLs, cover art, and metadata. Toggle tracks as <strong>Popular</strong> to feature them.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
