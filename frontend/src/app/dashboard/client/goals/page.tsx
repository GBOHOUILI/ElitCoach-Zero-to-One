'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/ui/Sidebar';
import api from '@/lib/api';

export default function ClientGoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkinGoalId, setCheckinGoalId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const QUESTIONS = [
    { key: 'q1', label: 'Qu\'as-tu accompli depuis la dernière session ?' },
    { key: 'q2', label: 'Qu\'est-ce qui fonctionne bien ?' },
    { key: 'q3', label: 'Sur 10, comment te sens-tu par rapport à ton objectif ?' },
    { key: 'q4', label: 'Quelle est ta principale difficulté ?' },
    { key: 'q5', label: 'Quel est ton objectif pour les 7 prochains jours ?' },
  ];

  useEffect(() => {
    if (localStorage.getItem('userRole') !== 'CLIENT') { router.push('/login'); return; }
    api.get('/goals').then(r => setGoals(r.data || [])).catch(() => setGoals([])).finally(() => setLoading(false));
  }, []);

  async function submitCheckin(goalId: string) {
    setSubmitting(true);
    try {
      await api.post(`/goals/${goalId}/checkins`, { answers });
      setCheckinGoalId(null);
      setAnswers({});
      const { data } = await api.get('/goals');
      setGoals(data || []);
    } catch (e: any) { alert(e.response?.data?.message || 'Erreur'); }
    setSubmitting(false);
  }

  async function toggleStep(goalId: string, stepId: string, current: boolean) {
    try {
      await api.patch(`/goals/${goalId}/steps/${stepId}`, { isCompleted: !current });
      const { data } = await api.get('/goals');
      setGoals(data || []);
    } catch {}
  }

  return (
    <div style={{ display: 'flex', background: '#0D0D0D', minHeight: '100vh' }}>
      <Sidebar role="client" />
      <main style={{ marginLeft: 220, flex: 1, padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '2rem' }}>Mes objectifs</h1>

        {loading ? <p style={{ color: '#555' }}>Chargement...</p> : goals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#555' }}>
            <p>Aucun objectif défini pour le moment.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Votre coach créera vos objectifs lors de votre première session.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {goals.map(goal => {
              const stepsTotal = goal.steps?.length || 0;
              const stepsDone = goal.steps?.filter((s: any) => s.isCompleted).length || 0;
              const hasCheckinThisWeek = goal.checkIns?.some((c: any) => {
                const d = new Date(c.createdAt);
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
                return d >= weekAgo;
              });

              return (
                <div key={goal.id} style={{ background: '#141414', border: '1px solid #1a1a1a', overflow: 'hidden' }}>
                  {/* Header */}
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid #1a1a1a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h2 style={{ color: '#FAFAF8', fontSize: '1rem', fontWeight: 400 }}>{goal.title}</h2>
                      <span style={{ padding: '0.2rem 0.6rem', border: `1px solid ${goal.status === 'COMPLETED' ? '#C9A84C' : '#333'}`, color: goal.status === 'COMPLETED' ? '#C9A84C' : '#555', fontSize: '0.65rem', letterSpacing: '0.1em', flexShrink: 0, marginLeft: '1rem' }}>{goal.status}</span>
                    </div>
                    {/* Barre progression */}
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#555', fontSize: '0.75rem' }}>{stepsDone}/{stepsTotal} étapes</span>
                        <span style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', fontWeight: 300, color: '#C9A84C', lineHeight: 1 }}>{goal.progress}%</span>
                      </div>
                      <div style={{ height: 6, background: '#1a1a1a', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${goal.progress}%`, background: 'linear-gradient(90deg, #A07830, #C9A84C)', borderRadius: 3, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                    <p style={{ color: '#555', fontSize: '0.75rem' }}>Objectif pour le {new Date(goal.targetDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>

                  {/* Étapes */}
                  {goal.steps?.length > 0 && (
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1a1a1a' }}>
                      {goal.steps.map((step: any) => (
                        <div key={step.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #111' }}>
                          <button type="button" onClick={() => toggleStep(goal.id, step.id, step.isCompleted)} style={{
                            width: 18, height: 18, borderRadius: 2, border: `1px solid ${step.isCompleted ? '#C9A84C' : '#333'}`,
                            background: step.isCompleted ? '#C9A84C' : 'transparent', cursor: 'pointer', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D0D0D', fontSize: '0.7rem',
                          }}>{step.isCompleted ? '✓' : ''}</button>
                          <span style={{ color: step.isCompleted ? '#444' : '#888', fontSize: '0.8rem', textDecoration: step.isCompleted ? 'line-through' : 'none', flex: 1 }}>{step.title}</span>
                          {step.dueDate && <span style={{ color: new Date(step.dueDate) < new Date() && !step.isCompleted ? '#E57373' : '#444', fontSize: '0.7rem', flexShrink: 0 }}>{new Date(step.dueDate).toLocaleDateString('fr-FR')}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Check-in */}
                  <div style={{ padding: '1rem 1.5rem' }}>
                    {hasCheckinThisWeek ? (
                      <p style={{ color: '#4CAF50', fontSize: '0.8rem' }}>✓ Check-in de la semaine effectué</p>
                    ) : (
                      <button type="button" onClick={() => setCheckinGoalId(goal.id)} style={{
                        padding: '0.65rem 1.5rem', background: '#C9A84C', color: '#0D0D0D',
                        border: 'none', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                      }}>Faire mon check-in hebdomadaire</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal check-in */}
        {checkinGoalId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '2rem' }} onClick={() => setCheckinGoalId(null)}>
            <div style={{ background: '#141414', border: '1px solid #242424', padding: '2rem', width: '100%', maxWidth: 580, maxHeight: '85vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', fontWeight: 300, color: '#FAFAF8', marginBottom: '1.5rem' }}>Check-in hebdomadaire</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {QUESTIONS.map(q => (
                  <div key={q.key}>
                    <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '0.4rem' }}>{q.label}</label>
                    <textarea value={answers[q.key] || ''} onChange={e => setAnswers(a => ({ ...a, [q.key]: e.target.value }))} rows={2}
                      style={{ width: '100%', background: '#0D0D0D', border: '1px solid #333', color: '#FAFAF8', padding: '0.6rem', fontSize: '0.8rem', resize: 'vertical', fontFamily: 'DM Sans, sans-serif' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setCheckinGoalId(null)} style={{ flex: 1, padding: '0.75rem', background: 'none', border: '1px solid #333', color: '#555', cursor: 'pointer', fontSize: '0.75rem' }}>Annuler</button>
                <button type="button" onClick={() => submitCheckin(checkinGoalId)} disabled={submitting} style={{ flex: 2, padding: '0.75rem', background: '#C9A84C', color: '#0D0D0D', border: 'none', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {submitting ? 'Envoi...' : 'Soumettre le check-in'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
