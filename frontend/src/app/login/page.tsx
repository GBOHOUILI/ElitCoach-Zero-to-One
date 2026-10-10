'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) { const role = localStorage.getItem('userRole'); redirect(role); }
  }, []);

  function redirect(role: string | null) {
    if (role === 'COACH') router.push('/dashboard/coach');
    else if (role === 'CLIENT') router.push('/dashboard/client');
    else if (role === 'ADMIN') router.push('/admin');
    else router.push('/');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userFirstName', data.user.firstName);
      document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=${7 * 24 * 3600}; SameSite=Strict`;
      redirect(data.user.role);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 403) setError('Vérifiez votre email avant de vous connecter.');
      else if (Array.isArray(msg)) setError(msg[0]);
      else setError(msg || 'Identifiants invalides.');
    } finally { setLoading(false); }
  }

  const LBL: React.CSSProperties = {
    fontSize: '0.6875rem', letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'var(--text-2)', display: 'block', marginBottom: '0.5rem',
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Panneau gauche — branding */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '3rem', background: 'var(--surface)', borderRight: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Orb */}
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 300, color: 'var(--text)' }}>
            ElitCoach
          </span>
        </Link>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: 32, height: 1, background: 'var(--gold)', marginBottom: '2rem', opacity: 0.6 }} />
          <blockquote style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 300,
            color: 'var(--text)', lineHeight: 1.3, marginBottom: '1.5rem',
          }}>
            "La qualité est un choix,<br />pas un hasard."
          </blockquote>
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>
            Double sélection. Standards élevés.
          </p>
        </div>

        <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', letterSpacing: '0.1em' }}>
          © {new Date().getFullYear()} Zero to One
        </div>
      </div>

      {/* Panneau droit — formulaire */}
      <div style={{
        width: 460, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '3rem 3.5rem',
      }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Connexion
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>
            Bon retour sur ElitCoach.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={LBL}>Email</label>
            <input type="email" className="input-dark" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vous@exemple.com" required autoComplete="email" />
          </div>

          <div>
            <label style={LBL}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} className="input-dark"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required autoComplete="current-password"
                style={{ paddingRight: '3.5rem' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer',
                  fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                {showPassword ? 'Cacher' : 'Voir'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              color: '#E57373', fontSize: '0.85rem', padding: '0.8rem 1rem',
              background: 'rgba(229,115,115,0.07)', border: '1px solid rgba(229,115,115,0.18)',
              borderRadius: 2,
            }}>{error}</div>
          )}

          <button type="submit" className="btn-gold" disabled={loading} style={{ marginTop: '0.25rem' }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/forgot-password" style={{ color: 'var(--text-2)', fontSize: '0.8rem', textDecoration: 'none' }}>
            Mot de passe oublié ?
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ color: 'var(--text-3)', fontSize: '0.65rem', letterSpacing: '0.15em' }}>OU</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link href="/register/coach" className="btn-ghost">
            Je suis coach — Candidater
          </Link>
          <Link href="/register/client" className="btn-ghost">
            Je cherche un coach — Candidater
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/admin" style={{
            color: 'var(--text-3)', fontSize: '0.7rem',
            letterSpacing: '0.1em', textDecoration: 'none',
          }}>accès admin</Link>
        </div>
      </div>
    </main>
  );
}
