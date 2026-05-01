'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import api from '@/lib/api';

const STATUSES = ['', 'PENDING', 'SCREENING', 'INTERVIEW', 'TEST', 'APPROVED', 'REJECTED'];
const STATUS_LABELS: Record<string, string> = { '': 'Tous', PENDING: 'En attente', SCREENING: 'Examen', INTERVIEW: 'Entretien', TEST: 'Test', APPROVED: 'Approuvés', REJECTED: 'Refusés' };
const STATUS_COLORS: Record<string, string> = { PENDING: '#888', SCREENING: '#C9A84C', INTERVIEW: '#7CB9E8', TEST: '#9B59B6', APPROVED: '#4CAF50', REJECTED: '#E57373' };

function AdminCoachesContent() {
  const router = useRouter();
  const [coaches, setCoaches] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('userRole') !== 'ADMIN') { router.push('/login'); return; }
    fetchCoaches();
  }, [activeTab]);

  async function fetchCoaches() {
    setLoading(true);
    try {
      const params = activeTab ? `?status=${activeTab}` : '';
      const { data } = await api.get(`/admin/coaches${params}`);
      setCoaches(data.data || []);
      setTotal(data.total || 0);
    } catch { setCoaches([]); }
    setLoading(false);
  }

  async function changeStatus() {
    if (!selected || !newStatus) return;
    setUpdating(true);
    try {
      await api.patch(`/admin/coaches/${selected.id}/status`, { status: newStatus, note });
      setSelected(null); setNote(''); setNewStatus('');
      fetchCoaches();
    } catch (e: any) { alert(e.response?.data?.message || 'Erreur'); }
    setUpdating(false);
  }

  return (
    <div style={{ display: 'flex', background: '#0D0D0D', minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <main style={{ marginLeft: 220, flex: 1, padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '2rem' }}>Pipeline Candidatures Coachs <span style={{ color: '#C9A84C', fontSize: '1rem' }}>({total})</span></h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} type="button" onClick={() => setActiveTab(s)} style={{
              padding: '0.5rem 1rem', background: 'none', border: `1px solid ${activeTab === s ? '#C9A84C' : '#242424'}`,
              color: activeTab === s ? '#C9A84C' : '#555', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.05em',
            }}>{STATUS_LABELS[s]}</button>
          ))}
        </div>

        {/* Table */}
        {loading ? <p style={{ color: '#555' }}>Chargement...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  {['Nom', 'Email', 'Spécialités', 'Expérience', 'Tarif', 'Statut', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem', color: '#444', fontWeight: 400, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coaches.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #111' }}>
                    <td style={{ padding: '0.75rem', color: '#FAFAF8' }}>{c.firstName} {c.lastName}</td>
                    <td style={{ padding: '0.75rem', color: '#555' }}>{c.user?.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {c.specialties?.slice(0, 2).map((s: string) => (
                          <span key={s} style={{ padding: '0.15rem 0.4rem', border: '1px solid #333', color: '#555', fontSize: '0.65rem' }}>{s}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#555' }}>{c.yearsExperience} ans</td>
                    <td style={{ padding: '0.75rem', color: '#C9A84C' }}>{c.hourlyRate}€/h</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.25rem 0.6rem', border: `1px solid ${STATUS_COLORS[c.status] || '#333'}`, color: STATUS_COLORS[c.status] || '#555', fontSize: '0.65rem' }}>{c.status}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#444' }}>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button type="button" onClick={() => { setSelected(c); setNewStatus(c.status); }} style={{ padding: '0.35rem 0.75rem', background: 'none', border: '1px solid #333', color: '#888', cursor: 'pointer', fontSize: '0.7rem' }}>Gérer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {coaches.length === 0 && <p style={{ color: '#555', padding: '2rem', textAlign: 'center' }}>Aucun coach dans ce statut.</p>}
          </div>
        )}

        {/* Modal */}
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setSelected(null)}>
            <div style={{ background: '#141414', border: '1px solid #242424', padding: '2rem', width: '90%', maxWidth: 560 }} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '1.5rem' }}>{selected.firstName} {selected.lastName}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', color: '#666', fontSize: '0.8rem' }}>
                <div>Email : {selected.user?.email}</div>
                <div>Tarif : {selected.hourlyRate}€/h — {selected.yearsExperience} ans d'expérience</div>
                <div>Spécialités : {selected.specialties?.join(', ')}</div>
                <div>Certifications : {selected.certifications?.join(', ') || '—'}</div>
                {selected.videoUrl && <div>Vidéo : <a href={selected.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C' }}>Voir la vidéo</a></div>}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: '0.5rem' }}>Nouveau statut</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={{ background: '#0D0D0D', border: '1px solid #333', color: '#FAFAF8', padding: '0.6rem', width: '100%', fontSize: '0.8rem' }}>
                  {['PENDING','SCREENING','INTERVIEW','TEST','APPROVED','REJECTED'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: '0.5rem' }}>Note (optionnel)</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} style={{ background: '#0D0D0D', border: '1px solid #333', color: '#FAFAF8', padding: '0.6rem', width: '100%', fontSize: '0.8rem', resize: 'none' }} placeholder="Raison du changement de statut..." />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setSelected(null)} style={{ flex: 1, padding: '0.75rem', background: 'none', border: '1px solid #333', color: '#555', cursor: 'pointer', fontSize: '0.75rem' }}>Annuler</button>
                <button type="button" onClick={changeStatus} disabled={updating} style={{ flex: 2, padding: '0.75rem', background: '#C9A84C', color: '#0D0D0D', border: 'none', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {updating ? 'Mise à jour...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminCoachesPage() {
  return <Suspense><AdminCoachesContent /></Suspense>;
}
