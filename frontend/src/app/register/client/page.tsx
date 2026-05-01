'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const BUDGET_OPTIONS = [
  { label: 'Moins de 100€', value: 50 },
  { label: '100 – 300€', value: 200 },
  { label: '300 – 600€', value: 450 },
  { label: 'Plus de 600€', value: 700 },
];

const HOURS_OPTIONS = [
  { label: "Moins d'1h", value: 0 },
  { label: '1 – 2h', value: 1 },
  { label: '2 – 4h', value: 3 },
  { label: 'Plus de 4h', value: 5 },
];

export default function RegisterClientPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    objective: '', budget: 0, hoursPerWeek: 0,
    hadCoachBefore: false, previousCoachResult: '', whyNow: '',
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  function validateStep1() {
    if (!form.firstName || !form.lastName) return 'Prénom et nom requis.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email invalide.';
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/\d/.test(form.password))
      return 'Mot de passe : min 8 caractères, 1 majuscule, 1 chiffre.';
    if (form.password !== form.confirmPassword) return 'Les mots de passe ne correspondent pas.';
    return '';
  }

  async function handleSubmit() {
    if (form.objective.length < 50) { setError('Décrivez votre objectif en au moins 50 caractères.'); return; }
    if (form.whyNow.length < 50) { setError('Expliquez pourquoi maintenant en au moins 50 caractères.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/register/client', {
        email: form.email, password: form.password,
        firstName: form.firstName, lastName: form.lastName,
        objective: form.objective, budget: form.budget,
        hoursPerWeek: form.hoursPerWeek, hadCoachBefore: form.hadCoachBefore,
        previousCoachResult: form.previousCoachResult || undefined,
        whyNow: form.whyNow,
      });
      if (data.status === 'REJECTED') {
        router.push('/register/client/rejected');
      } else {
        router.push('/register/client/pending');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div style={{ width: '100%', maxWidth: 560 }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <h1 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 300, color: '#FAFAF8' }}>ElitCoach</h1>
          </a>
          <p style={{ color: 'var(--gold)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '0.3rem' }}>
            Candidature Client
          </p>
        </div>

        {/* Message exclusivité */}
        <div style={{
          border: '1px solid rgba(201,168,76,0.3)', padding: '1rem 1.5rem',
          marginBottom: '1.5rem', textAlign: 'center',
        }}>
          <p style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.05em', fontStyle: 'italic' }}>
            "Nous sélectionnons nos clients aussi soigneusement que nos coachs."
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[1, 2].map(n => (
            <div key={n} style={{
              flex: 1, height: 2,
              background: step >= n ? 'var(--gold)' : 'var(--dark-border)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        <div className="card-dark" style={{ padding: '2.5rem' }}>

          {error && (
            <div style={{
              color: '#E57373', fontSize: '0.8rem', padding: '0.75rem 1rem',
              background: 'rgba(229,115,115,0.08)', border: '1px solid rgba(229,115,115,0.2)',
              marginBottom: '1.5rem',
            }}>{error}</div>
          )}

          {/* ÉTAPE 1 */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Informations personnelles
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Prénom" value={form.firstName} onChange={v => set('firstName', v)} placeholder="Marie" />
                <Field label="Nom" value={form.lastName} onChange={v => set('lastName', v)} placeholder="Martin" />
              </div>
              <Field label="Email" type="email" value={form.email} onChange={v => set('email', v)} placeholder="marie@exemple.com" />
              <Field label="Mot de passe" type="password" value={form.password} onChange={v => set('password', v)} placeholder="Min 8 chars, 1 majuscule, 1 chiffre" />
              <Field label="Confirmer le mot de passe" type="password" value={form.confirmPassword} onChange={v => set('confirmPassword', v)} placeholder="••••••••" />
              <button type="button" className="btn-gold" style={{ marginTop: '0.5rem' }}
                onClick={() => { const e = validateStep1(); if (e) { setError(e); return; } setError(''); setStep(2); }}>
                Continuer
              </button>
            </div>
          )}

          {/* ÉTAPE 2 */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(201,168,76,0.05)', borderLeft: '2px solid var(--gold)' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Ces questions permettent de vérifier que le coaching est la bonne étape pour vous.
                </p>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Quel résultat précis visez-vous en 3 mois ?
                </label>
                <textarea className="input-dark" rows={3} value={form.objective}
                  onChange={e => set('objective', e.target.value)}
                  placeholder="Ex: Signer 3 nouveaux clients et atteindre 5000€ de CA mensuel"
                  style={{ resize: 'none', marginTop: '0.4rem' }} />
                <div style={{ textAlign: 'right', fontSize: '0.7rem', color: form.objective.length >= 50 ? 'var(--gold)' : 'var(--text-muted)' }}>
                  {form.objective.length}/50 min
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Heures disponibles par semaine
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {HOURS_OPTIONS.map(o => (
                    <button key={o.label} type="button"
                      onClick={() => set('hoursPerWeek', o.value)}
                      style={{
                        padding: '0.6rem', fontSize: '0.78rem',
                        border: `1px solid ${form.hoursPerWeek === o.value ? 'var(--gold)' : 'var(--dark-border)'}`,
                        background: form.hoursPerWeek === o.value ? 'rgba(201,168,76,0.1)' : 'transparent',
                        color: form.hoursPerWeek === o.value ? 'var(--gold)' : 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}>{o.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Budget mensuel
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {BUDGET_OPTIONS.map(o => (
                    <button key={o.label} type="button"
                      onClick={() => set('budget', o.value)}
                      style={{
                        padding: '0.6rem', fontSize: '0.78rem',
                        border: `1px solid ${form.budget === o.value ? 'var(--gold)' : 'var(--dark-border)'}`,
                        background: form.budget === o.value ? 'rgba(201,168,76,0.1)' : 'transparent',
                        color: form.budget === o.value ? 'var(--gold)' : 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}>{o.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Avez-vous déjà travaillé avec un coach ?
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[true, false].map(v => (
                    <button key={String(v)} type="button"
                      onClick={() => set('hadCoachBefore', v)}
                      style={{
                        flex: 1, padding: '0.6rem', fontSize: '0.78rem',
                        border: `1px solid ${form.hadCoachBefore === v ? 'var(--gold)' : 'var(--dark-border)'}`,
                        background: form.hadCoachBefore === v ? 'rgba(201,168,76,0.1)' : 'transparent',
                        color: form.hadCoachBefore === v ? 'var(--gold)' : 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}>{v ? 'Oui' : 'Non'}</button>
                  ))}
                </div>
              </div>

              {form.hadCoachBefore && (
                <div>
                  <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                    Quel résultat ? Pourquoi avez-vous arrêté ?
                  </label>
                  <textarea className="input-dark" rows={2} value={form.previousCoachResult}
                    onChange={e => set('previousCoachResult', e.target.value)}
                    placeholder="Ex: Augmenté mon CA de 30%, arrêté car déménagement."
                    style={{ resize: 'none', marginTop: '0.4rem' }} />
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Pourquoi maintenant ?
                </label>
                <textarea className="input-dark" rows={3} value={form.whyNow}
                  onChange={e => set('whyNow', e.target.value)}
                  placeholder="Mon entreprise stagne depuis 6 mois et j'ai un salon pro en mars..."
                  style={{ resize: 'none', marginTop: '0.4rem' }} />
                <div style={{ textAlign: 'right', fontSize: '0.7rem', color: form.whyNow.length >= 50 ? 'var(--gold)' : 'var(--text-muted)' }}>
                  {form.whyNow.length}/50 min
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => { setError(''); setStep(1); }} style={{
                  flex: 1, padding: '0.85rem', background: 'transparent',
                  border: '1px solid var(--dark-border)', color: 'var(--text-muted)',
                  cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>Précédent</button>
                <button type="button" className="btn-gold" style={{ flex: 2 }} disabled={loading} onClick={handleSubmit}>
                  {loading ? 'Analyse...' : 'Soumettre ma candidature'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Déjà un compte ?{' '}
          <a href="/login" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Se connecter</a>
        </p>
      </div>
    </main>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
        {label}
      </label>
      <input className="input-dark" type={type} value={value}
        onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
