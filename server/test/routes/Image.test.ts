import Image from '../../models/Image';
import supertest from 'supertest';
import app from '../../app';
import path from 'path';
import fs from 'fs';
import { connectToDatabase } from '../functions/helper';
import mongoose from 'mongoose';

const request = supertest(app);

let image: string;
let id: string;
let filePath: string;

beforeAll(async (done) => {
  await connectToDatabase;
  done();
});

async function uploadImageTestHelper() {
  const res = await request.post('/api/v1/images')
    .attach('image', path.join(__dirname, '..', '/mock/mock.png'));
  image = res.body.image;
  id = res.body._id;
  filePath = path.join(__dirname, '../../..', '/images/development/') + image;
  return res;
}

describe('Image routes test', () => {
  beforeEach(async (done) => {
    await Image.deleteMany().exec();
    const exists = fs.existsSync(path.join(__dirname, '..', '/mock/mock.png'));
    if (!exists) {
      throw new Error('File does not exist');
    }
    done();
  });

  describe('Test post image route', () => {
    it('Should post an image', async (done) => {
      const res = await uploadImageTestHelper();
      expect(res.status).toBe(201);
      done();
    });
  });

  describe('Test get image route', () => {

    beforeEach(async (done) => {
      await uploadImageTestHelper();
      done();
    });

    afterEach(async (done) => {
      filePath = path.join(__dirname, '../../..', '/images/development/') + image;
      fs.unlinkSync(filePath);
      done();
    });

    it('Should get all the image from the database', async (done) => {

      const res = await request.get('/api/v1/images');
      expect(res.status).toBe(200);
      done();
    });

    it('Should respond with 200 after fetching an image', async (done) => {
      const res = await request.get('/api/v1/images/' + id);
      expect(res.status).toBe(200);
      done();
    });

    it('Should throw an error for invalid image id', async (done) => {
      const res = await request.get('/api/v1/images/1');
      expect(res.status).toBe(500);
      done();
    });

    it('Should respond with 404 for a non-existing image id', async (done) => {
      const res = await request.post('/api/v1/images/123456789012');
      expect(res.status).toBe(404);
      done();
    });
  });

  describe('Test update image route', () => {

    beforeEach(async (done) => {
      await uploadImageTestHelper();
      done();
    });

    afterEach(async (done) => {
      console.log(filePath);
      filePath = path.join(__dirname, '../../..', '/images/development/') + image;
      fs.unlinkSync(filePath);
      done();
    });

    it('Should respond with 200 after updating an image', async (done) => {
      const res = await request.patch('/api/v1/images/' + id)
        .attach('image', path.join(__dirname, '..', '/mock/mock2.png'));
      expect(res.status).toBe(200);
      done();

    });

    it('Should respond with 500 server error', async (done) => {
      const res = await request.patch('/api/v1/images/1')
        .attach('image', path.join(__dirname, '..', '/mock/mock2.png'));
      expect(res.status).toBe(500);
      done();
    });

    it('Should respond with 404 for a non-existing image', async (done) => {
      const res = await request.patch('/api/v1/images/123456789012')
        .attach('image', path.join(__dirname, '..', '/mock/mock2.png'));
      expect(res.status).toBe(404);
      done();
    });
  });

  describe('Test delete image route', () => {

    beforeEach(async (done) => {
      await uploadImageTestHelper();
      done();
    });

    afterEach(async (done) => {
      filePath = path.join(__dirname, '../../..', '/images/development/') + image;
      fs.unlinkSync(filePath);
      done();
    });

    it('Should respond with 204 after deleting an image', async (done) => {
      const res = await request.delete('/api/v1/images/' + id);
      expect(res.status).toBe(204);
      done();
    });

    it('Should respond with 500 server error', async (done) => {
      const res = await request.delete('/api/v1/images/1');
      expect(res.status).toBe(500);
      done();
    });

    it('Should respond with 404 for a non-existing image', async (done) => {
      const res = await request.delete('/api/v1/images/123456789012');
      expect(res.status).toBe(404);
      done();
    });
  });

});

afterAll(async () => {
  fs.readdir(path.join(__dirname, '../../..', '/images/development/'), (err, files) => {
    if (err) {
      throw err;
    }

    for (const file of files) {
        if (file !== '.gitignore') {
            fs.unlink(path.join(path.join(__dirname, '../../..', 'images/development/'), file), err => {
                if (err) {
                    throw err;
                }
            });
        }
    }
  });
  await mongoose.disconnect();
});
