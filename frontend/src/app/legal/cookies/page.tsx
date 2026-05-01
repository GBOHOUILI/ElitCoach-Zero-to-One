export const metadata = { title: 'Politique de Cookies — ElitCoach' };

export default function CookiesPage() {
  return (
    <main style={{ background: 'var(--dark)', minHeight: '100vh', padding: '4rem 1rem' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h1 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Politique de Cookies</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '3rem' }}>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        {[
          { title: 'Cookies strictement nécessaires', content: 'Ces cookies sont indispensables au fonctionnement d\'ElitCoach. Ils ne peuvent pas être désactivés.\n\n• refreshToken : authentification, durée 7 jours\n• session_id : maintien de la session, durée de la session\n\nBase légale : intérêt légitime (fonctionnement du service).' },
          { title: 'Cookies analytiques', content: 'Nous n\'utilisons pas de cookies analytiques tiers (Google Analytics, etc.). Nos statistiques internes sont calculées à partir des données de nos serveurs, sans dépôt de cookies.' },
          { title: 'Cookies publicitaires', content: 'ElitCoach ne dépose aucun cookie publicitaire ou de tracking. Nous ne participons à aucun réseau publicitaire.' },
          { title: 'Gestion des cookies', content: 'Les cookies nécessaires ne peuvent pas être refusés car ils sont indispensables au service. Vous pouvez supprimer les cookies à tout moment depuis les paramètres de votre navigateur. La suppression du cookie refreshToken vous déconnectera.' },
          { title: 'Contact', content: 'Pour toute question sur nos cookies : privacy@elitcoach.co' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--gold)', marginBottom: '0.75rem' }}>{s.title}</h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{s.content}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
