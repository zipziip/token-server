import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

const tokens = {}; // 메모리 토큰 저장

// ✅ 토큰 발급
app.post("/issue-token", (req, res) => {
  const { userId, bizid } = req.body;
  const token = uuidv4();
  tokens[token] = {
    userId,
    bizid,
    created: Date.now()
  };
  res.json({ token });
});

// ✅ 토큰 검증
app.post("/verify-token", (req, res) => {
  const { token, userId, bizid } = req.body;
  const record = tokens[token];

  const expired = !record || Date.now() - record.created > 60000; // 1분 제한
  const valid = record && record.userId === userId && record.bizid === bizid;

  if (!record || expired || !valid) {
    return res.json({ valid: false });
  }

  delete tokens[token]; // 일회성 사용
  res.json({ valid: true });
});

app.listen(3000, () => console.log("✅ Token server ready on port 3000"));
