import DashboardLayout from '../components/DashboardLayout';
import styles from './Settings.module.css';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  return (
    <DashboardLayout title="Settings">
      <div className={styles.card}>
        <h3>Account</h3>
        <div className={styles.row}>
          <span className={styles.label}>Username</span>
          <span className={styles.value}>{user?.username || '—'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Email</span>
          <span className={styles.value}>{user?.email || '—'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Role</span>
          <span className={styles.badge}>Admin</span>
        </div>
      </div>

      <div className={styles.card}>
        <h3>API Configuration</h3>
        <div className={styles.row}>
          <span className={styles.label}>Server URL</span>
          <span className={`${styles.value} ${styles.mono}`}>{import.meta.env.VITE_API_URL || 'http://localhost:5000'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Songs Endpoint</span>
          <span className={`${styles.value} ${styles.mono}`}>/api/songs</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
