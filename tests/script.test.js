const request = require('supertest');
const app = require('../src/app');

const validPassword = 'Password1';

const validUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: validPassword,
};

let authToken = '';

// Auth Routes
describe('POST /api/api/auth/register', () => {
    it('201 - register berhasil', async () => {
        const res = await request(app).post('/api/auth/register').send(validUser);
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it('409 - email sudah terdaftar', async () => {
        const res = await request(app).post('/api/auth/register').send(validUser);
        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });

    it('422 - email tidak valid', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ ...validUser, email: 'bukan-email' });
        expect(res.status).toBe(422);
    });

    it('422 - password kurang dari 8 karakter', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ ...validUser, email: 'lain@example.com', password: 'Ab1' });
        expect(res.status).toBe(422);
    });

    it('422 - password tanpa huruf besar', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ ...validUser, email: 'lain@example.com', password: 'password1' });
        expect(res.status).toBe(422);
    });

    it('422 - password tanpa angka', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ ...validUser, email: 'lain@example.com', password: 'PasswordABC' });
        expect(res.status).toBe(422);
    });
});

describe('POST /api/auth/login', () => {
    it('200 - login berhasil dan dapat token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: validUser.email, password: validUser.password });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        authToken = res.body.token;
    });

    it('401 - password salah', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: validUser.email, password: 'WrongPass1' });
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('401 - email tidak terdaftar', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'tidakada@example.com', password: validPassword });
        expect(res.status).toBe(401);
    });

    it('422 - email kosong', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ password: validPassword });
        expect(res.status).toBe(422);
    });
});

describe('POST /api/auth/changePassword', () => {
    const newPassword = 'NewPassword1';

    it('200 - ganti password berhasil', async () => {
        const res = await request(app)
            .post('/api/auth/changePassword')
            .send({ email: validUser.email, oldPassword: validPassword, newPassword: newPassword });
        expect(res.status).toBe(200);

        await request(app)
            .post('/api/auth/changePassword')
            .send({ email: validUser.email, oldPassword: newPassword, newPassword: validPassword });
    });

    it('401 - oldPassword salah', async () => {
        const res = await request(app)
            .post('/api/auth/changePassword')
            .send({ email: validUser.email, oldPassword: 'WrongPass1', newPassword: newPassword });
        expect(res.status).toBe(401);
    });

    it('422 - newPassword sama dengan oldPassword', async () => {
        const res = await request(app)
            .post('/api/auth/changePassword')
            .send({ email: validUser.email, oldPassword: validPassword, newPassword: validPassword });
        expect(res.status).toBe(422);
    });

    it('422 - newPassword tidak memenuhi syarat', async () => {
        const res = await request(app)
            .post('/api/auth/changePassword')
            .send({ email: validUser.email, oldPassword: validPassword, newPassword: 'lemah' });
        expect(res.status).toBe(422);
    });
});

// User Routes
describe('GET /api/users/me', () => {
    it('200 - dapat data user sendiri', async () => {
        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe(validUser.email);
    });

    it('401 - tanpa token', async () => {
        const res = await request(app).get('/api/users/me');
        expect(res.status).toBe(401);
    });
});

describe('GET /api/users', () => {
    it('200 - dapat list semua user', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('401 - tanpa token', async () => {
        const res = await request(app).get('/api/users');
        expect(res.status).toBe(401);
    });
});

describe('GET /api/users/count', () => {
    it('200 - dapat jumlah user', async () => {
        const res = await request(app)
            .get('/api/users/count')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(typeof res.body.data).toBe('number');
    });

    it('401 - tanpa token', async () => {
        const res = await request(app).get('/api/users/count');
        expect(res.status).toBe(401);
    });
});