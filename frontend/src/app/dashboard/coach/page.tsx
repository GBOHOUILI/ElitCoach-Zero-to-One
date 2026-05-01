'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/ui/Sidebar';
import api from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function CoachDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const firstName = typeof window !== 'undefined' ? localStorage.getItem('userFirstName') : '';

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'COACH') { router.push('/login'); return; }
    api.get('/coaches/me').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex' }}><Sidebar role="coach" /><div style={{ marginLeft: 220, padding: '3rem', color: '#555' }}>Chargement...</div></div>;

  const kpis = [
    { label: 'Revenus ce mois', value: `${Math.round((data?.hourlyRate || 0) * 0)}€`, sub: '0 sessions' },
    { label: 'Sessions', value: '0', sub: '0 à venir' },
    { label: 'Clients actifs', value: '0', sub: '' },
    { label: 'Score', value: `${data?.score || 0}/1000`, sub: 'Crédibilité' },
  ];

  return (
    <div style={{ display: 'flex', background: '#0D0D0D', minHeight: '100vh' }}>
      <Sidebar role="coach" />
      <main style={{ marginLeft: 220, flex: 1, padding: '2.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '0.25rem' }}>
            Bonjour {firstName || data?.firstName} 👋
          </h1>
          <p style={{ color: '#555', fontSize: '0.8rem' }}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {data?.isVerified && <span style={{ marginLeft: '1rem', color: '#C9A84C', fontSize: '0.7rem', border: '1px solid rgba(201,168,76,0.3)', padding: '0.15rem 0.5rem' }}>✓ Verified Coach</span>}
          </p>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {kpis.map((k) => (
            <div key={k.label} style={{ background: '#141414', border: '1px solid #1a1a1a', padding: '1.25rem' }}>
              <div style={{ color: '#555', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{k.label}</div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', fontWeight: 300, color: '#FAFAF8' }}>{k.value}</div>
              {k.sub && <div style={{ color: '#444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{k.sub}</div>}
            </div>
          ))}
        </div>

        {/* Score crédibilité */}
        <div style={{ background: '#141414', border: '1px solid #1a1a1a', padding: '1.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555' }}>Score de crédibilité</h2>
            <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', fontWeight: 300, color: '#C9A84C' }}>{data?.score || 0}<span style={{ fontSize: '1rem', color: '#444' }}>/1000</span></span>
          </div>
          <div style={{ height: 4, background: '#1a1a1a', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${(data?.score || 0) / 10}%`, background: 'linear-gradient(90deg, #A07830, #C9A84C)', borderRadius: 2, transition: 'width 1s ease' }} />
          </div>
          <p style={{ color: '#444', fontSize: '0.75rem', marginTop: '0.75rem' }}>
            Complétez votre profil, ajoutez des disponibilités et obtenez vos premières sessions pour améliorer votre score.
          </p>
        </div>

        {/* Statut profil */}
        <div style={{ background: '#141414', border: `1px solid ${data?.status === 'APPROVED' ? 'rgba(201,168,76,0.3)' : '#1a1a1a'}`, padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>Statut de votre candidature</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['PENDING', 'SCREENING', 'INTERVIEW', 'TEST', 'APPROVED'].map((s, i) => {
              const statuses = ['PENDING', 'SCREENING', 'INTERVIEW', 'TEST', 'APPROVED'];
              const currentIdx = statuses.indexOf(data?.status || 'PENDING');
              const isActive = i === currentIdx;
              const isDone = i < currentIdx;
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <div style={{
                    padding: '0.35rem 0.75rem', fontSize: '0.65rem', letterSpacing: '0.1em',
                    border: `1px solid ${isActive ? '#C9A84C' : isDone ? 'rgba(201,168,76,0.3)' : '#242424'}`,
                    color: isActive ? '#C9A84C' : isDone ? 'rgba(201,168,76,0.6)' : '#333',
                    background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                  }}>{s}</div>
                  {i < 4 && <span style={{ color: '#333', fontSize: '0.7rem' }}>→</span>}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
