export default function CoachSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>◈</div>
        <h1 className="font-display" style={{ fontSize: '2.4rem', fontWeight: 300, marginBottom: '1rem' }}>
          Candidature soumise
        </h1>
        <div style={{ width: 48, height: 1, background: 'var(--gold)', margin: '0 auto 1.5rem' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.9, marginBottom: '2rem' }}>
          Vérifiez votre email pour activer votre compte.<br />
          Notre équipe examine votre candidature sous 48h.
        </p>
        <a href="/login" style={{
          display: 'inline-block', padding: '0.85rem 2.5rem',
          border: '1px solid var(--gold)', color: 'var(--gold)',
          fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          textDecoration: 'none',
        }}>Retour à la connexion</a>
      </div>
    </main>
  );
}
