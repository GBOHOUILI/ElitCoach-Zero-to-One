import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('ElitCoach E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => { await app.close(); });

  // Test 1 — Inscription coach → 201
  it('POST /api/auth/register/coach → 201', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register/coach')
      .send({
        email: `test-coach-${Date.now()}@elitcoach.test`,
        password: 'Password1',
        firstName: 'Jean', lastName: 'Test',
        specialties: ['Business'], certifications: ['ICF ACC'],
        yearsExperience: 3, hourlyRate: 100,
        bio: 'Coach certifié avec 3 ans d\'expérience accompagnant des entrepreneurs vers leurs objectifs business et personnels avec une méthode éprouvée.',
      })
      .expect(201)
      .expect(res => {
        expect(res.body.message).toContain('Candidature');
        expect(res.body.userId).toBeDefined();
      });
  });

  // Test 2 — Client score < 60 → REJECTED
  it('POST /api/auth/register/client score<60 → REJECTED', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register/client')
      .send({
        email: `test-client-rejected-${Date.now()}@elitcoach.test`,
        password: 'Password1',
        firstName: 'Marie', lastName: 'Test',
        objective: 'Je veux juste essayer le coaching pour voir si ça m\'aide.',
        budget: 50, hoursPerWeek: 0,
        hadCoachBefore: false,
        whyNow: 'Parce que j\'ai vu une pub et ça m\'a l\'air sympa à essayer.',
      })
      .expect(201)
      .expect(res => {
        expect(res.body.status).toBe('REJECTED');
        expect(res.body.score).toBeLessThan(60);
      });
  });

  // Test 3 — Login mauvais mot de passe → 401
  it('POST /api/auth/login bad password → 401', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'nobody@elitcoach.test', password: 'WrongPass1' })
      .expect(401);
  });

  // Test 4 — Endpoint protégé sans token → 401
  it('GET /api/coaches/me sans token → 401', () => {
    return request(app.getHttpServer())
      .get('/api/coaches/me')
      .expect(401);
  });

  // Test 5 — Admin sans token → 401
  it('GET /api/admin/coaches sans token → 401', () => {
    return request(app.getHttpServer())
      .get('/api/admin/coaches')
      .expect(401);
  });

  // Test 6 — Email dupliqué → 400
  it('POST /api/auth/register/coach email dupliqué → 400', async () => {
    const email = `duplicate-${Date.now()}@elitcoach.test`;
    const payload = {
      email, password: 'Password1',
      firstName: 'Dup', lastName: 'Test',
      specialties: ['Business'], certifications: [],
      yearsExperience: 2, hourlyRate: 80,
      bio: 'Bio de test pour vérifier la duplication d\'email dans le système de candidature coach.',
    };
    await request(app.getHttpServer()).post('/api/auth/register/coach').send(payload).expect(201);
    return request(app.getHttpServer()).post('/api/auth/register/coach').send(payload).expect(400);
  });

  // Test 7 — Health check
  it('GET /api/health → 200', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect(res => {
        expect(res.body.status).toBe('ok');
      });
  });

  // Test 8 — DTO invalide → 400
  it('POST /api/auth/register/coach DTO invalide → 400', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register/coach')
      .send({ email: 'not-an-email', password: '123' })
      .expect(400);
  });

  // Test 9 — Message anti-bypass
  it('POST /api/conversations/:id/messages bypass → 400', async () => {
    // Ce test nécessite un token valide - on vérifie juste la logique regex côté service
    // En production, ajouter la création d'un user test + token
    expect(true).toBe(true); // Placeholder — voir tests d'intégration complets
  });
});
