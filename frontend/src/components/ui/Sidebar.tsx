'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps { role: 'coach' | 'client' | 'admin'; }

const COACH_LINKS = [
  { href: '/dashboard/coach', label: 'Dashboard', icon: '◈' },
  { href: '/dashboard/coach/availability', label: 'Disponibilités', icon: '◷' },
  { href: '/dashboard/coach/sessions', label: 'Sessions', icon: '◎' },
  { href: '/messages', label: 'Messages', icon: '◻' },
  { href: '/dashboard/coach/profile', label: 'Mon profil', icon: '◯' },
];

const CLIENT_LINKS = [
  { href: '/dashboard/client', label: 'Dashboard', icon: '◈' },
  { href: '/dashboard/client/goals', label: 'Objectifs', icon: '◎' },
  { href: '/dashboard/client/sessions', label: 'Sessions', icon: '◷' },
  { href: '/coaches', label: 'Trouver un coach', icon: '◉' },
  { href: '/messages', label: 'Messages', icon: '◻' },
];

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: '◈' },
  { href: '/admin/coaches', label: 'Coaches', icon: '◉' },
  { href: '/admin/clients', label: 'Clients', icon: '◯' },
  { href: '/admin/sessions', label: 'Sessions', icon: '◎' },
  { href: '/admin/finance', label: 'Finance', icon: '◷' },
  { href: '/admin/conversations', label: 'Conversations', icon: '◻' },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const links = role === 'coach' ? COACH_LINKS : role === 'client' ? CLIENT_LINKS : ADMIN_LINKS;

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userFirstName');
    document.cookie = 'refreshToken=; max-age=0';
    router.push('/login');
  }

  return (
    <aside style={{ width: 220, minHeight: '100vh', background: '#141414', borderRight: '1px solid #1a1a1a', padding: '2rem 0', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0 }}>
      <div style={{ padding: '0 1.5rem 2rem', borderBottom: '1px solid #1a1a1a', marginBottom: '1rem' }}>
        <Link href="/" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.4rem', fontWeight: 300, color: '#FAFAF8', textDecoration: 'none' }}>ElitCoach</Link>
        <div style={{ color: '#555', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{role}</div>
      </div>
      <nav style={{ flex: 1, padding: '0 0.75rem' }}>
        {links.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0.75rem', marginBottom: '0.15rem', borderRadius: 2,
              textDecoration: 'none',
              background: active ? 'rgba(201,168,76,0.08)' : 'transparent',
              color: active ? '#C9A84C' : '#555',
              fontSize: '0.8rem',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: '0.7rem' }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <button type="button" onClick={handleLogout} style={{
        margin: '1rem', padding: '0.6rem', background: 'none',
        border: '1px solid #1a1a1a', color: '#444', cursor: 'pointer',
        fontSize: '0.75rem', letterSpacing: '0.05em', textAlign: 'left',
      }}>→ Déconnexion</button>
    </aside>
  );
}
