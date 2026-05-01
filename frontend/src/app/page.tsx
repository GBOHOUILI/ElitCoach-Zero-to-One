import Link from 'next/link';

export const metadata = {
  title: 'ElitCoach — Coaching Premium avec Double Sélection',
  description: 'La seule plateforme qui sélectionne aussi rigoureusement les clients que les coaches.',
};

const COACHES = [
  { name: 'Sophie L.', specialty: 'Business & Entrepreneuriat', rate: 150, score: 892, rating: 4.9, reviews: 47, verified: true },
  { name: 'Marc D.', specialty: 'Leadership & Management', rate: 180, score: 941, rating: 5.0, reviews: 38, verified: true },
  { name: 'Amina K.', specialty: 'Confiance en soi & Carrière', rate: 120, score: 856, rating: 4.8, reviews: 62, verified: true },
];

const COMPARE = [
  { feature: 'Sélection des coaches', elitcoach: '5 étapes manuelles', betterup: 'Algorithmique', noomii: 'Inscription libre' },
  { feature: 'Sélection des clients', elitcoach: 'Scoring automatique', betterup: 'Aucune', noomii: 'Aucune' },
  { feature: 'Suivi objectifs', elitcoach: '% progression + check-ins', betterup: 'Basique', noomii: 'Non' },
  { feature: 'Commission', elitcoach: '17%', betterup: 'Non communiqué', noomii: '20-35%' },
  { feature: 'Score crédibilité', elitcoach: '0–1000 algorithme', betterup: 'Étoiles', noomii: 'Étoiles' },
  { feature: 'Messagerie sécurisée', elitcoach: 'Anti-bypass intégré', betterup: 'Standard', noomii: 'Email' },
];

