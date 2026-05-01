# ElitCoach — Guide de Déploiement V1.0

## Toi (actions manuelles requises)

### S-007 — Comptes services (dans cet ordre)
1. **Supabase** → supabase.com → New project → copier `DATABASE_URL` de Settings/Database
2. **Brevo** → brevo.com → copier `BREVO_API_KEY` de Settings/API Keys
3. **Stripe** → stripe.com → mode test d'abord → copier `STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY`
4. **Cloudinary** → cloudinary.com → copier `CLOUDINARY_URL`
5. **Upstash** → upstash.com → Redis → copier `REDIS_URL`

### S-010 — Domaine
- Cloudflare Registrar → acheter `elitcoach.co` (~10$/an)

### M-001 — Recrutement coachs (avant lancement)
- LinkedIn : identifier 50 coachs ICF PCC/EMCC certifiés
- DM personnalisé → rediriger vers /register/coach
- Objectif : 5 coaches approuvés minimum avant J

---

## Moi (code déjà prêt)

### Backend → Railway
```bash
npm install -g @railway/cli
railway login
railway new
# Lier /backend
railway up
# Configurer les variables du .env.production.example
# Domaine custom : api.elitcoach.co
```

### Frontend → Vercel
```bash
npm install -g vercel
vercel --cwd frontend deploy
# Variables : NEXT_PUBLIC_API_URL=https://api.elitcoach.co
# Domaine : elitcoach.co
```

### Migration Prisma production
```bash
cd backend
DATABASE_URL="postgresql://..." pnpm exec prisma migrate deploy
```

### Stripe Webhook production
- Dashboard Stripe → Webhooks → ajouter `https://api.elitcoach.co/api/sessions/webhook/stripe`
- Events : `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copier le `STRIPE_WEBHOOK_SECRET` dans Railway

### Supabase RLS
- Activer Row Level Security sur toutes les tables
- Policy coach : `auth.uid() = user_id`
- Policy client : `auth.uid() = user_id`
- Policy admin : `get_role() = 'ADMIN'`

---

## Stack
- **Backend** : NestJS + Prisma + PostgreSQL (Supabase) + Redis (Upstash)
- **Frontend** : Next.js 14 App Router + Tailwind CSS
- **Paiement** : Stripe (pré-autorisation + capture manuelle)
- **Emails** : Brevo (transactionnel)
- **Vidéos** : Cloudinary
- **Hébergement** : Railway (API) + Vercel (Front)
- **DNS** : Cloudflare

## Checklist avant lancement
- [ ] S-007 : Tous les comptes services créés
- [ ] S-010 : Domaine elitcoach.co acheté
- [ ] Railway : Backend déployé + health check OK
- [ ] Vercel : Frontend déployé
- [ ] Stripe : Mode live activé + webhook configuré
- [ ] Supabase : RLS activé + migration déployée
- [ ] M-001 : 5+ coaches approuvés
- [ ] Test end-to-end : inscription → réservation → paiement → complétion
