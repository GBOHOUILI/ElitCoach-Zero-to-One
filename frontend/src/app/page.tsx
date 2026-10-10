import Link from 'next/link';

export const metadata = {
  title: 'ElitCoach — Coaching Premium avec Double Sélection',
  description: 'La seule plateforme qui sélectionne aussi rigoureusement les clients que les coaches.',
};

const COACHES = [
  { name: 'Sophie L.', specialty: 'Business & Entrepreneuriat', rate: 150, score: 892, rating: 4.9, reviews: 47 },
  { name: 'Marc D.', specialty: 'Leadership & Management', rate: 180, score: 941, rating: 5.0, reviews: 38 },
  { name: 'Amina K.', specialty: 'Confiance en soi & Carrière', rate: 120, score: 856, rating: 4.8, reviews: 62 },
];

const COMPARE = [
  { feature: 'Sélection des coaches', elitcoach: '5 étapes manuelles', betterup: 'Algorithmique', noomii: 'Inscription libre' },
  { feature: 'Sélection des clients', elitcoach: 'Scoring automatique', betterup: 'Aucune', noomii: 'Aucune' },
  { feature: 'Suivi objectifs', elitcoach: '% progression + check-ins', betterup: 'Basique', noomii: 'Non' },
  { feature: 'Commission', elitcoach: '17%', betterup: 'Non communiqué', noomii: '20–35%' },
  { feature: 'Score crédibilité', elitcoach: '0–1000 algorithme', betterup: 'Étoiles', noomii: 'Étoiles' },
  { feature: 'Messagerie sécurisée', elitcoach: 'Anti-bypass intégré', betterup: 'Standard', noomii: 'Email' },
];

const S: Record<string, React.CSSProperties> = {
  // Sections
  sectionDark: { padding: '7rem 2rem', background: 'var(--bg)' },
  sectionSurface: { padding: '7rem 2rem', background: 'var(--surface)' },
  sectionSurface2: { padding: '7rem 2rem', background: 'var(--surface-2)' },
  inner: { maxWidth: 960, margin: '0 auto' },
  innerNarrow: { maxWidth: 780, margin: '0 auto' },
  // Text
  h2: { fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.15, marginBottom: '1.5rem' },
  body: { color: 'var(--text-2)', fontSize: '1rem', lineHeight: 1.75 },
  label: { fontSize: '0.6875rem', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--gold)', marginBottom: '1rem', display: 'block' },
};

