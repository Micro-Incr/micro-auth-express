import 'dotenv/config';
import app from '../app';
import mongoose from 'mongoose';
import supertest from 'supertest';

const request = supertest(app);


it('Gets the invalid endpoint and return a 404 status', async (done) => {
  const response = await request.get('/test');
  expect(response.status).toBe(404);
  expect(response.body).toMatchObject({ error: 'Nothing here' });
  done();
});

afterAll((done) => {
  mongoose.disconnect(done);
});
