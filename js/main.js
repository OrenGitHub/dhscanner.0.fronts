const multer = require('multer');
const esprima = require('esprima');
const express = require('express');
const winston = require('winston');

const app = express()
const port = 3000

const upload = multer();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'DD/MM/YYYY ( HH:mm:ss )' }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
      })
    ),
    transports: [new winston.transports.Console()]
});

app.get('/healthcheck', (req, res) => {
  res.json({ 'healthy': true })
})

app.post('/to/esprima/js/ast', upload.single('source'), (req, res) => {
  sourceCode = `${req.file.buffer}`
  let ast;
  try {
    ast = esprima.parseModule(sourceCode, { loc: true });
  }
  catch (error) {
    try {
      ast = esprima.parseScript(sourceCode, { loc: true });
    }
    catch (error) {
      logger.warn(`parse error: ${req.file.originalname}`)
      ast = { status: "FAIL" };
    }
  }

  res.send(`${JSON.stringify(ast)}`)
})

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})