export default function HomePage() {
  return (
    <main style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── NAVBAR ────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem', height: 64,
      }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 300, color: 'var(--text)', letterSpacing: '0.02em' }}>
          ElitCoach
        </span>
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <a href="#coaches" style={{ color: 'var(--text-2)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.15s' }}>Coachs</a>
          <a href="#how" style={{ color: 'var(--text-2)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>Comment ça marche</a>
          <Link href="/login" style={{ color: 'var(--text-2)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>Connexion</Link>
          <Link href="/register/coach" style={{
            padding: '0.55rem 1.25rem', background: 'var(--gold)', color: '#080808',
            fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
            borderRadius: 2, fontWeight: 500,
          }}>Candidater</Link>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '9rem 2rem 6rem', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'var(--bg)',
      }}>
        {/* Orbs décoratifs */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Ligne décorative horizontale */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ width: 40, height: 1, background: 'var(--gold-border)' }} />
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.8 }}>
            by Zero to One · #buildinpublic
          </span>
          <div style={{ width: 40, height: 1, background: 'var(--gold-border)' }} />
        </div>

        <h1 style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: 'clamp(3.8rem, 9vw, 7rem)',
          fontWeight: 300, lineHeight: 1.0,
          color: 'var(--text)', marginBottom: '2rem',
          letterSpacing: '-0.02em', maxWidth: 820,
        }}>
          Le coaching qui<br />
          sélectionne les deux<br />
          <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>côtés de la table</em>
        </h1>

        <p style={{ color: 'var(--text-2)', fontSize: '1.125rem', lineHeight: 1.75, maxWidth: 520, marginBottom: '3rem' }}>
          Coaches validés en 5 étapes. Clients scorés à l'inscription.
          Une plateforme où la qualité n'est pas négociable.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '5rem' }}>
          <Link href="/register/coach" style={{
            padding: '1rem 2.5rem', background: 'var(--gold)', color: '#080808',
            fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
            borderRadius: 2, fontWeight: 500,
          }}>Je suis coach</Link>
          <Link href="/register/client" style={{
            padding: '1rem 2.5rem', border: '1px solid var(--border-2)', color: 'var(--text)',
            fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
            borderRadius: 2,
          }}>Je cherche un coach</Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: '0', flexWrap: 'wrap', justifyContent: 'center',
          border: '1px solid var(--border)', borderRadius: 3, overflow: 'hidden',
          maxWidth: 560,
        }}>
          {[['17%', 'Commission seulement'], ['5 étapes', 'Validation coach'], ['0–1000', 'Score crédibilité']].map(([v, l], i) => (
            <div key={v} style={{
              flex: 1, padding: '1.5rem 2rem', textAlign: 'center',
              borderRight: i < 2 ? '1px solid var(--border)' : 'none',
              background: 'var(--surface)',
            }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-2)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.4rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLÈME ──────────────────────────────── */}
      <section style={{ ...S.sectionSurface }} id="how">
        <div style={S.inner}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={S.label}>Le problème</span>
            <h2 style={{ ...S.h2, marginBottom: 0 }}>
              Le coaching souffre d'un problème<br />de qualité des deux côtés
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {[
              { num: '01', title: 'Coaches non qualifiés', desc: '80% des "coaches" n\'ont aucune certification sérieuse. Les plateformes acceptent tout le monde sans filtre.' },
              { num: '02', title: 'Clients pas prêts', desc: 'Un client sans objectif clair ruine l\'expérience du coach et ses statistiques. Les deux parties en souffrent.' },
              { num: '03', title: 'Commissions opaques', desc: 'Jusqu\'à 35% de commission sans transparence. Les coaches ignorent ce qu\'ils touchent réellement.' },
            ].map((item) => (
              <div key={item.num} style={{ padding: '2.5rem', background: 'var(--surface)' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.2em', marginBottom: '1.5rem', opacity: 0.7 }}>{item.num}</div>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-2)', fontSize: '0.9375rem', lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION COACHES ──────────────────────── */}
      <section style={{ ...S.sectionDark }}>
        <div style={S.inner}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <span style={S.label}>Pour les coaches</span>
              <h2 style={S.h2}>Un pipeline de validation<br />en 5 étapes</h2>
              <p style={{ ...S.body, marginBottom: '2.5rem' }}>
                Chaque coach passe par un processus rigoureux avant d'accueillir son premier client.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {['Candidature & Profil complet', 'Examen du dossier (48h)', 'Entretien visio', 'Session test avec client réel', 'Approbation & Badge Verified'].map((step, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
                    padding: '1rem 0',
                    borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: i === 4 ? 'var(--gold)' : 'var(--gold-dim)',
                      border: `1px solid ${i === 4 ? 'var(--gold)' : 'var(--gold-border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: i === 4 ? '#080808' : 'var(--gold)', fontSize: '0.65rem', fontWeight: 600,
                    }}>{i + 1}</div>
                    <span style={{ color: i === 4 ? 'var(--text)' : 'var(--text-2)', fontSize: '0.9375rem', paddingTop: '0.3rem' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
              {[
                { v: '83%', l: 'Du tarif reversé au coach' },
                { v: 'Badge', l: 'Verified Coach visible sur profil' },
                { v: '0–1000', l: 'Score crédibilité automatique' },
                { v: 'Zéro', l: 'Frais d\'inscription ou abonnement' },
              ].map(({ v, l }) => (
                <div key={v} style={{
                  padding: '1.5rem 2rem', background: 'var(--surface)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ color: 'var(--text-2)', fontSize: '0.9375rem' }}>{l}</span>
                  <span style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 300 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLUTION CLIENTS ──────────────────────── */}
      <section style={{ ...S.sectionSurface2 }}>
        <div style={S.inner}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
              {[
                { q: 'Objectif précis en 3 mois ?', desc: 'Un objectif vague = un coaching vague.' },
                { q: 'Disponibilité hebdomadaire ?', desc: 'Minimum 2h/semaine pour progresser.' },
                { q: 'Budget mensuel ?', desc: 'Le coaching est un investissement.' },
                { q: 'Pourquoi maintenant ?', desc: 'Le bon moment fait la différence.' },
              ].map(({ q, desc }) => (
                <div key={q} style={{ padding: '1.25rem 1.5rem', background: 'var(--surface)' }}>
                  <div style={{ fontSize: '0.9375rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{q}</div>
                  <div style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>{desc}</div>
                </div>
              ))}
            </div>
            <div>
              <span style={S.label}>Pour les clients</span>
              <h2 style={S.h2}>
                Nous sélectionnons nos clients aussi soigneusement que nos coaches
              </h2>
              <p style={{ ...S.body, marginBottom: '2rem' }}>
                4 critères, 25 points chacun. Score minimum 60/100.
                Si le coaching n'est pas la bonne étape, nous vous le disons directement.
              </p>
              <Link href="/register/client" style={{
                display: 'inline-flex', padding: '0.85rem 2rem',
                background: 'var(--gold)', color: '#080808',
                fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
                borderRadius: 2, fontWeight: 500,
              }}>Tester ma candidature</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── COACHES ───────────────────────────────── */}
      <section style={{ ...S.sectionDark }} id="coaches">
        <div style={S.inner}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={S.label}>Nos coaches</span>
            <h2 style={{ ...S.h2, marginBottom: 0 }}>Chaque coach est vérifié manuellement</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'var(--border)' }}>
            {COACHES.map((c) => (
              <div key={c.name} style={{ padding: '2rem', background: 'var(--surface)', transition: 'background 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem',
                  }}>{c.name[0]}</div>
                  <span style={{
                    padding: '0.2rem 0.55rem', background: 'var(--gold-dim)',
                    border: '1px solid var(--gold-border)', color: 'var(--gold)',
                    fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                  }}>✓ Vérifié</span>
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 300, color: 'var(--text)', marginBottom: '0.3rem' }}>{c.name}</div>
                <div style={{ color: 'var(--text-2)', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>{c.specialty}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--gold)', opacity: 0.8 }}>{'★'.repeat(Math.round(c.rating))} <span style={{ color: 'var(--text-2)' }}>({c.reviews})</span></span>
                  <span style={{ color: 'var(--gold)' }}>{c.rate}€/h</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-2)', marginBottom: '0.4rem' }}>
                  <span>Score ElitCoach</span>
                  <span style={{ color: 'var(--gold)' }}>{c.score}/1000</span>
                </div>
                <div style={{ height: 2, background: 'var(--border-2)', borderRadius: 1 }}>
                  <div style={{ height: '100%', width: `${c.score / 10}%`, background: 'linear-gradient(90deg, #8A6020, var(--gold))', borderRadius: 1 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/coaches" style={{
              padding: '0.85rem 2rem', border: '1px solid var(--border-2)', color: 'var(--text-2)',
              fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
              borderRadius: 2, display: 'inline-block', transition: 'border-color 0.15s, color 0.15s',
            }}>Voir tous les coaches →</Link>
          </div>
        </div>
      </section>

      {/* ── COMPARATIF ────────────────────────────── */}
      <section style={{ ...S.sectionSurface }}>
        <div style={S.innerNarrow}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={S.label}>Pourquoi ElitCoach</span>
            <h2 style={{ ...S.h2, marginBottom: 0 }}>La différence est dans les détails</h2>
          </div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 3, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.7rem', color: 'var(--text-2)', borderBottom: '1px solid var(--border)', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Critère</th>
                  <th style={{ textAlign: 'center', padding: '1rem 1.25rem', fontSize: '0.7rem', color: 'var(--gold)', borderBottom: '2px solid var(--gold)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--gold-dim)' }}>ElitCoach</th>
                  <th style={{ textAlign: 'center', padding: '1rem 1.25rem', fontSize: '0.7rem', color: 'var(--text-2)', borderBottom: '1px solid var(--border)', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase' }}>BetterUp</th>
                  <th style={{ textAlign: 'center', padding: '1rem 1.25rem', fontSize: '0.7rem', color: 'var(--text-2)', borderBottom: '1px solid var(--border)', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Noomii</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < COMPARE.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: 'var(--text-2)' }}>{row.feature}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', textAlign: 'center', color: 'var(--gold)', fontWeight: 500, background: 'var(--gold-glow)' }}>{row.elitcoach}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', textAlign: 'center', color: 'var(--text-2)' }}>{row.betterup}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', textAlign: 'center', color: 'var(--text-2)' }}>{row.noomii}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section style={{ padding: '9rem 2rem', background: 'var(--bg)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 540, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{ ...S.label, display: 'block', marginBottom: '1.5rem' }}>Beta ouverte</span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 300, color: 'var(--text)', marginBottom: '1.5rem', lineHeight: 1.05 }}>
            Prêt à commencer ?
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '1rem', marginBottom: '3rem', lineHeight: 1.75 }}>
            Rejoignez les premiers coachs et clients de la beta ElitCoach.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register/coach" style={{
              padding: '1rem 2.5rem', background: 'var(--gold)', color: '#080808',
              fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
              borderRadius: 2, fontWeight: 500, display: 'inline-block',
            }}>Candidater comme coach</Link>
            <Link href="/register/client" style={{
              padding: '1rem 2.5rem', border: '1px solid var(--border-2)', color: 'var(--text)',
              fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
              borderRadius: 2, display: 'inline-block',
            }}>Trouver un coach</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        {/* Footer top */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '4rem 2rem 3rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, color: 'var(--text)', marginBottom: '0.5rem' }}>
              ElitCoach
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              by Zero to One
            </div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 260 }}>
              La seule plateforme de coaching avec double sélection. Qualité garantie des deux côtés.
            </p>
          </div>

          {/* Plateforme */}
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-2)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Plateforme</div>
            {[['Trouver un coach', '/coaches'], ['Devenir coach', '/register/coach'], ['Candidater', '/register/client'], ['Connexion', '/login']].map(([l, h]) => (
              <a key={l} href={h} style={{ display: 'block', color: 'var(--text-2)', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '0.6rem', transition: 'color 0.15s' }}>{l}</a>
            ))}
          </div>

          {/* Légal */}
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-2)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Légal</div>
            {[['Confidentialité', '/legal/privacy'], ['CGU', '/legal/terms'], ['Cookies', '/legal/cookies']].map(([l, h]) => (
              <a key={l} href={h} style={{ display: 'block', color: 'var(--text-2)', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '0.6rem' }}>{l}</a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-2)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Contact</div>
            <a href="mailto:hello@elitcoach.co" style={{ display: 'block', color: 'var(--text-2)', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '0.6rem' }}>hello@elitcoach.co</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: 'var(--text-2)', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '0.6rem' }}>LinkedIn</a>
          </div>
        </div>

        {/* Footer bottom */}
        <div style={{
          maxWidth: 960, margin: '0 auto', padding: '1.5rem 2rem',
          borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
          <span style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>© {new Date().getFullYear()} Zero to One. Tous droits réservés.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }} />
            <span style={{ color: 'var(--text-3)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>API opérationnelle</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
