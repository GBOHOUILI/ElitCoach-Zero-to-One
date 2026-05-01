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

  // Guard : si déjà connecté, redirect
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const role = localStorage.getItem('userRole');
      redirect(role);
    }
  }, []);

  function redirect(role: string | null) {
    if (role === 'COACH') router.push('/dashboard/coach');
    else if (role === 'CLIENT') router.push('/dashboard/client');
    else if (role === 'ADMIN') router.push('/admin');
    else router.push('/');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userFirstName', data.user.firstName);
      // Stocker refreshToken dans cookie
      document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=${7 * 24 * 3600}; SameSite=Strict`;
      redirect(data.user.role);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 403) {
        setError('Vérifiez votre email avant de vous connecter.');
      } else if (Array.isArray(msg)) {
        setError(msg[0]);
      } else {
        setError(msg || 'Identifiants invalides.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--dark)' }}>

      {/* Cercle décoratif flou */}
      <div style={{
        position: 'fixed', top: '20%', right: '10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display" style={{
            fontSize: '2.8rem',
            fontWeight: 300,
            color: '#FAFAF8',
            letterSpacing: '0.02em',
            lineHeight: 1,
          }}>
            ElitCoach
          </h1>
          <p style={{
            color: 'var(--gold)',
            fontSize: '0.7rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginTop: '0.4rem',
            fontWeight: 400,
          }}>
            by Zero to One
          </p>
        </div>

        {/* Card */}
        <div className="card-dark" style={{ padding: '2.5rem' }}>

          <h2 style={{
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '2rem',
          }}>
            Connexion
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div>
              <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Email
              </label>
              <input
                type="email"
                className="input-dark"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-dark"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    fontSize: '0.75rem', letterSpacing: '0.1em',
                  }}
                >
                  {showPassword ? 'CACHER' : 'VOIR'}
                </button>
              </div>
            </div>

            {error && (
              <p style={{
                color: '#E57373', fontSize: '0.8rem',
                padding: '0.75rem 1rem',
                background: 'rgba(229,115,115,0.08)',
                border: '1px solid rgba(229,115,115,0.2)',
              }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn-gold" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

          </form>

          {/* Mot de passe oublié */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/forgot-password" style={{
              color: 'var(--text-muted)', fontSize: '0.75rem',
              letterSpacing: '0.05em', textDecoration: 'none',
            }}>
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Séparateur */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            margin: '1.75rem 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--dark-border)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.15em' }}>OU</span>
            <div style={{ flex: 1, height: 1, background: 'var(--dark-border)' }} />
          </div>

          {/* Liens inscription */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <Link href="/register/coach" style={{
              display: 'block', textAlign: 'center',
              padding: '0.75rem',
              border: '1px solid var(--dark-border)',
              color: 'var(--text)',
              fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--dark-border)')}
            >
              Je suis coach — Candidater
            </Link>
            <Link href="/register/client" style={{
              display: 'block', textAlign: 'center',
              padding: '0.75rem',
              border: '1px solid var(--dark-border)',
              color: 'var(--text)',
              fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--dark-border)')}
            >
              Je cherche un coach — Candidater
            </Link>
          </div>

        </div>

        {/* Accès admin discret */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/admin/login" style={{
            color: '#333', fontSize: '0.65rem',
            letterSpacing: '0.1em', textDecoration: 'none',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            onMouseLeave={e => (e.currentTarget.style.color = '#333')}
          >
            accès admin
          </Link>
        </div>

      </div>
    </main>
  );
}
