'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function CoachProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [coach, setCoach] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/coaches/${id}`).then(r => setCoach(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main style={{ background: '#FAFAF8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#999' }}>Chargement...</p></main>;
  if (!coach) return <main style={{ background: '#FAFAF8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#999' }}>Coach introuvable.</p></main>;

  const avgRating = coach.avgRating || 0;

  return (
    <main style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{ background: '#0D0D0D', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/coaches" style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', fontWeight: 300, color: '#FAFAF8', textDecoration: 'none' }}>← Coachs</Link>
        <Link href={`/coaches/${id}/book`} style={{ padding: '0.6rem 1.5rem', background: '#C9A84C', color: '#0D0D0D', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Réserver</Link>
      </nav>

      {/* Hero */}
      <section style={{ background: '#0D0D0D', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'center' }}>
          <div style={{ width: '100%', aspectRatio: '1', maxWidth: 200, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '2px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond', fontSize: '4rem', fontWeight: 300, color: '#C9A84C' }}>
            {coach.firstName?.[0]}{coach.lastName?.[0]}
          </div>
          <div>
            {coach.isVerified && <span style={{ padding: '0.25rem 0.75rem', border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C', fontSize: '0.65rem', letterSpacing: '0.2em', display: 'inline-block', marginBottom: '1rem' }}>✓ VERIFIED COACH</span>}
            <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '3rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '0.5rem' }}>{coach.firstName} {coach.lastName}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {coach.specialties?.map((s: string) => <span key={s} style={{ padding: '0.25rem 0.75rem', border: '1px solid #333', color: '#888', fontSize: '0.75rem' }}>{s}</span>)}
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#C9A84C' }}>{'★'.repeat(Math.round(avgRating))} {avgRating.toFixed(1)} ({coach.reviewCount} avis)</span>
              <span style={{ color: '#888' }}>{coach.yearsExperience} ans d'expérience</span>
              <span style={{ color: '#C9A84C', fontFamily: 'Cormorant Garamond', fontSize: '1.5rem' }}>{coach.hourlyRate}€<span style={{ fontSize: '0.9rem', color: '#888' }}>/session</span></span>
            </div>
            <Link href={`/coaches/${id}/book`} style={{ display: 'inline-block', padding: '1rem 2.5rem', background: '#C9A84C', color: '#0D0D0D', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Réserver une session</Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          {/* Bio */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.75rem', fontWeight: 300, marginBottom: '1rem' }}>À propos</h2>
            <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.85 }}>{coach.bio}</p>
          </section>

          {/* Vidéo */}
          {coach.videoUrl && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.75rem', fontWeight: 300, marginBottom: '1rem' }}>Ma présentation</h2>
              {coach.videoUrl.includes('youtube.com') ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <iframe src={`https://www.youtube.com/embed/${new URLSearchParams(coach.videoUrl.split('?')[1]).get('v')}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} allowFullScreen />
                </div>
              ) : <a href={coach.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C' }}>Voir la vidéo →</a>}
            </section>
          )}

          {/* Avis */}
          {coach.reviews?.length > 0 && (
            <section>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.75rem', fontWeight: 300, marginBottom: '1.5rem' }}>Avis clients</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {coach.reviews.map((r: any) => (
                  <div key={r.id} style={{ padding: '1.25rem', border: '1px solid #E8E8E0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#C9A84C', fontSize: '0.9rem' }}>{'★'.repeat(r.rating)}</span>
                      <span style={{ color: '#999', fontSize: '0.75rem' }}>{new Date(r.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {r.comment && <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.7 }}>{r.comment}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ padding: '1.5rem', border: '1px solid #E8E8E0', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', marginBottom: '1rem' }}>Certifications</h3>
            {coach.certifications?.map((c: string) => (
              <div key={c} style={{ padding: '0.4rem 0', borderBottom: '1px solid #F0F0E8', color: '#555', fontSize: '0.8rem' }}>{c}</div>
            ))}
          </div>
          {coach.score > 0 && (
            <div style={{ padding: '1.5rem', border: '1px solid #E8E8E0' }}>
              <h3 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', marginBottom: '1rem' }}>Score ElitCoach</h3>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', fontWeight: 300, color: '#C9A84C' }}>{coach.score}<span style={{ fontSize: '1rem', color: '#999' }}>/1000</span></div>
              <div style={{ height: 4, background: '#F0F0E8', borderRadius: 2, marginTop: '0.75rem' }}>
                <div style={{ height: '100%', width: `${coach.score / 10}%`, background: '#C9A84C', borderRadius: 2 }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
