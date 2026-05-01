'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Sidebar from '@/components/ui/Sidebar';

const BYPASS_PATTERN = /([0-9]{2}[\s.\-]{0,1}){4,}|@[a-zA-Z0-9]|\+33|\b07\b|\b06\b/;

export default function MessagesPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [bypassWarning, setBypassWarning] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';

  useEffect(() => {
    const r = localStorage.getItem('userRole') || '';
    if (!r) { router.push('/login'); return; }
    setRole(r);
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchConversations() {
    setLoading(true);
    try {
      const { data } = await api.get('/conversations');
      setConversations(Array.isArray(data) ? data : []);
    } catch { setConversations([]); }
    setLoading(false);
  }

  async function openConversation(conv: any) {
    setActiveConv(conv);
    try {
      const { data } = await api.get(`/conversations/${conv.id}/messages`);
      setMessages(data.messages || []);
    } catch { setMessages([]); }
  }

  async function sendMessage() {
    if (!input.trim() || !activeConv || sending) return;

    if (BYPASS_PATTERN.test(input)) {
      setBypassWarning(true);
      setTimeout(() => setBypassWarning(false), 4000);
      return;
    }

    setSending(true);
    const content = input;
    setInput('');
    try {
      const { data } = await api.post(`/conversations/${activeConv.id}/messages`, { content });
      setMessages(prev => [...prev, data]);
    } catch (e: any) {
      const msg = e.response?.data?.message;
      if (msg?.includes('coordonnées')) {
        setBypassWarning(true);
        setTimeout(() => setBypassWarning(false), 4000);
      }
      setInput(content);
    }
    setSending(false);
  }

  const sidebarRole = role === 'COACH' ? 'coach' : role === 'ADMIN' ? 'admin' : 'client';

  return (
    <div style={{ display: 'flex', background: '#0D0D0D', minHeight: '100vh' }}>
      <Sidebar role={sidebarRole} />
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', height: '100vh' }}>

        {/* Liste conversations */}
        <div style={{ width: 280, borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', background: '#141414' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #1a1a1a' }}>
            <h1 style={{ fontSize: '0.85rem', fontWeight: 400, color: '#FAFAF8', letterSpacing: '0.05em' }}>Messages</h1>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <p style={{ color: '#555', fontSize: '0.8rem', padding: '1.5rem' }}>Chargement...</p>
            ) : conversations.length === 0 ? (
              <p style={{ color: '#444', fontSize: '0.8rem', padding: '1.5rem', lineHeight: 1.6 }}>
                Aucune conversation.<br />
                {role === 'CLIENT' && 'Réservez une session pour commencer à échanger avec un coach.'}
              </p>
            ) : conversations.map(conv => {
              const other = conv.otherPerson;
              const lastMsg = conv.messages?.[0];
              const isActive = activeConv?.id === conv.id;
              return (
                <button key={conv.id} type="button" onClick={() => openConversation(conv)}
                  style={{
                    width: '100%', padding: '1rem 1.25rem', textAlign: 'left',
                    background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                    border: 'none', borderBottom: '1px solid #111', cursor: 'pointer',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <span style={{ color: isActive ? '#C9A84C' : '#FAFAF8', fontSize: '0.85rem' }}>
                      {other?.firstName} {other?.lastName}
                    </span>
                    {lastMsg && <span style={{ color: '#333', fontSize: '0.65rem' }}>{new Date(lastMsg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>}
                  </div>
                  {lastMsg && (
                    <span style={{ color: '#444', fontSize: '0.75rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lastMsg.content?.substring(0, 45)}...
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zone chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {!activeConv ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '0.875rem' }}>
              Sélectionnez une conversation
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#141414' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: '0.9rem' }}>
                  {activeConv.otherPerson?.firstName?.[0]}
                </div>
                <div>
                  <div style={{ color: '#FAFAF8', fontSize: '0.875rem' }}>{activeConv.otherPerson?.firstName} {activeConv.otherPerson?.lastName}</div>
                  <div style={{ color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{activeConv.otherPerson?.role}</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {messages.map((msg, i) => {
                  const isMe = msg.senderId === userId;
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '65%', padding: '0.65rem 1rem',
                        background: isMe ? 'rgba(201,168,76,0.15)' : '#1a1a1a',
                        border: `1px solid ${isMe ? 'rgba(201,168,76,0.2)' : '#242424'}`,
                        borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0',
                      }}>
                        <p style={{ color: '#FAFAF8', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>{msg.content}</p>
                        <span style={{ color: '#444', fontSize: '0.65rem', display: 'block', marginTop: '0.35rem', textAlign: isMe ? 'right' : 'left' }}>
                          {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          {isMe && msg.isRead && <span style={{ marginLeft: '0.35rem' }}>✓✓</span>}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Anti-bypass warning */}
              {bypassWarning && (
                <div style={{ margin: '0 1.5rem 0.5rem', padding: '0.75rem 1rem', background: 'rgba(229,115,115,0.08)', border: '1px solid rgba(229,115,115,0.3)', color: '#E57373', fontSize: '0.8rem' }}>
                  ⚠ Coordonnées personnelles non autorisées. Toutes les communications doivent rester sur ElitCoach.
                </div>
              )}

              {/* Input */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '0.75rem' }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Votre message... (Shift+Entrée pour saut de ligne)"
                  rows={2}
                  style={{
                    flex: 1, background: '#141414', border: '1px solid #242424', color: '#FAFAF8',
                    padding: '0.65rem 1rem', fontSize: '0.875rem', resize: 'none', outline: 'none',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                />
                <button type="button" onClick={sendMessage} disabled={sending || !input.trim()}
                  style={{
                    padding: '0 1.25rem', background: input.trim() ? '#C9A84C' : '#1a1a1a',
                    border: 'none', color: input.trim() ? '#0D0D0D' : '#333',
                    cursor: input.trim() ? 'pointer' : 'not-allowed', fontSize: '0.8rem',
                    transition: 'all 0.2s',
                  }}>
                  {sending ? '...' : '→'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
