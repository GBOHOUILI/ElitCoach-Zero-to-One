'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const SPECIALTIES = ['Business', 'Leadership', 'Life Coaching', 'Confiance en soi', 'Santé & Bien-être', 'Carrière', 'Relations', 'Performance'];
const TOTAL_STEPS = 5;

export default function RegisterCoachPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [certInput, setCertInput] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    specialties: [] as string[],
    yearsExperience: '', certifications: [] as string[],
    hourlyRate: '', bio: '',
    videoUrl: '',
    ref1Name: '', ref1Email: '', ref1Relation: '',
    ref2Name: '', ref2Email: '', ref2Relation: '',
    ref3Name: '', ref3Email: '', ref3Relation: '',
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  function validateStep(): string {
    if (step === 1) {
      if (!form.firstName || !form.lastName) return 'Prénom et nom requis.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email invalide.';
      if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/\d/.test(form.password))
        return 'Mot de passe : min 8 caractères, 1 majuscule, 1 chiffre.';
      if (form.password !== form.confirmPassword) return 'Les mots de passe ne correspondent pas.';
    }
    if (step === 2) {
      if (form.specialties.length === 0) return 'Sélectionnez au moins une spécialité.';
      if (!form.yearsExperience || parseInt(form.yearsExperience) < 1) return 'Années d\'expérience requises (min 1).';
    }
    if (step === 3) {
      if (!form.hourlyRate || parseInt(form.hourlyRate) < 50) return 'Tarif horaire min 50€.';
      if (form.bio.length < 200) return `Bio trop courte (${form.bio.length}/200 caractères).`;
    }
    return '';
  }

  function nextStep() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => s + 1);
  }

  function addCert() {
    if (certInput.trim() && !form.certifications.includes(certInput.trim())) {
      set('certifications', [...form.certifications, certInput.trim()]);
      setCertInput('');
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register/coach', {
        email: form.email, password: form.password,
        firstName: form.firstName, lastName: form.lastName,
        specialties: form.specialties,
        certifications: form.certifications,
        yearsExperience: parseInt(form.yearsExperience),
        hourlyRate: parseInt(form.hourlyRate),
        bio: form.bio,
        ...(form.videoUrl ? { videoUrl: form.videoUrl } : {}),
      });
      router.push('/register/coach/success');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : msg || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">

      <div style={{
        position: 'fixed', top: '30%', left: '-5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <h1 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 300, color: '#FAFAF8' }}>
              ElitCoach
            </h1>
          </a>
          <p style={{ color: 'var(--gold)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '0.3rem' }}>
            Candidature Coach
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            {['Identité', 'Expertise', 'Tarifs', 'Vidéo', 'Références'].map((label, i) => (
              <span key={i} style={{
                fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: step > i + 1 ? 'var(--gold)' : step === i + 1 ? '#FAFAF8' : 'var(--text-muted)',
                transition: 'color 0.3s',
              }}>{label}</span>
            ))}
          </div>
          <div style={{ height: 1, background: 'var(--dark-border)', position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              width: `${progress}%`, background: 'var(--gold)',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Card */}
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
              <SectionTitle>Informations personnelles</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Prénom" value={form.firstName} onChange={v => set('firstName', v)} placeholder="Jean" />
                <Field label="Nom" value={form.lastName} onChange={v => set('lastName', v)} placeholder="Dupont" />
              </div>
              <Field label="Email" type="email" value={form.email} onChange={v => set('email', v)} placeholder="jean@exemple.com" />
              <Field label="Mot de passe" type="password" value={form.password} onChange={v => set('password', v)} placeholder="Min 8 chars, 1 majuscule, 1 chiffre" />
              <Field label="Confirmer le mot de passe" type="password" value={form.confirmPassword} onChange={v => set('confirmPassword', v)} placeholder="••••••••" />
            </div>
          )}

          {/* ÉTAPE 2 */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <SectionTitle>Spécialités & Expérience</SectionTitle>
              <div>
                <Label>Spécialités</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {SPECIALTIES.map(s => (
                    <button key={s} type="button"
                      onClick={() => set('specialties', form.specialties.includes(s)
                        ? form.specialties.filter(x => x !== s)
                        : [...form.specialties, s]
                      )}
                      style={{
                        padding: '0.4rem 0.9rem', fontSize: '0.75rem', letterSpacing: '0.05em',
                        border: `1px solid ${form.specialties.includes(s) ? 'var(--gold)' : 'var(--dark-border)'}`,
                        background: form.specialties.includes(s) ? 'rgba(201,168,76,0.1)' : 'transparent',
                        color: form.specialties.includes(s) ? 'var(--gold)' : 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}>{s}</button>
                  ))}
                </div>
              </div>
              <Field label="Années d'expérience" type="number" value={form.yearsExperience} onChange={v => set('yearsExperience', v)} placeholder="5" />
              <div>
                <Label>Certifications</Label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <input className="input-dark" value={certInput} onChange={e => setCertInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCert())}
                    placeholder="Ex: ICF ACC — appuyez Entrée" />
                  <button type="button" onClick={addCert} style={{
                    padding: '0 1rem', background: 'var(--dark-border)', border: 'none',
                    color: 'var(--text)', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.8rem',
                  }}>+</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
                  {form.certifications.map(c => (
                    <span key={c} style={{
                      padding: '0.3rem 0.7rem', fontSize: '0.75rem',
                      background: 'rgba(201,168,76,0.1)', border: '1px solid var(--gold)',
                      color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '0.4rem',
                    }}>
                      {c}
                      <button type="button" onClick={() => set('certifications', form.certifications.filter(x => x !== c))}
                        style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <SectionTitle>Tarifs & Présentation</SectionTitle>
              <div>
                <Label>Tarif horaire (€, min 50€)</Label>
                <div style={{ position: 'relative', marginTop: '0.4rem' }}>
                  <input className="input-dark" type="number" value={form.hourlyRate}
                    onChange={e => set('hourlyRate', e.target.value)} placeholder="150"
                    style={{ paddingLeft: '2rem' }} />
                  <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)', fontSize: '0.9rem' }}>€</span>
                </div>
              </div>
              <div>
                <Label>Bio <span style={{ color: 'var(--text-muted)', fontWeight: 300 }}>(min 200 caractères)</span></Label>
                <textarea className="input-dark" rows={6} value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                  placeholder="Décrivez votre parcours, votre approche, vos résultats clients..."
                  style={{ resize: 'vertical', marginTop: '0.4rem' }} />
                <div style={{ textAlign: 'right', fontSize: '0.7rem', marginTop: '0.3rem',
                  color: form.bio.length >= 200 ? 'var(--gold)' : 'var(--text-muted)' }}>
                  {form.bio.length}/200
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <SectionTitle>Vidéo de présentation</SectionTitle>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>
                Partagez un lien YouTube ou Vimeo (optionnel). Une vidéo de présentation augmente vos chances d'être sélectionné.
              </p>
              <Field label="Lien vidéo (optionnel)" value={form.videoUrl}
                onChange={v => set('videoUrl', v)} placeholder="https://youtube.com/watch?v=..." />
              {form.videoUrl && form.videoUrl.includes('youtube.com') && (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', marginTop: '0.5rem' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${new URLSearchParams(form.videoUrl.split('?')[1]).get('v')}`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          )}

          {/* ÉTAPE 5 */}
          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <SectionTitle>Références professionnelles</SectionTitle>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>3 personnes pouvant témoigner de votre travail.</p>
              {[1, 2, 3].map(n => (
                <div key={n} style={{ padding: '1.25rem', border: '1px solid var(--dark-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>Référence {n}</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <Field label="Nom" value={(form as any)[`ref${n}Name`]} onChange={v => set(`ref${n}Name`, v)} placeholder="Marie Dupont" />
                    <Field label="Email" type="email" value={(form as any)[`ref${n}Email`]} onChange={v => set(`ref${n}Email`, v)} placeholder="marie@exemple.com" />
                  </div>
                  <Field label="Relation" value={(form as any)[`ref${n}Relation`]} onChange={v => set(`ref${n}Relation`, v)} placeholder="Client coaché 6 mois" />
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            {step > 1 && (
              <button type="button" onClick={() => { setError(''); setStep(s => s - 1); }} style={{
                flex: 1, padding: '0.85rem', background: 'transparent',
                border: '1px solid var(--dark-border)', color: 'var(--text-muted)',
                cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                Précédent
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button type="button" onClick={nextStep} className="btn-gold" style={{ flex: 2 }}>
                Suivant
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} className="btn-gold" disabled={loading} style={{ flex: 2 }}>
                {loading ? 'Envoi...' : 'Soumettre ma candidature'}
              </button>
            )}
          </div>

        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Déjà un compte ?{' '}
          <a href="/login" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Se connecter</a>
        </p>

      </div>
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
      {children}
    </h2>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>
      {children}
    </label>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input className="input-dark" type={type} value={value}
        onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ marginTop: '0.4rem' }} />
    </div>
  );
}
