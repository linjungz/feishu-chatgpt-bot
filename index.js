import express from 'express'
const app = express()

import { ChatGPTAPI } from 'chatgpt'
import dotenv from 'dotenv'

dotenv.config()

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY
})


app.get('/', (req, res) => {
    console.log(req);
});

app.use(express.json({extended: true, limit: '1mb'}))

app.post('/verify', (req, res) => {
    console.log(req.body);
    const challenge = req.body.challenge;
    res.status(200).json({
      'challenge': challenge
    });
})

app.listen(3000, () => {
  console.log('My ChatGPT Bot listening on port 3000!');
});