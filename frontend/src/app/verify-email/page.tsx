'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('Token manquant.'); return; }
    api.get(`/auth/verify-email?token=${token}`)
      .then(() => setStatus('success'))
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Lien invalide ou expiré.');
      });
  }, [token]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>

        <h1 className="font-display" style={{ fontSize: '2.4rem', fontWeight: 300, marginBottom: '2rem' }}>
          ElitCoach
        </h1>

        <div className="card-dark" style={{ padding: '3rem 2.5rem' }}>

          {status === 'loading' && (
            <>
              <div style={{
                width: 48, height: 48, border: '2px solid var(--dark-border)',
                borderTop: '2px solid var(--gold)', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem',
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                Vérification en cours...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem', fontSize: '1.5rem',
              }}>✓</div>
              <h2 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 300, marginBottom: '0.75rem' }}>
                Email vérifié
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                Votre compte est activé. Vous pouvez vous connecter.
              </p>
              <Link href="/login" className="btn-gold" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                Se connecter
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(229,115,115,0.1)', border: '1px solid rgba(229,115,115,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem', fontSize: '1.5rem', color: '#E57373',
              }}>✕</div>
              <h2 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 300, marginBottom: '0.75rem' }}>
                Lien invalide
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                {message}
              </p>
              <Link href="/login" style={{
                color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', textDecoration: 'none',
              }}>
                Retour à la connexion
              </Link>
            </>
          )}

        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
