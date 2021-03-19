import 'dotenv/config';
import mongoose from 'mongoose';
import { DATABASE_URI_TEST } from '../config/testConfig';
import path from 'path';
import supertest from 'supertest';

export const connectToDatabase = mongoose.connect(DATABASE_URI_TEST!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  console.log('Connected to the database');
});

export const postImage = async (request: supertest.SuperTest<supertest.Test>): Promise<void> => {
  await request.post('/api/v1/images')
    .attach('image', path.join(__dirname, '..', '/mock/mock.png'));
};
