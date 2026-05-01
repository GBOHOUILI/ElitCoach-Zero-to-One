export const metadata = { title: 'Politique de confidentialité — ElitCoach', description: 'Comment ElitCoach collecte, utilise et protège vos données personnelles.' };

export default function PrivacyPage() {
  const sections = [
    { title: '1. Responsable du traitement', content: `Zero to One, éditeur de la plateforme ElitCoach (elitcoach.co), est responsable du traitement de vos données personnelles. Contact : privacy@elitcoach.co` },
    { title: '2. Données collectées', content: `Nous collectons les données suivantes :\n\n• Données d'identification : nom, prénom, adresse email, mot de passe (haché)\n• Données de profil : spécialités, certifications, expérience, tarif horaire, biographie (coaches) ; objectifs, budget, disponibilités (clients)\n• Données de sessions : date, heure, durée, notes de séance, lien Zoom\n• Données de paiement : traitées via Stripe (nous ne stockons pas vos coordonnées bancaires)\n• Données de communication : messages échangés sur la plateforme\n• Données techniques : adresse IP, navigateur, logs d'accès` },
    { title: '3. Finalités et bases légales', content: `Vos données sont traitées pour :\n\n• Exécution du contrat : création et gestion de votre compte, réservation de sessions, traitement des paiements\n• Intérêt légitime : prévention de la fraude, sécurité de la plateforme, amélioration du service\n• Consentement : envoi d'emails marketing (révocable à tout moment)\n• Obligation légale : conservation des données comptables et fiscales (10 ans)` },
    { title: '4. Durée de conservation', content: `• Données de compte actif : durée de la relation contractuelle + 3 ans\n• Données de paiement : 5 ans (obligation légale)\n• Logs de connexion : 1 an\n• Données suite à suppression de compte : anonymisation immédiate, conservation 30 jours puis suppression définitive` },
    { title: '5. Destinataires des données', content: `Vos données peuvent être partagées avec :\n\n• Stripe Inc. (traitement des paiements) — politique : stripe.com/privacy\n• Supabase Inc. (hébergement base de données) — politique : supabase.com/privacy\n• Brevo SAS (emails transactionnels) — politique : brevo.com/legal/privacypolicy\n• Cloudinary Inc. (hébergement vidéos) — politique : cloudinary.com/privacy\n\nNous ne vendons jamais vos données à des tiers à des fins commerciales.` },
    { title: '6. Vos droits (RGPD)', content: `Vous disposez des droits suivants :\n\n• Droit d'accès : obtenir une copie de vos données\n• Droit de rectification : corriger vos données inexactes\n• Droit à l'effacement : demander la suppression de vos données\n• Droit à la portabilité : recevoir vos données dans un format structuré\n• Droit d'opposition : refuser certains traitements\n• Droit à la limitation : restreindre l'utilisation de vos données\n\nPour exercer ces droits : privacy@elitcoach.co. Réponse sous 30 jours.\n\nVous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).` },
    { title: '7. Sécurité', content: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées : chiffrement TLS, hachage bcrypt des mots de passe, accès restreint aux données, surveillance continue. En cas de violation de données, vous serez notifié dans les 72h si votre vie privée est menacée.` },
    { title: '8. Cookies', content: `Nous utilisons uniquement des cookies strictement nécessaires au fonctionnement du service (session, authentification). Aucun cookie publicitaire ou de tracking tiers. Consulter notre politique cookies pour plus d'informations.` },
    { title: '9. Modifications', content: `Cette politique peut être mise à jour. En cas de modification substantielle, vous serez notifié par email 30 jours à l'avance. La version en vigueur est celle publiée sur cette page.` },
  ];

  return (
    <main style={{ background: 'var(--dark)', minHeight: '100vh', padding: '4rem 1rem' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 300, textAlign: 'center', marginBottom: '0.5rem' }}>ElitCoach</h1>
        </a>
        <div style={{ width: 40, height: 1, background: 'var(--gold)', margin: '0 auto 3rem' }} />

        <h2 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Politique de confidentialité</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '3rem' }}>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {sections.map((s, i) => (
            <div key={i}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--gold)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>{s.title}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{s.content}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--dark-border)', textAlign: 'center' }}>
          <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'none' }}>← Retour à l'accueil</a>
          <span style={{ color: 'var(--dark-border)', margin: '0 1rem' }}>|</span>
          <a href="/legal/terms" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'none' }}>CGU</a>
          <span style={{ color: 'var(--dark-border)', margin: '0 1rem' }}>|</span>
          <a href="/legal/cookies" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'none' }}>Cookies</a>
        </div>
      </div>
    </main>
  );
}
