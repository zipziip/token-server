# zzim-nfc-token-server

### ✅ Purpose
This Express.js server issues and verifies short-lived one-time tokens that allow users to access a secure Wix coupon page only via NFC.

### 🧩 Endpoints

- `POST /issue-token`
  - Request: `{ userId, bizid }`
  - Response: `{ token }`

- `POST /verify-token`
  - Request: `{ token, userId, bizid }`
  - Response: `{ valid: true|false }`

### 🚀 Usage with Wix:
- `/nfc-redirect` in Wix: issues token and redirects to `/business-coupon/{bizid}?tk=...`
- `/business-coupon/{bizid}` verifies the token using this API.

### 📦 Deploy on Render:
- Connect GitHub
- Add Web Service
- Install dependencies automatically
- Set `start` command: `npm start`
