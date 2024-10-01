import express = require('express');
import { Express, Request, Response } from 'express';
import multer = require('multer');
import { Multer } from 'multer';
import { Parser } from './parser';

const app: Express = express();
const port = 3000;
const upload = multer();

app.get('/healthcheck', (req: Request, res: Response) => {
  res.json({ 'healthy': true });
});

app.post('/to/native/ts/ast', upload.single('source'), (req: Request, res: Response) => {
  if (req.file === undefined) {
    res.send({ status: 'FAIL' })
  } else {
    const parser = new Parser('moish', `${req.file.buffer}`);
    const ast = parser.run();
    res.send(ast);
  }
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
});
