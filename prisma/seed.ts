import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ElitCoach...');

  const hash = (pwd: string) => bcrypt.hash(pwd, 12);

  // ─── ADMIN ───────────────────────────────────────────────
  const adminHash = await hash('Admin1234');
  await prisma.user.upsert({
    where: { email: 'admin@elitcoach.co' },
    update: {},
    create: {
      email: 'admin@elitcoach.co',
      passwordHash: adminHash,
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log('✅ Admin — admin@elitcoach.co / Admin1234');

  // ─── COACH APPROUVÉ ──────────────────────────────────────
  const coachHash = await hash('Coach1234');
  const coachUser = await prisma.user.upsert({
    where: { email: 'sophie@elitcoach.co' },
    update: {},
    create: {
      email: 'sophie@elitcoach.co',
      passwordHash: coachHash,
      role: 'COACH',
      emailVerified: true,
      coachProfile: {
        create: {
          firstName: 'Sophie',
          lastName: 'Laurent',
          bio: "Coach certifiée ICF PCC avec 8 ans d'expérience en business coaching et leadership. J'accompagne des entrepreneurs et dirigeants vers leurs objectifs avec une approche pragmatique et orientée résultats. Mes clients augmentent leur CA en moyenne de 40% en 6 mois grâce à une méthode éprouvée.",
          specialties: ['Business', 'Leadership', 'Performance'],
          certifications: ['ICF PCC', 'RNCP Niveau 7'],
          yearsExperience: 8,
          hourlyRate: 150,
          status: 'APPROVED',
          isVerified: true,
          score: 892,
          slug: 'sophie-laurent',
        },
      },
    },
    include: { coachProfile: true },
  });

  const coach = await prisma.coachProfile.findUnique({ where: { userId: coachUser.id } });
  if (coach) {
    await prisma.availability.deleteMany({ where: { coachId: coach.id } });
    await prisma.availability.createMany({
      data: [
        { coachId: coach.id, dayOfWeek: 1, startTime: '09:00', endTime: '10:00' },
        { coachId: coach.id, dayOfWeek: 1, startTime: '10:00', endTime: '11:00' },
        { coachId: coach.id, dayOfWeek: 1, startTime: '14:00', endTime: '15:00' },
        { coachId: coach.id, dayOfWeek: 3, startTime: '09:00', endTime: '10:00' },
        { coachId: coach.id, dayOfWeek: 3, startTime: '11:00', endTime: '12:00' },
        { coachId: coach.id, dayOfWeek: 5, startTime: '10:00', endTime: '11:00' },
        { coachId: coach.id, dayOfWeek: 5, startTime: '15:00', endTime: '16:00' },
      ],
    });
  }
  console.log('✅ Coach approuvé — sophie@elitcoach.co / Coach1234');

  // ─── CLIENT APPROUVÉ ─────────────────────────────────────
  const clientHash = await hash('Client1234');
  const clientUser = await prisma.user.upsert({
    where: { email: 'marc@elitcoach.co' },
    update: {},
    create: {
      email: 'marc@elitcoach.co',
      passwordHash: clientHash,
      role: 'CLIENT',
      emailVerified: true,
      clientProfile: {
        create: {
          firstName: 'Marc',
          lastName: 'Dupont',
          objective: "Signer 3 nouveaux clients enterprise et atteindre 15 000€ de CA mensuel récurrent d'ici 3 mois grâce à une stratégie commerciale structurée.",
          budget: 450,
          hoursPerWeek: 3,
          hadCoachBefore: true,
          previousCoachResult: "Augmenté mon CA de 30% en 4 mois. Arrêté car déménagement.",
          whyNow: "Mon entreprise stagne depuis 6 mois et j'ai un salon professionnel en mars.",
          qualifyScore: 100,
          status: 'APPROVED',
        },
      },
    },
    include: { clientProfile: true },
  });

  const client = await prisma.clientProfile.findUnique({ where: { userId: clientUser.id } });

  if (coach && client) {
    // Session passée complétée
    const pastSession = await prisma.session.upsert({
      where: { id: 'seed-session-001' },
      update: {},
      create: {
        id: 'seed-session-001',
        coachId: coach.id,
        clientId: client.id,
        scheduledAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
        durationMins: 60,
        status: 'COMPLETED',
        price: 150,
        zoomLink: 'https://zoom.us/j/1234567890',
        coachNotes: "Excellente session. Marc a bien avancé sur sa stratégie de prospection.",
      },
    });

    await prisma.review.upsert({
      where: { sessionId: 'seed-session-001' },
      update: {},
      create: {
        sessionId: 'seed-session-001',
        coachId: coach.id,
        clientId: client.id,
        rating: 5,
        comment: "Sophie est exceptionnelle. En une session, j'ai eu plus de clarté que depuis 6 mois.",
        listening: 5, methodology: 5, results: 4, punctuality: 5,
      },
    });

    // Session à venir
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(9, 0, 0, 0);

    await prisma.session.upsert({
      where: { id: 'seed-session-002' },
      update: {},
      create: {
        id: 'seed-session-002',
        coachId: coach.id,
        clientId: client.id,
        scheduledAt: nextWeek,
        durationMins: 60,
        status: 'CONFIRMED',
        price: 150,
        zoomLink: 'https://zoom.us/j/9876543210',
      },
    });

    // Objectif
    const goal = await prisma.goal.upsert({
      where: { id: 'seed-goal-001' },
      update: {},
      create: {
        id: 'seed-goal-001',
        coachId: coach.id,
        clientId: client.id,
        title: 'Atteindre 15 000€ de CA mensuel récurrent',
        description: 'Structurer la stratégie commerciale pour signer 3 clients enterprise en 3 mois.',
        targetDate: new Date(Date.now() + 90 * 24 * 3600 * 1000),
        progress: 35,
        status: 'ACTIVE',
        steps: {
          create: [
            { title: "Définir le profil client idéal (ICP)", order: 1, isCompleted: true, completedAt: new Date() },
            { title: "Créer le pitch commercial en 3 minutes", order: 2, isCompleted: true, completedAt: new Date() },
            { title: "Construire une liste de 50 prospects qualifiés", order: 3, isCompleted: false },
            { title: "Envoyer 10 emails de prospection", order: 4, isCompleted: false, dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000) },
            { title: "Obtenir 3 rendez-vous qualifiés", order: 5, isCompleted: false, dueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000) },
          ],
        },
      },
    });

    await prisma.checkIn.upsert({
      where: { id: 'seed-checkin-001' },
      update: {},
      create: {
        id: 'seed-checkin-001',
        goalId: goal.id,
        clientId: client.id,
        answers: {
          q1: "J'ai défini mon ICP et créé mon pitch.",
          q2: "La clarté sur mon client idéal m'aide à filtrer plus vite.",
          q3: "7/10 — Je me sens bien orienté mais j'hésite sur le pricing.",
          q4: "Le pricing reste mon point faible.",
          q5: "Construire ma liste de 50 prospects et envoyer les 10 premiers emails.",
        },
        coachNote: "Très bon check-in Marc. Sur le pricing : annonce-le avec conviction, pas en excuse.",
      },
    });

    // Conversation
    const conv = await prisma.conversation.upsert({
      where: { coachId_clientId: { coachId: coach.id, clientId: client.id } },
      update: {},
      create: { coachId: coach.id, clientId: client.id },
    });

    await prisma.message.createMany({
      skipDuplicates: true,
      data: [
        { conversationId: conv.id, senderId: coachUser.id, content: "Bonjour Marc ! Ravi de commencer cette aventure ensemble.", createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000) },
        { conversationId: conv.id, senderId: clientUser.id, content: "Merci Sophie ! J'ai quelques questions avant notre première session.", createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000) },
        { conversationId: conv.id, senderId: coachUser.id, content: "Posez-moi toutes vos questions ici, on clarifiera tout.", createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000) },
      ],
    });
  }

  // Coach en screening
  await prisma.user.upsert({
    where: { email: 'julien@elitcoach.co' },
    update: {},
    create: {
      email: 'julien@elitcoach.co',
      passwordHash: await hash('Coach1234'),
      role: 'COACH',
      emailVerified: true,
      coachProfile: {
        create: {
          firstName: 'Julien', lastName: 'Martin',
          bio: "Coach en développement personnel avec 4 ans d'expérience auprès de cadres en reconversion professionnelle cherchant à donner plus de sens à leur parcours.",
          specialties: ['Confiance en soi', 'Carrière'],
          certifications: ['RNCP Coach'],
          yearsExperience: 4, hourlyRate: 100,
          status: 'SCREENING', isVerified: false, score: 0,
        },
      },
    },
  });

  console.log('\n🎉 Seed terminé !');
  console.log('\n📋 COMPTES DE TEST :');
  console.log('   Admin    : admin@elitcoach.co  / Admin1234  → /admin');
  console.log('   Coach ✓  : sophie@elitcoach.co / Coach1234  → /dashboard/coach');
  console.log('   Client ✓ : marc@elitcoach.co   / Client1234 → /dashboard/client');
  console.log('   Coach 🕐 : julien@elitcoach.co / Coach1234  → (screening)');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
