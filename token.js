import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

const tokenStore = new Map();

app.post('/create-token', (req, res) => {
  const { bizid, userId } = req.body;
  if (!bizid || !userId) {
    return res.status(400).json({ error: 'Missing bizid or userId' });
  }

  const token = crypto.randomUUID();
  const expires = Date.now() + 1000 * 60 * 2;

  tokenStore.set(token, { bizid, userId, expires });
  res.json({ token });
});

app.get('/verify-token/:token', (req, res) => {
  const token = req.params.token;
  const tokenData = tokenStore.get(token);

  if (!tokenData) {
    return res.status(404).json({ error: 'Invalid token' });
  }

  if (Date.now() > tokenData.expires) {
    tokenStore.delete(token);
    return res.status(410).json({ error: 'Expired token' });
  }

  tokenStore.delete(token);
  res.json(tokenData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔐 Token server running on port ${PORT}`);
});
