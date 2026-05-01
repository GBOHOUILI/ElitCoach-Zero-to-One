export default function PendingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>◈</div>
        <h1 className="font-display" style={{ fontSize: '2.4rem', fontWeight: 300, marginBottom: '1rem' }}>
          Candidature reçue
        </h1>
        <div style={{ width: 48, height: 1, background: 'var(--gold)', margin: '0 auto 1.5rem' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.9 }}>
          Votre candidature est en cours d'analyse.<br />
          Vous recevrez une réponse sous 48h.
        </p>
      </div>
    </main>
  );
}
