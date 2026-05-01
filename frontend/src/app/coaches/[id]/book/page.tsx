'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  d.setHours(0,0,0,0);
  return d;
}

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [coach, setCoach] = useState<any>(null);
  const [step, setStep] = useState<1|2>(1);
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [cardReady, setCardReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchCoach(); }, [id]);
  useEffect(() => { if (coach) fetchSlots(); }, [coach, weekStart]);

  async function fetchCoach() {
    try {
      const { data } = await api.get(`/coaches/${id}`);
      setCoach(data);
    } catch { router.push('/coaches'); }
  }

  async function fetchSlots() {
    setLoading(true);
    try {
      const weekStr = weekStart.toISOString().split('T')[0];
      const { data } = await api.get(`/coaches/${id}/availability?week=${weekStr}`);
      setSlots(data.slots || []);
    } catch { setSlots([]); }
    setLoading(false);
  }

  async function createBooking() {
    if (!selectedSlot) return;
    setLoading(true); setError('');
    try {
      const scheduledAt = `${selectedSlot.date}T${selectedSlot.startTime}:00.000Z`;
      const { data } = await api.post('/sessions', { coachId: id, scheduledAt, durationMins: 60 });
      setBookingData(data);
      setStep(2);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Créneau non disponible.');
    }
    setLoading(false);
  }

  async function confirmPayment() {
    // Sans Stripe.js intégré ici (nécessite NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY configuré)
    // On simule la confirmation pour les tests
    setPaying(true); setError('');
    try {
      if (!bookingData?.stripeClientSecret) {
        // Mode dev sans Stripe : on marque la session comme confirmée directement
        setSuccess(true);
      } else {
        // Avec Stripe : charger dynamiquement
        const { loadStripe } = await import('@stripe/stripe-js');
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
        if (!stripe) throw new Error('Stripe non disponible');
        // En production, utiliser CardElement ici
        setSuccess(true);
      }
    } catch (e: any) {
      setError(e.message || 'Erreur de paiement.');
    }
    setPaying(false);
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  if (success) return (
    <main style={{ background: '#0D0D0D', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.75rem' }}>✓</div>
        <h1 className="font-display" style={{ fontSize: '2.2rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '1rem' }}>Session confirmée !</h1>
        <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Votre session avec {coach?.firstName} {coach?.lastName} est réservée.<br />
          Vous recevrez un email avec le lien Zoom.
        </p>
        <Link href="/dashboard/client/sessions" style={{ display: 'inline-block', padding: '0.85rem 2rem', background: '#C9A84C', color: '#0D0D0D', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Voir mes sessions
        </Link>
      </div>
    </main>
  );

  return (
    <main style={{ background: '#0D0D0D', minHeight: '100vh', padding: '5rem 2rem 2rem' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(13,13,13,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem' }}>
        <Link href={`/coaches/${id}`} style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', fontWeight: 300, color: '#FAFAF8', textDecoration: 'none' }}>← Retour</Link>
        <span style={{ color: '#555', fontSize: '0.8rem' }}>Réservation</span>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Header coach */}
        {coach && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem', padding: '1.5rem', background: '#141414', border: '1px solid #1a1a1a' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontFamily: 'Cormorant Garamond', fontSize: '1.3rem', flexShrink: 0 }}>
              {coach.firstName?.[0]}{coach.lastName?.[0]}
            </div>
            <div>
              <div style={{ color: '#FAFAF8', fontFamily: 'Cormorant Garamond', fontSize: '1.2rem', fontWeight: 300 }}>{coach.firstName} {coach.lastName}</div>
              <div style={{ color: '#C9A84C', fontSize: '0.85rem' }}>{coach.hourlyRate}€ / session de 60 min</div>
            </div>
          </div>
        )}

        {/* Steps indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[['1', 'Choisir un créneau'], ['2', 'Confirmer et payer']].map(([n, l], i) => (
            <div key={n} style={{ flex: 1, padding: '0.75rem 1rem', border: `1px solid ${step === i + 1 ? '#C9A84C' : '#1a1a1a'}`, background: step === i + 1 ? 'rgba(201,168,76,0.05)' : '#141414' }}>
              <span style={{ color: step === i + 1 ? '#C9A84C' : '#333', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{n}. {l}</span>
            </div>
          ))}
        </div>

        {/* STEP 1 — Créneau */}
        {step === 1 && (
          <div>
            {/* Navigation semaine */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <button type="button" onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d); }} style={{ background: 'none', border: '1px solid #333', color: '#888', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8rem' }}>← Semaine préc.</button>
              <span style={{ color: '#FAFAF8', fontSize: '0.85rem' }}>
                {weekDays[0].getDate()} — {weekDays[6].getDate()} {MONTHS_FR[weekDays[6].getMonth()]} {weekDays[6].getFullYear()}
              </span>
              <button type="button" onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d); }} style={{ background: 'none', border: '1px solid #333', color: '#888', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8rem' }}>Semaine suiv. →</button>
            </div>

            {loading ? (
              <p style={{ color: '#555', textAlign: 'center', padding: '3rem' }}>Chargement des créneaux...</p>
            ) : slots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#555' }}>
                <p>Aucun créneau disponible cette semaine.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Essayez la semaine suivante.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {weekDays.map((day, dayIdx) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const daySlots = slots.filter(s => s.date === dateStr);
                  const isPast = day < new Date();
                  return (
                    <div key={dayIdx}>
                      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ color: '#444', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{DAYS_FR[day.getDay()]}</div>
                        <div style={{ color: isPast ? '#333' : '#888', fontSize: '0.85rem' }}>{day.getDate()}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {daySlots.length === 0 ? (
                          <div style={{ height: 36, background: '#0D0D0D', border: '1px solid #111' }} />
                        ) : daySlots.map((slot, si) => {
                          const isSelected = selectedSlot?.date === slot.date && selectedSlot?.startTime === slot.startTime;
                          return (
                            <button key={si} type="button" disabled={!slot.available || isPast}
                              onClick={() => setSelectedSlot(slot)}
                              style={{
                                padding: '0.4rem 0.2rem', fontSize: '0.65rem', textAlign: 'center',
                                border: `1px solid ${isSelected ? '#C9A84C' : slot.available && !isPast ? '#333' : '#111'}`,
                                background: isSelected ? 'rgba(201,168,76,0.2)' : slot.available && !isPast ? '#141414' : '#0D0D0D',
                                color: isSelected ? '#C9A84C' : slot.available && !isPast ? '#888' : '#2a2a2a',
                                cursor: slot.available && !isPast ? 'pointer' : 'not-allowed',
                              }}>
                              {slot.startTime}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedSlot && (
              <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.3)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <p style={{ color: '#C9A84C', fontSize: '0.8rem' }}>
                  ✓ Créneau sélectionné : <strong>{new Date(selectedSlot.date + 'T' + selectedSlot.startTime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong> à <strong>{selectedSlot.startTime}</strong> — 60 min — <strong>{coach?.hourlyRate}€</strong>
                </p>
              </div>
            )}

            {error && <p style={{ color: '#E57373', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}

            <button type="button" className="btn-gold" disabled={!selectedSlot || loading} onClick={createBooking}>
              {loading ? 'Vérification...' : 'Continuer vers le paiement →'}
            </button>
          </div>
        )}

        {/* STEP 2 — Paiement */}
        {step === 2 && bookingData && (
          <div>
            <div style={{ background: '#141414', border: '1px solid #1a1a1a', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginBottom: '1.25rem' }}>Récapitulatif</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#555' }}>Coach</span>
                  <span style={{ color: '#FAFAF8' }}>{coach?.firstName} {coach?.lastName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#555' }}>Date</span>
                  <span style={{ color: '#FAFAF8' }}>{new Date(selectedSlot.date + 'T' + selectedSlot.startTime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {selectedSlot.startTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#555' }}>Durée</span>
                  <span style={{ color: '#FAFAF8' }}>60 minutes</span>
                </div>
                <div style={{ height: 1, background: '#1a1a1a', margin: '0.5rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#FAFAF8', fontWeight: 500 }}>Total</span>
                  <span style={{ color: '#C9A84C', fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', fontWeight: 300 }}>{bookingData.price}€</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#141414', border: '1px solid #1a1a1a', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ color: '#555', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>🔒 Paiement sécurisé</span>
              </div>
              <div style={{ background: '#0D0D0D', border: '1px solid #333', padding: '1rem', marginBottom: '1rem' }}>
                <p style={{ color: '#555', fontSize: '0.8rem', textAlign: 'center' }}>
                  {bookingData.stripeClientSecret
                    ? 'Formulaire Stripe — configurer NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
                    : '🧪 Mode dev — paiement simulé (pas de clé Stripe)'}
                </p>
              </div>
              <p style={{ color: '#444', fontSize: '0.75rem', lineHeight: 1.6 }}>
                Le montant sera pré-autorisé et capturé uniquement après la session. Annulation gratuite jusqu\'à 24h avant.
              </p>
            </div>

            {error && <p style={{ color: '#E57373', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '0.85rem', background: 'none', border: '1px solid #333', color: '#555', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>← Retour</button>
              <button type="button" className="btn-gold" style={{ flex: 2 }} disabled={paying} onClick={confirmPayment}>
                {paying ? 'Traitement...' : `Confirmer et payer ${bookingData.price}€`}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
