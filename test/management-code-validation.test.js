const assert = require('node:assert/strict');
const express = require('express');
const multer = require('multer');
const request = require('supertest');
const test = require('node:test');
const { mkdtemp, readdir, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

const requireManagementCode = require('../middleware/requireManagementCode');

const app = express();
app.use(express.json());
app.post('/document', multer().none(), requireManagementCode, (req, res) => {
  res.status(200).json({ code: req.body.code });
});

test('management creation returns structured 400 for missing or blank code', async () => {
  for (const body of [{}, { code: '' }, { code: '  ' }, { code: 123 }]) {
    const response = await request(app).post('/document').send(body);
    assert.equal(response.status, 400);
    assert.equal(response.body.error, 'validation_error');
    assert.equal(response.body.details[0].field, 'code');
  }
});

test('management creation trims a valid code in JSON and multipart requests', async () => {
  const json = await request(app).post('/document').send({ code: ' DOC-1 ' });
  assert.equal(json.status, 200);
  assert.equal(json.body.code, 'DOC-1');

  const multipart = await request(app).post('/document').field('code', ' DOC-2 ');
  assert.equal(multipart.status, 200);
  assert.equal(multipart.body.code, 'DOC-2');
});

test('invalid multipart creation removes an already uploaded file', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'gestion-invalid-upload-'));
  try {
    const uploadApp = express();
    uploadApp.post('/document', multer({ dest: directory }).single('image'), requireManagementCode, (_req, res) => {
      res.sendStatus(201);
    });

    const response = await request(uploadApp)
      .post('/document')
      .attach('image', Buffer.from('synthetic image'), { filename: 'sample.png', contentType: 'image/png' });
    assert.equal(response.status, 400);
    assert.deepEqual(await readdir(directory), []);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
