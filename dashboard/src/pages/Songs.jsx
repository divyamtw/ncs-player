import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import SongModal from '../components/SongModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { songsApi } from '../lib/api';
import toast from 'react-hot-toast';
import styles from './Songs.module.css';

const GENRES = ['All', 'Electronic', 'Hip-Hop', 'Lofi', 'Synthwave', 'Ambient', 'Rock', 'Pop', 'Jazz', 'Classical'];
const SOURCES = ['All', 'Admin', 'NCS'];

export default function SongsPage() {
  const [songs, setSongs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [stats, setStats] = useState({ total: 0, adminCount: 0, popularCount: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [source, setSource] = useState('All');
  const [tab, setTab] = useState('all'); // all | admin | ncs | popular

  const [modalOpen, setModalOpen] = useState(false);
  const [editSong, setEditSong] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await songsApi.getStats();
      setStats(res.data);
    } catch {
      // silently ignore
    }
  }, []);

  const fetchSongs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (genre !== 'All') params.genre = genre;
      if (source !== 'All') params.source = source;
      if (tab === 'admin') params.source = 'Admin';
      if (tab === 'ncs') params.source = 'NCS';
      if (tab === 'popular') params.isPopular = 'true';

      const res = await songsApi.getAll(params);
      setSongs(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to fetch songs');
    } finally {
      setLoading(false);
    }
  }, [search, genre, source, tab]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchSongs(1); }, [fetchSongs]);

  const handleCreate = () => { setEditSong(null); setModalOpen(true); };
  const handleEdit = (song) => { setEditSong(song); setModalOpen(true); };
  const handleDelete = (song) => setDeleteTarget(song);

  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchSongs(pagination.page);
    fetchStats();
  };

  const handleDeleteConfirm = async () => {
    try {
      await songsApi.delete(deleteTarget._id);
      toast.success('Song deleted');
      setDeleteTarget(null);
      fetchSongs(pagination.page);
      fetchStats();
    } catch {
      toast.error('Failed to delete song');
    }
  };

  const handleTogglePopular = async (song) => {
    try {
      await songsApi.togglePopular(song._id);
      toast.success(`Marked as ${song.isPopular ? 'not popular' : 'popular'}`);
      fetchSongs(pagination.page);
      fetchStats();
    } catch {
      toast.error('Failed to update');
    }
  };

  const statsCards = [
    {
      label: 'Total Songs', value: stats.total,
      color: 'var(--primary)', bg: 'var(--primary-bg)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    },
    {
      label: 'Admin Added', value: stats.adminCount,
      color: 'var(--success)', bg: 'var(--success-bg)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
    },
    {
      label: 'Popular Tracks', value: stats.popularCount,
      color: 'var(--amber)', bg: 'var(--amber-bg)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
    },
  ];

  return (
    <DashboardLayout title="Songs Management">
      {/* Stats */}
      <div className={styles.stats}>
        {statsCards.map(({ label, value, color, bg, icon }) => (
          <div key={label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: bg, color }}>
              {icon}
            </div>
            <div>
              <div className={styles.statValue} style={{ color }}>{value}</div>
              <div className={styles.statLabel}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className={styles.tableCard}>
        {/* Card header */}
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>
            <span>All Songs</span>
            <span className={styles.countBadge}>{pagination.total} tracks</span>
          </div>
          <button className={styles.addBtn} onClick={handleCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Song
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[['all', 'All'], ['admin', 'Admin Added'], ['ncs', 'NCS'], ['popular', 'Popular']].map(([key, label]) => (
            <button key={key} className={`${styles.tab} ${tab === key ? styles.tabActive : ''}`}
              onClick={() => setTab(key)}>{label}</button>
          ))}
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className={styles.searchInput} placeholder="Search songs, artists..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className={styles.filterSelect} value={genre} onChange={e => setGenre(e.target.value)}>
            {GENRES.map(g => <option key={g}>{g}</option>)}
          </select>
          <select className={styles.filterSelect} value={source} onChange={e => setSource(e.target.value)}>
            {SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title & Artist</th>
                <th>Genre</th>
                <th>Source</th>
                <th>Popular</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className={styles.loadingRow}>
                  <div className={styles.loadingSpinner} />
                  <span>Loading songs...</span>
                </td></tr>
              ) : songs.length === 0 ? (
                <tr><td colSpan="7" className={styles.emptyRow}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                  <p>No songs found</p>
                  <span>Add your first song using the button above</span>
                </td></tr>
              ) : songs.map(song => (
                <tr key={song._id} className={styles.row}>
                  <td>
                    <div className={styles.cover}>
                      {song.cover ? (
                        <img src={song.cover} alt={song.title} onError={e => { e.target.style.display='none'; }} />
                      ) : (
                        <div className={styles.coverPlaceholder}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.titleCol}>
                      <div className={styles.songTitle}>{song.title}</div>
                      <div className={styles.songArtist}>{song.artist}</div>
                    </div>
                  </td>
                  <td><span className={styles.genreTag}>{song.genre || '—'}</span></td>
                  <td>
                    <span className={`${styles.sourceBadge} ${song.source === 'Admin' ? styles.sourceAdmin : styles.sourceNCS}`}>
                      {song.source}
                    </span>
                  </td>
                  <td>
                    <button className={styles.popularBtn} onClick={() => handleTogglePopular(song)}
                      title={song.isPopular ? 'Remove from popular' : 'Mark as popular'}>
                      {song.isPopular
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--success)" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                      }
                    </button>
                  </td>
                  <td className={styles.dateCell}>
                    {song.createdAt ? new Date(song.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : '—'}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => handleEdit(song)} title="Edit">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(song)} title="Delete">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} songs
            </span>
            <div className={styles.paginationBtns}>
              <button disabled={pagination.page === 1}
                onClick={() => fetchSongs(pagination.page - 1)}
                className={styles.pageBtn}>
                ← Prev
              </button>
              {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                const pg = i + 1;
                return (
                  <button key={pg}
                    onClick={() => fetchSongs(pg)}
                    className={`${styles.pageBtn} ${pagination.page === pg ? styles.pageBtnActive : ''}`}>
                    {pg}
                  </button>
                );
              })}
              <button disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchSongs(pagination.page + 1)}
                className={styles.pageBtn}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalOpen && (
        <SongModal
          song={editSong}
          onClose={() => setModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          song={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </DashboardLayout>
  );
}
