export const metadata = { title: 'Conditions Générales d\'Utilisation — ElitCoach' };

export default function TermsPage() {
  const sections = [
    { title: '1. Objet', content: 'ElitCoach est une plateforme de mise en relation entre coaches professionnels et clients, éditée par Zero to One. Les présentes CGU régissent l\'utilisation de la plateforme accessible sur elitcoach.co.' },
    { title: '2. Inscription et sélection', content: 'L\'accès à ElitCoach est conditionné à une sélection.\n\nCoaches : candidature en 5 étapes (informations, expertise, tarifs, vidéo, références) suivie d\'une évaluation en 5 étapes (Pending → Screening → Interview → Test → Approved/Rejected). La sélection est discrétionnaire.\n\nClients : scoring automatique à l\'inscription sur 4 critères (objectif, disponibilité, budget, historique coaching). Score minimum de 60/100 requis. La décision est définitive mais peut être réexaminée sur demande motivée.' },
    { title: '3. Utilisation de la plateforme', content: 'L\'utilisateur s\'engage à :\n\n• Fournir des informations exactes et à jour\n• Ne pas partager ses coordonnées personnelles dans la messagerie (téléphone, email, WhatsApp, etc.)\n• Respecter la propriété intellectuelle des autres utilisateurs\n• Ne pas utiliser la plateforme à des fins illicites\n• Maintenir la confidentialité de ses identifiants de connexion\n\nLes communications hors plateforme visant à contourner les commissions sont strictement interdites et peuvent entraîner un ban définitif.' },
    { title: '4. Sessions et paiements', content: 'Réservation : le client sélectionne un créneau et autorise un paiement par carte (pré-autorisation Stripe). Le montant est bloqué mais non débité.\n\nConfirmation : après confirmation du paiement par Stripe, la session est confirmée et un lien Zoom est généré automatiquement.\n\nCompletion : le coach marque la session comme terminée → le montant est capturé → commission ElitCoach de 17% → reversement coach de 83%.\n\nPolitique d\'annulation :\n• Plus de 24h avant : remboursement 100%\n• Entre 4h et 24h avant : remboursement 50%\n• Moins de 4h avant : remboursement 0%\n\nLes paiements sont traités par Stripe, Inc. ElitCoach ne stocke aucune donnée bancaire.' },
    { title: '5. Commission et tarification', content: 'ElitCoach perçoit une commission de 17% sur chaque session complétée, déduite automatiquement du montant total. Les coaches reçoivent 83% du tarif affiché. Les tarifs sont affichés TTC (TVA non applicable pour les coaches sous régime micro-entreprise). Les coaches facturent eux-mêmes leurs clients et sont responsables de leurs obligations fiscales.' },
    { title: '6. Messagerie et confidentialité des échanges', content: 'Les messages échangés sur ElitCoach sont conservés pendant toute la durée de la relation et 1 an après. ElitCoach se réserve le droit de lire les conversations à des fins de modération et de sécurité. Les tentatives de partage de coordonnées personnelles sont bloquées automatiquement et génèrent une alerte. Trois tentatives constituent un motif de suspension.' },
    { title: '7. Responsabilité', content: 'ElitCoach agit comme intermédiaire et n\'est pas partie aux contrats entre coaches et clients. Chaque coach est un prestataire indépendant. ElitCoach ne peut être tenu responsable de la qualité des sessions, des résultats obtenus, ni des dommages indirects. La responsabilité d\'ElitCoach est limitée au montant des commissions perçues dans le mois précédant le litige.' },
    { title: '8. Suspension et résiliation', content: 'ElitCoach peut suspendre ou résilier un compte en cas de :\n• Violation des présentes CGU\n• Comportement abusif envers d\'autres utilisateurs\n• Tentatives répétées de contournement de la plateforme\n• Fraude ou fausse identité\n\nEn cas de résiliation, les sessions déjà payées sont remboursées dans leur intégralité. Les données sont anonymisées conformément au RGPD.\n\nL\'utilisateur peut résilier son compte à tout moment depuis les paramètres de son profil.' },
    { title: '9. Droit applicable et litiges', content: 'Les présentes CGU sont soumises au droit français. En cas de litige, une tentative de résolution amiable sera engagée dans les 30 jours. À défaut, les tribunaux compétents sont ceux du ressort de Paris. Les consommateurs peuvent également recourir à un médiateur de la consommation agréé.' },
    { title: '10. Modifications', content: 'ElitCoach se réserve le droit de modifier les présentes CGU. Toute modification substantielle sera notifiée par email 30 jours à l\'avance. L\'utilisation continue de la plateforme après ce délai vaut acceptation des nouvelles CGU.' },
  ];

  return (
    <main style={{ background: 'var(--dark)', minHeight: '100vh', padding: '4rem 1rem' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 300, textAlign: 'center', marginBottom: '0.5rem' }}>ElitCoach</h1>
        </a>
        <div style={{ width: 40, height: 1, background: 'var(--gold)', margin: '0 auto 3rem' }} />
        <h2 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Conditions Générales d'Utilisation</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '3rem' }}>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {sections.map((s, i) => (
            <div key={i}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--gold)', marginBottom: '0.75rem' }}>{s.title}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{s.content}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--dark-border)', textAlign: 'center' }}>
          <a href="/legal/privacy" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'none' }}>Confidentialité</a>
          <span style={{ color: 'var(--dark-border)', margin: '0 1rem' }}>|</span>
          <a href="/legal/cookies" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'none' }}>Cookies</a>
        </div>
      </div>
    </main>
  );
}
