# 🧠 Identity Reconciliation - Bitespeed Backend Task

## 📌 Task Overview

This project is a solution to the [Bitespeed Backend Task](https://www.bitespeed.in/) focused on **identity reconciliation** for customer contacts.

When users place orders using different combinations of phone numbers and email addresses, the goal is to **link all of them to a single primary contact**.

FluxKart uses Bitespeed to manage user identities, and this backend service implements:

- `/identify` API
- Contact linkage logic
- Conflict resolution (primary vs secondary)
- Clean and extensible code with Prisma ORM

---

## 🚀 Live Demo

**✅ Deployed App:**  
🔗 [https://identity-reconciliation-three.vercel.app](https://identity-reconciliation-three.vercel.app)

You can test it using Postman, Curl, or the UI of your choice.

---

## 🛠️ Tech Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **Prisma ORM**
- **SQLite** (can be easily switched to PostgreSQL)
- **Vercel** (deployment)

---

## 🔄 `/identify` Endpoint

**Method:** `POST`  
**URL:** `https://identity-reconciliation-three.vercel.app/identify`

### 🔸 Request Body (JSON)

```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
