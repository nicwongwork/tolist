import request from 'supertest';
import app from '../app';
import { pool } from '../config/db';

jest.mock('../config/db', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('Backend Duty API Unit Tests', () => {
  describe('GET /api/duties', () => {
    it('should return 200 and a list of duties', async () => {
      const mockData = {
        rows: [
          { id: '1', name: 'Test Duty 1' },
          { id: '2', name: 'Test Duty 2' }
        ]
      };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockData);

      const res = await request(app).get('/api/duties');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].name).toBe('Test Duty 1');
    });
  });

  describe('POST /api/duties (Edge Cases & Correct Error Communication)', () => {
    it('should return 201 and the created duty when input is valid', async () => {
      const mockCreatedRow = { rows: [{ id: '99', name: 'Valid New Duty' }] };
      (pool.query as jest.Mock).mockResolvedValueOnce(mockCreatedRow);

      const res = await request(app)
        .post('/api/duties')
        .send({ name: 'Valid New Duty' });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Valid New Duty');
    });

    it('should return 400 when name is an empty string (Edge Case)', async () => {
      const res = await request(app)
        .post('/api/duties')
        .send({ name: '' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.message).toContain('required');
    });

    it('should return 400 when name is only whitespaces (Edge Case)', async () => {
      const res = await request(app)
        .post('/api/duties')
        .send({ name: '     ' });

      expect(res.status).toBe(400);
    });

    it('should return 400 when name exceeds 100 characters (Edge Case)', async () => {
      const longName = 'a'.repeat(101);
      const res = await request(app)
        .post('/api/duties')
        .send({ name: longName });

      expect(res.status).toBe(400);
    });
  });
});