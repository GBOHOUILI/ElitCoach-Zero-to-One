'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/ui/Sidebar';
import api from '@/lib/api';

export default function AdminFinancePage() {
  const router = useRouter();
  const [period, setPeriod] = useState(new Date().toISOString().substring(0, 7));
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('userRole') !== 'ADMIN') { router.push('/login'); return; }
    fetchFinance();
  }, [period]);

  async function fetchFinance() {
    setLoading(true);
    try {
      const { data: d } = await api.get(`/admin/finance?period=${period}`);
      setData(d);
    } catch { setData(null); }
    setLoading(false);
  }

  function exportCSV() {
    if (!data) return;
    const rows = [['Coach', 'Sessions', 'Revenu brut', 'Reversement (83%)']];
    data.sessionsByCoach?.forEach((c: any) => rows.push([c.name, c.sessions, `${c.revenue}€`, `${c.payout}€`]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `elitcoach-finance-${period}.csv`; a.click();
  }

  return (
    <div style={{ display: 'flex', background: '#0D0D0D', minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <main style={{ marginLeft: 220, flex: 1, padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 300, color: '#FAFAF8' }}>Finance</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input type="month" value={period} onChange={e => setPeriod(e.target.value)} style={{ background: '#141414', border: '1px solid #333', color: '#FAFAF8', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }} />
            <button type="button" onClick={exportCSV} style={{ padding: '0.5rem 1rem', background: 'none', border: '1px solid #C9A84C', color: '#C9A84C', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Export CSV</button>
          </div>
        </div>

        {loading ? <p style={{ color: '#555' }}>Chargement...</p> : !data ? <p style={{ color: '#555' }}>Aucune donnée.</p> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Revenu brut', value: `${data.grossRevenue}€` },
                { label: 'Commissions (17%)', value: `${data.commissions}€`, gold: true },
                { label: 'Reversements (83%)', value: `${data.coachPayouts}€` },
                { label: 'Sessions', value: data.sessionsByCoach?.reduce((s: number, c: any) => s + c.sessions, 0) || 0 },
              ].map(({ label, value, gold }) => (
                <div key={label} style={{ background: '#141414', border: `1px solid ${gold ? 'rgba(201,168,76,0.3)' : '#1a1a1a'}`, padding: '1.25rem' }}>
                  <div style={{ color: '#555', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', fontWeight: 300, color: gold ? '#C9A84C' : '#FAFAF8' }}>{value}</div>
                </div>
              ))}
            </div>

            {data.sessionsByCoach?.length > 0 && (
              <div style={{ background: '#141414', border: '1px solid #1a1a1a', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid #1a1a1a' }}>
                  <h2 style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555' }}>Par coach</h2>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                      {['Coach', 'Sessions', 'Revenu brut', 'Reversement'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '0.75rem', color: '#444', fontWeight: 400, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.sessionsByCoach.map((c: any) => (
                      <tr key={c.coachId} style={{ borderBottom: '1px solid #111' }}>
                        <td style={{ padding: '0.75rem', color: '#FAFAF8' }}>{c.name}</td>
                        <td style={{ padding: '0.75rem', color: '#888' }}>{c.sessions}</td>
                        <td style={{ padding: '0.75rem', color: '#888' }}>{c.revenue}€</td>
                        <td style={{ padding: '0.75rem', color: '#C9A84C' }}>{c.payout}€</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
