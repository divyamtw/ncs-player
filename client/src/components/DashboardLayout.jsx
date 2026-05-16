import Sidebar from './Sidebar';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ title, children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <header className={styles.topbar}>
          <h1 className={styles.pageTitle}>{title}</h1>
        </header>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
