'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import api from '@/lib/api';

type Tab = 'upcoming' | 'past' | 'cancelled';

export default function ClientSessions() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    setLoading(true);
    try {
      const { data } = await api.get('/sessions/me');
      setSessions(data.data || []);
    } catch { setSessions([]); }
    setLoading(false);
  }

  const now = new Date();
  const upcoming = sessions.filter(s => s.status === 'CONFIRMED' && new Date(s.scheduledAt) >= now);
  const past = sessions.filter(s => s.status === 'COMPLETED');
  const cancelled = sessions.filter(s => s.status === 'CANCELLED');

  const tabSessions = tab === 'upcoming' ? upcoming : tab === 'past' ? past : cancelled;

  async function cancelSession(id: string) {
    if (!confirm('Confirmer l\'annulation ?')) return;
    try {
      const { data } = await api.delete(`/sessions/${id}`);
      alert(`Session annulée. Remboursement : ${data.refundAmount}€`);
      fetchSessions();
    } catch (e: any) { alert(e.response?.data?.message || 'Erreur'); }
  }

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: 'upcoming', label: 'À venir', count: upcoming.length },
    { key: 'past', label: 'Passées', count: past.length },
    { key: 'cancelled', label: 'Annulées', count: cancelled.length },
  ];

  return (
    <div style={{ display: 'flex', background: '#0D0D0D', minHeight: '100vh' }}>
      <Sidebar role="client" />
      <main style={{ marginLeft: 220, flex: 1, padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '2rem' }}>Mes sessions</h1>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '0' }}>
          {TABS.map(({ key, label, count }) => (
            <button key={key} type="button" onClick={() => setTab(key)} style={{
              padding: '0.6rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer',
              color: tab === key ? '#C9A84C' : '#555', fontSize: '0.8rem',
              borderBottom: tab === key ? '2px solid #C9A84C' : '2px solid transparent',
              marginBottom: '-1px',
            }}>{label} {count > 0 && <span style={{ fontSize: '0.7rem', color: '#C9A84C' }}>({count})</span>}</button>
          ))}
        </div>

        {loading ? <p style={{ color: '#555' }}>Chargement...</p> : tabSessions.length === 0 ? (
          <p style={{ color: '#555', fontSize: '0.875rem' }}>Aucune session dans cet onglet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tabSessions.map(s => {
              const date = new Date(s.scheduledAt);
              const canJoin = tab === 'upcoming' && s.zoomLink && (date.getTime() - now.getTime()) < 15 * 60 * 1000;
              const canCancel = tab === 'upcoming';
              return (
                <div key={s.id} style={{ background: '#141414', border: '1px solid #1a1a1a', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ color: '#FAFAF8', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ color: '#555', fontSize: '0.8rem' }}>
                      avec {s.coach?.firstName} {s.coach?.lastName} — {s.durationMins} min — {s.price}€
                    </div>
                    {s.cancelReason && <div style={{ color: '#E57373', fontSize: '0.75rem', marginTop: '0.25rem' }}>{s.cancelReason}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {canJoin && s.zoomLink && (
                      <a href={s.zoomLink} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', background: '#C9A84C', color: '#0D0D0D', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.05em' }}>Rejoindre</a>
                    )}
                    {tab === 'past' && !s.review && (
                      <button type="button" style={{ padding: '0.5rem 1rem', border: '1px solid #333', color: '#888', background: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>Laisser un avis</button>
                    )}
                    {canCancel && (
                      <button type="button" onClick={() => cancelSession(s.id)} style={{ padding: '0.5rem 1rem', border: '1px solid #E57373', color: '#E57373', background: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>Annuler</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
