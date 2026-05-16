import styles from './DeleteConfirmModal.module.css';

export default function DeleteConfirmModal({ song, onClose, onConfirm }) {
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.icon}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>
        <h2>Delete Song</h2>
        <p>
          Are you sure you want to delete{' '}
          <strong>"{song?.title}"</strong> by <strong>{song?.artist}</strong>?
          <br/>This action cannot be undone.
        </p>
        <div className={styles.btns}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.deleteBtn} onClick={onConfirm}>Delete Song</button>
        </div>
      </div>
    </div>
  );
}
