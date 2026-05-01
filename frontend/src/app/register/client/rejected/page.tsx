export default function RejectedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <h1 className="font-display" style={{ fontSize: '2.4rem', fontWeight: 300, marginBottom: '1rem', color: '#FAFAF8' }}>
          Candidature analysée
        </h1>
        <div style={{ width: 48, height: 1, background: 'var(--dark-border)', margin: '0 auto 1.5rem' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.9 }}>
          Après analyse de votre candidature, le coaching ne semble pas être la bonne étape pour vous en ce moment.<br /><br />
          Ce n'est pas un jugement définitif — revenez lorsque le moment sera plus propice.
        </p>
      </div>
    </main>
  );
}
