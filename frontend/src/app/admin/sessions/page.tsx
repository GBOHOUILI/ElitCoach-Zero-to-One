'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/ui/Sidebar';
import api from '@/lib/api';

const STATUS_COLORS: Record<string, string> = { PENDING: '#888', CONFIRMED: '#C9A84C', COMPLETED: '#4CAF50', CANCELLED: '#E57373', NO_SHOW: '#FF8A65' };

export default function AdminSessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    if (localStorage.getItem('userRole') !== 'ADMIN') { router.push('/login'); return; }
    fetchSessions();
  }, [activeTab]);

  async function fetchSessions() {
    setLoading(true);
    try {
      const params = activeTab ? `?status=${activeTab}` : '';
      const { data } = await api.get(`/admin/sessions${params}`);
      setSessions(data.data || []);
      setTotal(data.total || 0);
    } catch { setSessions([]); }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', background: '#0D0D0D', minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <main style={{ marginLeft: 220, flex: 1, padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '2rem' }}>Sessions <span style={{ color: '#C9A84C' }}>({total})</span></h1>

        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[['', 'Toutes'], ['CONFIRMED', 'À venir'], ['COMPLETED', 'Terminées'], ['CANCELLED', 'Annulées']].map(([v, l]) => (
            <button key={v} type="button" onClick={() => setActiveTab(v)} style={{ padding: '0.5rem 1rem', background: 'none', border: `1px solid ${activeTab === v ? '#C9A84C' : '#242424'}`, color: activeTab === v ? '#C9A84C' : '#555', cursor: 'pointer', fontSize: '0.75rem' }}>{l}</button>
          ))}
        </div>

        {loading ? <p style={{ color: '#555' }}>Chargement...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                {['Coach', 'Client', 'Date', 'Durée', 'Prix', 'Commission', 'Statut'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem', color: '#444', fontWeight: 400, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #111' }}>
                  <td style={{ padding: '0.75rem', color: '#FAFAF8' }}>{s.coach?.firstName} {s.coach?.lastName}</td>
                  <td style={{ padding: '0.75rem', color: '#888' }}>{s.client?.firstName} {s.client?.lastName}</td>
                  <td style={{ padding: '0.75rem', color: '#888' }}>{new Date(s.scheduledAt).toLocaleDateString('fr-FR')} {new Date(s.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td style={{ padding: '0.75rem', color: '#555' }}>{s.durationMins} min</td>
                  <td style={{ padding: '0.75rem', color: '#C9A84C' }}>{s.price}€</td>
                  <td style={{ padding: '0.75rem', color: '#888' }}>{s.commission}€</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', border: `1px solid ${STATUS_COLORS[s.status] || '#333'}`, color: STATUS_COLORS[s.status] || '#555', fontSize: '0.65rem' }}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {sessions.length === 0 && !loading && <p style={{ color: '#555', textAlign: 'center', padding: '3rem' }}>Aucune session.</p>}
      </main>
    </div>
  );
}
