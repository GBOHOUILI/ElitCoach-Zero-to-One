'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/ui/Sidebar';
import api from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'ADMIN') { router.push('/login'); return; }
    // Pour l'admin dashboard, on appelle le endpoint dédié quand il sera connecté
    // Pour l'instant on charge les données essentielles
    Promise.all([
      api.get('/admin/coaches?limit=5'),
      api.get('/admin/clients?limit=5'),
      api.get('/admin/sessions?limit=5'),
      api.get('/admin/alerts'),
    ]).then(([coaches, clients, sessions, alerts]) => {
      setData({
        pendingCoaches: coaches.data.data?.filter((c: any) => c.status === 'PENDING').length || 0,
        totalCoaches: coaches.data.total || 0,
        pendingClients: clients.data.data?.filter((c: any) => c.status === 'PENDING').length || 0,
        totalClients: clients.data.total || 0,
        totalSessions: sessions.data.total || 0,
        alerts: alerts.data.total || 0,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const kpis = data ? [
    { label: 'Coaches total', value: data.totalCoaches, sub: `${data.pendingCoaches} en attente`, href: '/admin/coaches' },
    { label: 'Clients total', value: data.totalClients, sub: `${data.pendingClients} en attente`, href: '/admin/clients' },
    { label: 'Sessions total', value: data.totalSessions, sub: '', href: '/admin/sessions' },
    { label: 'Alertes actives', value: data.alerts, sub: 'Bypass tentatives', href: '/admin/conversations', alert: data.alerts > 0 },
  ] : [];

  return (
    <div style={{ display: 'flex', background: '#0D0D0D', minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <main style={{ marginLeft: 220, flex: 1, padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '2.5rem' }}>Dashboard Admin</h1>

        {loading ? <p style={{ color: '#555' }}>Chargement...</p> : (
          <>
            {data?.alerts > 0 && (
              <div style={{ background: 'rgba(229,115,115,0.08)', border: '1px solid rgba(229,115,115,0.3)', padding: '1rem 1.5rem', marginBottom: '1.5rem', color: '#E57373', fontSize: '0.85rem' }}>
                ⚠ {data.alerts} alerte{data.alerts > 1 ? 's' : ''} de bypass détectée{data.alerts > 1 ? 's' : ''} — <Link href="/admin/conversations" style={{ color: '#E57373' }}>Voir les alertes →</Link>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {kpis.map((k) => (
                <Link key={k.label} href={k.href} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#141414', border: `1px solid ${k.alert ? 'rgba(229,115,115,0.3)' : '#1a1a1a'}`, padding: '1.25rem', transition: 'border-color 0.2s' }}>
                    <div style={{ color: '#555', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{k.label}</div>
                    <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', fontWeight: 300, color: k.alert ? '#E57373' : '#FAFAF8' }}>{k.value}</div>
                    {k.sub && <div style={{ color: '#444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{k.sub}</div>}
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#141414', border: '1px solid #1a1a1a', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555', marginBottom: '1.25rem' }}>Actions rapides</h2>
                {[
                  { href: '/admin/coaches?status=PENDING', label: `Coachs en attente (${data?.pendingCoaches})` },
                  { href: '/admin/clients?status=PENDING', label: `Clients en attente (${data?.pendingClients})` },
                  { href: '/admin/finance', label: 'Métriques financières' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} style={{ display: 'block', padding: '0.6rem 0', color: '#888', fontSize: '0.8rem', textDecoration: 'none', borderBottom: '1px solid #1a1a1a' }}>
                    {label} →
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
