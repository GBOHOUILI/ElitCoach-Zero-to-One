'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/ui/Sidebar';
import api from '@/lib/api';

export default function ClientDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const firstName = typeof window !== 'undefined' ? localStorage.getItem('userFirstName') : '';

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'CLIENT') { router.push('/login'); return; }
    api.get('/clients/me').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex' }}><Sidebar role="client" /><div style={{ marginLeft: 220, padding: '3rem', color: '#555' }}>Chargement...</div></div>;

  const now = new Date();
  const nextSession = data?.nextSession;

  return (
    <div style={{ display: 'flex', background: '#0D0D0D', minHeight: '100vh' }}>
      <Sidebar role="client" />
      <main style={{ marginLeft: 220, flex: 1, padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '0.25rem' }}>
          Bonjour {firstName || data?.firstName} 👋
        </h1>
        <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '2.5rem' }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Prochaine session */}
        <div style={{
          background: nextSession ? 'rgba(201,168,76,0.05)' : '#141414',
          border: `1px solid ${nextSession ? 'rgba(201,168,76,0.3)' : '#1a1a1a'}`,
          padding: '2rem', marginBottom: '1.5rem',
        }}>
          <h2 style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem' }}>Prochaine session</h2>
          {nextSession ? (
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '0.5rem' }}>
                {new Date(nextSession.scheduledAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {new Date(nextSession.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                avec {nextSession.coach?.firstName} {nextSession.coach?.lastName}
              </div>
              {nextSession.zoomLink && (
                <a href={nextSession.zoomLink} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-block', padding: '0.75rem 1.5rem', background: '#C9A84C', color: '#0D0D0D',
                  fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
                }}>Rejoindre la session</a>
              )}
            </div>
          ) : (
            <div>
              <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '1rem' }}>Aucune session prévue.</p>
              <Link href="/coaches" style={{
                display: 'inline-block', padding: '0.75rem 1.5rem', border: '1px solid #333', color: '#888',
                fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
              }}>Trouver un coach →</Link>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Objectifs actifs', value: data?.activeGoals || 0 },
            { label: 'Sessions complétées', value: data?.sessionsCompleted || 0 },
            { label: 'Total investi', value: `${data?.totalSpent || 0}€` },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#141414', border: '1px solid #1a1a1a', padding: '1.25rem' }}>
              <div style={{ color: '#555', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', fontWeight: 300, color: '#FAFAF8' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Statut candidature */}
        {data?.status !== 'APPROVED' && (
          <div style={{ background: '#141414', border: '1px solid #242424', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', marginBottom: '0.75rem' }}>Votre candidature</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ padding: '0.35rem 0.75rem', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', fontSize: '0.7rem' }}>{data?.status}</div>
            </div>
            <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '0.75rem' }}>Votre candidature est en cours d'examen. Vous serez notifié par email.</p>
          </div>
        )}
      </main>
    </div>
  );
}