export default function HomePage() {
  return (
    <main style={{ background: '#FAFAF8', color: '#0D0D0D' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem',
      }}>
        <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.5rem', fontWeight: 300, color: '#FAFAF8' }}>
          ElitCoach
        </span>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#coaches" style={{ color: '#888', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>Coachs</a>
          <a href="#how" style={{ color: '#888', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>Comment ça marche</a>
          <Link href="/login" style={{ color: '#888', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>Connexion</Link>
          <Link href="/register/coach" style={{
            padding: '0.5rem 1.25rem', background: '#C9A84C', color: '#0D0D0D',
            fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
          }}>Candidater</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        background: '#0D0D0D', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '8rem 2rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 760, position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', padding: '0.35rem 1rem', marginBottom: '2rem',
            border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C',
            fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>
            by Zero to One — #buildinpublic
          </div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 300, lineHeight: 1.05,
            color: '#FAFAF8', marginBottom: '1.5rem', letterSpacing: '-0.02em',
          }}>
            Le coaching qui<br />sélectionne les deux<br />
            <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>côtés de la table</span>
          </h1>
          <p style={{ color: '#888', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Coaches validés en 5 étapes. Clients scorés à l'inscription.
            Une plateforme où la qualité n'est pas négociable.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register/coach" style={{
              padding: '1rem 2.5rem', background: '#C9A84C', color: '#0D0D0D',
              fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
            }}>Je suis coach</Link>
            <Link href="/register/client" style={{
              padding: '1rem 2.5rem', border: '1px solid #333', color: '#FAFAF8',
              fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
            }}>Je cherche un coach</Link>
          </div>
          <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap' }}>
            {[['17%', 'Commission seulement'], ['5 étapes', 'Validation coach'], ['0-1000', 'Score crédibilité']].map(([v, l]) => (
              <div key={v} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', fontWeight: 300, color: '#C9A84C' }}>{v}</div>
                <div style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLÈME */}
      <section style={{ padding: '6rem 2rem', background: '#FAFAF8' }} id="how">
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Le problème</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, marginBottom: '3rem', lineHeight: 1.2 }}>
            Le coaching souffre d'un problème de qualité<br />des deux côtés
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { emoji: '😤', title: 'Trop de coaches non qualifiés', desc: '80% des "coaches" n\'ont aucune certification sérieuse. Les plateformes acceptent tout le monde.' },
              { emoji: '🎯', title: 'Des clients pas prêts', desc: 'Un client sans objectif clair ou sans disponibilité ruine l\'expérience du coach et ses statistiques.' },
              { emoji: '💸', title: 'Commissions opaques', desc: 'Certaines plateformes prennent jusqu\'à 35% sans transparence. Les coaches ne savent pas ce qu\'ils touchent réellement.' },
            ].map((item) => (
              <div key={item.title} style={{ padding: '2rem', border: '1px solid #E8E8E0', textAlign: 'left' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.emoji}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION COACHS */}
      <section style={{ padding: '6rem 2rem', background: '#0D0D0D' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Pour les coaches</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '2rem', lineHeight: 1.2 }}>
                Un pipeline de validation en 5 étapes
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Candidature & Profil complet', 'Examen du dossier (48h)', 'Entretien visio', 'Session test avec client réel', 'Approbation & Badge Verified'].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: i < 4 ? 'rgba(201,168,76,0.1)' : '#C9A84C',
                      border: `1px solid ${i < 4 ? 'rgba(201,168,76,0.3)' : '#C9A84C'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: i < 4 ? '#C9A84C' : '#0D0D0D', fontSize: '0.7rem', fontWeight: 600,
                    }}>{i + 1}</div>
                    <span style={{ color: i === 4 ? '#FAFAF8' : '#888', fontSize: '0.875rem', paddingTop: '0.3rem' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { v: '83%', l: 'Du tarif reversé au coach' },
                { v: 'Badge', l: 'Verified Coach visible sur profil' },
                { v: 'Score', l: 'Crédibilité 0-1000 automatique' },
                { v: 'Zéro', l: 'Frais d\'inscription ou d\'abonnement' },
              ].map(({ v, l }) => (
                <div key={v} style={{
                  padding: '1.25rem 1.5rem', border: '1px solid #242424',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ color: '#888', fontSize: '0.875rem' }}>{l}</span>
                  <span style={{ color: '#C9A84C', fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', fontWeight: 300 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION CLIENTS */}
      <section style={{ padding: '6rem 2rem', background: '#FAFAF8' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { q: 'Objectif précis en 3 mois ?', desc: 'Un objectif vague = un coaching vague.' },
                { q: 'Disponibilité hebdomadaire ?', desc: 'Minimum 2h/semaine pour progresser réellement.' },
                { q: 'Budget mensuel ?', desc: 'Le coaching est un investissement, pas un coût.' },
                { q: 'Pourquoi maintenant ?', desc: 'Le bon moment fait la différence.' },
              ].map(({ q, desc }) => (
                <div key={q} style={{ padding: '1.25rem', border: '1px solid #E8E8E0' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{q}</div>
                  <div style={{ color: '#666', fontSize: '0.8rem' }}>{desc}</div>
                </div>
              ))}
            </div>
            <div>
              <p style={{ color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Pour les clients</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', fontWeight: 300, marginBottom: '1.5rem', lineHeight: 1.2 }}>
                Nous sélectionnons les clients aussi soigneusement que les coaches
              </h2>
              <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                4 critères, 25 points chacun. Score minimum 60/100.
                Si le coaching n'est pas la bonne étape pour vous en ce moment, nous vous le disons directement.
              </p>
              <Link href="/register/client" style={{
                display: 'inline-block', padding: '0.85rem 2rem',
                background: '#C9A84C', color: '#0D0D0D',
                fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
              }}>Tester ma candidature</Link>
            </div>
          </div>
        </div>
      </section>

      {/* COACHES EXEMPLE */}
      <section style={{ padding: '6rem 2rem', background: '#0D0D0D' }} id="coaches">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Nos coaches</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', fontWeight: 300, color: '#FAFAF8' }}>
              Chaque coach est vérifié manuellement
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {COACHES.map((c) => (
              <div key={c.name} style={{
                background: '#141414', border: '1px solid #242424', padding: '1.75rem',
                transition: 'border-color 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#C9A84C', fontFamily: 'Cormorant Garamond', fontSize: '1.2rem',
                  }}>{c.name[0]}</div>
                  {c.verified && (
                    <span style={{
                      padding: '0.25rem 0.6rem', background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C',
                      fontSize: '0.6rem', letterSpacing: '0.15em',
                    }}>✓ VÉRIFIÉ</span>
                  )}
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.2rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '0.25rem' }}>{c.name}</div>
                <div style={{ color: '#555', fontSize: '0.75rem', marginBottom: '1rem' }}>{c.specialty}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#888' }}>{'★'.repeat(Math.round(c.rating))} <span style={{ color: '#555' }}>({c.reviews})</span></span>
                  <span style={{ color: '#C9A84C' }}>{c.rate}€/h</span>
                </div>
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#555' }}>
                  <span>Score ElitCoach</span>
                  <span style={{ color: '#C9A84C' }}>{c.score}/1000</span>
                </div>
                <div style={{ height: 2, background: '#1a1a1a', marginTop: '0.4rem', borderRadius: 1 }}>
                  <div style={{ height: '100%', width: `${c.score / 10}%`, background: '#C9A84C', borderRadius: 1 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/coaches" style={{
              padding: '0.85rem 2rem', border: '1px solid #333', color: '#888',
              fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
            }}>Voir tous les coaches →</Link>
          </div>
        </div>
      </section>

      {/* COMPARATIF */}
      <section style={{ padding: '6rem 2rem', background: '#FAFAF8' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', fontWeight: 300, marginBottom: '1rem' }}>
              Pourquoi ElitCoach ?
            </h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#999', borderBottom: '2px solid #E8E8E0', fontWeight: 400 }}>Critère</th>
                <th style={{ textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#C9A84C', borderBottom: '2px solid #C9A84C', fontWeight: 500 }}>ElitCoach</th>
                <th style={{ textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#999', borderBottom: '2px solid #E8E8E0', fontWeight: 400 }}>BetterUp</th>
                <th style={{ textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#999', borderBottom: '2px solid #E8E8E0', fontWeight: 400 }}>Noomii</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #E8E8E0' }}>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#444' }}>{row.feature}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', textAlign: 'center', color: '#C9A84C', fontWeight: 500, background: 'rgba(201,168,76,0.04)' }}>{row.elitcoach}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', textAlign: 'center', color: '#999' }}>{row.betterup}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', textAlign: 'center', color: '#999' }}>{row.noomii}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '8rem 2rem', background: '#0D0D0D', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '3rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Prêt à commencer ?
          </h2>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Rejoignez les premiers coachs et clients de la beta ElitCoach.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register/coach" style={{
              padding: '1rem 2.5rem', background: '#C9A84C', color: '#0D0D0D',
              fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
            }}>Candidater comme coach</Link>
            <Link href="/register/client" style={{
              padding: '1rem 2.5rem', border: '1px solid #333', color: '#FAFAF8',
              fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
            }}>Trouver un coach</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0D0D0D', borderTop: '1px solid #1a1a1a', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', fontWeight: 300, color: '#FAFAF8' }}>ElitCoach</span>
            <span style={{ color: '#444', fontSize: '0.7rem', marginLeft: '0.75rem', letterSpacing: '0.1em' }}>by Zero to One</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[['Confidentialité', '/legal/privacy'], ['CGU', '/legal/terms'], ['Cookies', '/legal/cookies'], ['Login', '/login']].map(([l, h]) => (
              <a key={l} href={h} style={{ color: '#444', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.05em' }}>{l}</a>
            ))}
          </div>
          <span style={{ color: '#333', fontSize: '0.7rem' }}>© {new Date().getFullYear()} Zero to One</span>
        </div>
      </footer>

    </main>
  );
}
