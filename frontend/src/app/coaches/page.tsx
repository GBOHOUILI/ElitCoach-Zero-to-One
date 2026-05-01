'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ specialty: '', minRate: 0, maxRate: 0 });
  const [suggested, setSuggested] = useState<any[]>([]);

  const SPECIALTIES = ['Business', 'Leadership', 'Life Coaching', 'Confiance en soi', 'Santé & Bien-être', 'Carrière'];

  useEffect(() => {
    fetchCoaches();
    fetchSuggested();
  }, [page, filters]);

  async function fetchCoaches() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (filters.specialty) params.set('specialty', filters.specialty);
      if (filters.minRate) params.set('minRate', String(filters.minRate));
      if (filters.maxRate) params.set('maxRate', String(filters.maxRate));
      const { data } = await api.get(`/coaches?${params}`);
      setCoaches(data.data || []);
      setTotal(data.total || 0);
    } catch { setCoaches([]); }
    setLoading(false);
  }

  async function fetchSuggested() {
    try {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('userRole');
      if (token && role === 'CLIENT') {
        const { data } = await api.get('/coaches/suggested');
        setSuggested(data.coaches || []);
      }
    } catch {}
  }

  return (
    <main style={{ background: '#0D0D0D', minHeight: '100vh', paddingTop: '5rem' }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.5rem', fontWeight: 300, color: '#FAFAF8', textDecoration: 'none' }}>ElitCoach</Link>
        <Link href="/login" style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.1em', textDecoration: 'none' }}>Connexion</Link>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>

        {/* Filtres */}
        <aside>
          <div style={{ background: '#141414', border: '1px solid #242424', padding: '1.5rem', position: 'sticky', top: '5rem' }}>
            <h2 style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1.5rem' }}>Filtres</h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '0.75rem' }}>Spécialité</label>
              {SPECIALTIES.map(s => (
                <button key={s} type="button" onClick={() => setFilters(f => ({ ...f, specialty: f.specialty === s ? '' : s }))} style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '0.4rem 0',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: filters.specialty === s ? '#C9A84C' : '#555',
                  fontSize: '0.8rem',
                }}>{filters.specialty === s ? '▸ ' : ''}{s}</button>
              ))}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '0.5rem' }}>Tarif max (€/h)</label>
              <input type="range" min={50} max={500} step={25} value={filters.maxRate || 500}
                onChange={e => setFilters(f => ({ ...f, maxRate: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: '#C9A84C' }} />
              <span style={{ color: '#C9A84C', fontSize: '0.8rem' }}>{filters.maxRate || 500}€</span>
            </div>

            <button type="button" onClick={() => { setFilters({ specialty: '', minRate: 0, maxRate: 0 }); setPage(1); }} style={{
              width: '100%', padding: '0.5rem', background: 'none', border: '1px solid #333',
              color: '#555', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em',
            }}>Réinitialiser</button>
          </div>
        </aside>

        {/* Résultats */}
        <div>
          {/* Suggestions */}
          {suggested.length > 0 && (
            <div style={{ border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.03)', padding: '1.5rem', marginBottom: '2rem' }}>
              <p style={{ color: '#C9A84C', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>✦ Recommandés pour vous</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {suggested.slice(0, 3).map(({ coach, matchScore }) => (
                  <Link key={coach.id} href={`/coaches/${coach.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#141414', border: '1px solid #242424', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#FAFAF8', fontSize: '0.875rem' }}>{coach.firstName} {coach.lastName}</span>
                        <span style={{ color: '#C9A84C', fontSize: '0.7rem' }}>{matchScore}%</span>
                      </div>
                      <div style={{ color: '#555', fontSize: '0.75rem' }}>{coach.specialties?.[0]}</div>
                      <div style={{ color: '#C9A84C', fontSize: '0.8rem', marginTop: '0.5rem' }}>{coach.hourlyRate}€/h</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '1.5rem' }}>{total} coach{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}</p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#555' }}>Chargement...</div>
          ) : coaches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#555' }}>
              <p>Aucun coach ne correspond à ces filtres.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {coaches.map((c) => (
                <Link key={c.id} href={`/coaches/${c.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#141414', border: '1px solid #242424', padding: '1.75rem', transition: 'border-color 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9A84C')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#242424')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontFamily: 'Cormorant Garamond', fontSize: '1.1rem' }}>
                        {c.firstName?.[0]}{c.lastName?.[0]}
                      </div>
                      {c.isVerified && <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', fontSize: '0.55rem', letterSpacing: '0.15em' }}>✓ VÉRIFIÉ</span>}
                    </div>
                    <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.1rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '0.25rem' }}>{c.firstName} {c.lastName}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                      {c.specialties?.slice(0, 2).map((s: string) => (
                        <span key={s} style={{ padding: '0.2rem 0.5rem', border: '1px solid #333', color: '#555', fontSize: '0.65rem' }}>{s}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: '#555' }}>{c.yearsExperience} ans exp.</span>
                      <span style={{ color: '#C9A84C', fontWeight: 500 }}>{c.hourlyRate}€/h</span>
                    </div>
                    {c.score > 0 && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#444', marginBottom: '0.3rem' }}>
                          <span>Score ElitCoach</span><span style={{ color: '#C9A84C' }}>{c.score}/1000</span>
                        </div>
                        <div style={{ height: 2, background: '#1a1a1a', borderRadius: 1 }}>
                          <div style={{ height: '100%', width: `${c.score / 10}%`, background: '#C9A84C', borderRadius: 1 }} />
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {total > 12 && (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
              {Array.from({ length: Math.ceil(total / 12) }, (_, i) => (
                <button key={i} type="button" onClick={() => setPage(i + 1)} style={{
                  width: 36, height: 36, border: `1px solid ${page === i + 1 ? '#C9A84C' : '#333'}`,
                  background: page === i + 1 ? 'rgba(201,168,76,0.1)' : 'none',
                  color: page === i + 1 ? '#C9A84C' : '#555', cursor: 'pointer', fontSize: '0.8rem',
                }}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
