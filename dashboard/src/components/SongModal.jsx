import { useState, useEffect } from 'react';
import { songsApi } from '../lib/api';
import toast from 'react-hot-toast';
import styles from './SongModal.module.css';

const GENRES = ['Electronic', 'Hip-Hop', 'Lofi', 'Synthwave', 'Ambient', 'Rock', 'Pop', 'Jazz', 'Classical', 'Other'];

const EMPTY = {
  title: '', artist: '', genre: 'Electronic',
  mp3: '', cover: '', duration: '', isPopular: false,
};

export default function SongModal({ song, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const isEdit = !!song;

  useEffect(() => {
    if (song) {
      setForm({
        title: song.title || '',
        artist: song.artist || '',
        genre: song.genre || 'Electronic',
        mp3: song.mp3 || '',
        cover: song.cover || '',
        duration: song.duration || '',
        isPopular: song.isPopular || false,
      });
    }
  }, [song]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.artist || !form.mp3)
      return toast.error('Title, artist, and MP3 URL are required');
    setLoading(true);
    try {
      if (isEdit) {
        await songsApi.update(song._id, form);
        toast.success('Song updated successfully!');
      } else {
        await songsApi.create(form);
        toast.success('Song added to catalog!');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2>{isEdit ? 'Edit Song' : 'Add New Song'}</h2>
            <p>{isEdit ? `Editing "${song.title}"` : 'Add a custom track to the NCS catalog'}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label>Track Title <span className={styles.req}>*</span></label>
              <input value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="Enter song title..." />
            </div>
            <div className={styles.field}>
              <label>Artist Name <span className={styles.req}>*</span></label>
              <input value={form.artist} onChange={e => set('artist', e.target.value)}
                placeholder="Enter artist name..." />
            </div>
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label>Genre</label>
              <select value={form.genre} onChange={e => set('genre', e.target.value)}>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>Duration</label>
              <input value={form.duration} onChange={e => set('duration', e.target.value)}
                placeholder="3:45" />
            </div>
          </div>

          <div className={styles.field}>
            <label>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',marginRight:5,verticalAlign:'middle'}}>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              MP3 URL <span className={styles.req}>*</span>
            </label>
            <input value={form.mp3} onChange={e => set('mp3', e.target.value)}
              placeholder="https://example.com/song.mp3" type="url" />
          </div>

          <div className={styles.field}>
            <label>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display:'inline',marginRight:5,verticalAlign:'middle'}}>
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              Cover Image URL
            </label>
            <input value={form.cover} onChange={e => set('cover', e.target.value)}
              placeholder="https://example.com/cover.jpg" type="url" />
          </div>

          {/* Preview */}
          {(form.cover || form.title) && (
            <div className={styles.preview}>
              <div className={styles.previewCover}>
                {form.cover ? (
                  <img src={form.cover} alt="cover" onError={e => e.target.style.display='none'} />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1.5">
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                )}
              </div>
              <div className={styles.previewInfo}>
                <div className={styles.previewTitle}>{form.title || 'Untitled Track'}</div>
                <div className={styles.previewArtist}>{form.artist || 'Unknown Artist'}</div>
                {form.duration && <div className={styles.previewDuration}>{form.duration}</div>}
              </div>
            </div>
          )}

          {/* Toggle */}
          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleLabel}>Mark as Popular</div>
              <div className={styles.toggleDesc}>Featured in the popular tracks section</div>
            </div>
            <button type="button"
              className={`${styles.toggle} ${form.isPopular ? styles.toggleOn : ''}`}
              onClick={() => set('isPopular', !form.isPopular)}>
              <span className={styles.toggleKnob} />
            </button>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <span className={styles.reqNote}>* Required fields</span>
            <div className={styles.footerBtns}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                    </svg>
                    {isEdit ? 'Save Changes' : 'Add Song'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
