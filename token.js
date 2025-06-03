const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

// 토큰 저장소 (메모리 기반, Redis 등으로 교체 가능)
const tokens = {};

// ✅ 임시 토큰 생성 API
app.post("/generate-token", (req, res) => {
  const { userId, bizid } = req.body;

  if (!userId || !bizid) {
    return res.status(400).json({ error: "Missing userId or bizid" });
  }

  const token = uuidv4();
  tokens[token] = {
    userId,
    bizid,
    createdAt: Date.now()
  };

  res.json({ token });
});

// ✅ 토큰 검증 API
app.post("/verify-token", (req, res) => {
  const { token, userId, bizid } = req.body;

  if (!token || !userId || !bizid) {
    return res.send(JSON.stringify({ valid: false, error: "Missing data" }));
  }

  const tokenData = tokens[token];
  if (!tokenData) {
    return res.send(JSON.stringify({ valid: false, error: "Invalid token" }));
  }

  const now = Date.now();
  const isExpired = now - tokenData.createdAt > 2 * 60 * 1000; // 2분 제한

  if (isExpired) {
    delete tokens[token];
    return res.send(JSON.stringify({ valid: false, error: "Token expired" }));
  }

  if (tokenData.userId !== userId || tokenData.bizid !== bizid) {
    return res.send(JSON.stringify({ valid: false, error: "Token mismatch" }));
  }

  delete tokens[token]; // ✅ 일회용 사용 후 제거
  return res.send(JSON.stringify({ valid: true }));
});

// ✅ 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎯 Token server running on port ${PORT}`);
});
