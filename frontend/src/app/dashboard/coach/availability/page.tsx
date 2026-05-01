'use client';
import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import api from '@/lib/api';

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const HOURS = Array.from({ length: 25 }, (_, i) => {
  const h = Math.floor(i / 2) + 8;
  const m = i % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
}).filter(t => t <= '20:00');

export default function AvailabilityPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dragging, setDragging] = useState(false);
  const [dragValue, setDragValue] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/coaches/me/availability').then(({ data }) => {
      const newSet = new Set<string>();
      (data || []).forEach((slot: any) => {
        const key = `${slot.dayOfWeek}-${slot.startTime}`;
        newSet.add(key);
      });
      setSelected(newSet);
    }).catch(() => {});
  }, []);

  const toggle = useCallback((day: number, time: string, forceValue?: boolean) => {
    const key = `${day}-${time}`;
    setSelected(prev => {
      const next = new Set(prev);
      const val = forceValue !== undefined ? forceValue : !prev.has(key);
      if (val) next.add(key); else next.delete(key);
      return next;
    });
  }, []);

  async function save() {
    setLoading(true);
    const slots: any[] = [];
    selected.forEach(key => {
      const [day, time] = key.split('-');
      const timeIdx = HOURS.indexOf(time);
      const endTime = HOURS[timeIdx + 1] || '21:00';
      slots.push({ dayOfWeek: Number(day), startTime: time, endTime });
    });
    try {
      await api.post('/coaches/me/availability', { slots });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', background: '#0D0D0D', minHeight: '100vh' }}>
      <Sidebar role="coach" />
      <main style={{ marginLeft: 220, flex: 1, padding: '2.5rem', userSelect: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 300, color: '#FAFAF8' }}>Mes disponibilités</h1>
            <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '0.25rem' }}>Ces créneaux se répètent chaque semaine</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#C9A84C', fontSize: '0.8rem' }}>{selected.size} créneau{selected.size > 1 ? 'x' : ''} sélectionné{selected.size > 1 ? 's' : ''}</span>
            <button type="button" onClick={save} disabled={loading} style={{
              padding: '0.65rem 1.5rem', background: '#C9A84C', color: '#0D0D0D',
              border: 'none', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              {loading ? 'Enregistrement...' : saved ? '✓ Enregistré' : 'Enregistrer'}
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: 60, color: '#444', fontSize: '0.65rem', padding: '0.5rem' }}></th>
                {DAYS.map((d, i) => (
                  <th key={d} style={{ color: '#555', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.5rem', fontWeight: 400, textAlign: 'center', minWidth: 80 }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((time) => (
                <tr key={time}>
                  <td style={{ color: '#333', fontSize: '0.65rem', padding: '0 0.5rem', textAlign: 'right', whiteSpace: 'nowrap' }}>{time}</td>
                  {DAYS.map((_, day) => {
                    const key = `${day}-${time}`;
                    const active = selected.has(key);
                    return (
                      <td key={day}
                        onMouseDown={() => { setDragging(true); setDragValue(!active); toggle(day, time, !active); }}
                        onMouseEnter={() => { if (dragging) toggle(day, time, dragValue); }}
                        onMouseUp={() => setDragging(false)}
                        style={{
                          height: 24, border: '1px solid #111',
                          background: active ? 'rgba(201,168,76,0.3)' : '#141414',
                          cursor: 'pointer', transition: 'background 0.1s',
                        }}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', color: '#444', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 14, height: 14, background: 'rgba(201,168,76,0.3)', display: 'inline-block' }} /> Disponible
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 14, height: 14, background: '#141414', border: '1px solid #1a1a1a', display: 'inline-block' }} /> Non disponible
          </span>
        </div>
      </main>
    </div>
  );
}
