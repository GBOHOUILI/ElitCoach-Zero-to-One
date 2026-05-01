import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ElitCoach — Coaching Premium',
  description: 'La plateforme de coaching avec double sélection.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
