# Dev-Tinder — Backend

REST API backend for a developer matching platform built with Node.js, Express, and MongoDB.

## Features

- **Authentication** — Signup/login with bcrypt password hashing, JWT issued as httpOnly secure cookies, logout with cookie clearing, and password change with current-password verification
- **Profile Management** — View and edit profile fields, change password with validation
- **Developer Feed** — Paginated feed that excludes users already connected, ignored, or pending
- **Connection System** — Send interest or ignore requests with duplicate-request guards; accept or reject incoming requests
- **Premium Membership** — Razorpay payment integration with webhook signature validation to activate premium status
- **Email Notifications** — AWS SES transactional emails on connection events; daily cron job to notify users of pending requests from the previous day
- **Real-time** — Socket.io server with room-based chat scaffolding

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ESM) |
| Framework | Express v5 |
| Database | MongoDB via Mongoose |
| Auth | JWT + bcrypt |
| Payments | Razorpay |
| Email | AWS SES |
| Real-time | Socket.io |
| Scheduling | node-cron |

## Project Structure

```
src/
├── config/
│   └── database.js        # MongoDB connection
├── middlewares/
│   └── auth.js            # JWT cookie verification middleware
├── models/
│   ├── user.js            # User schema with JWT + password methods
│   ├── connectionRequest.js
│   └── payments.js
├── routes/
│   ├── auth.js            # Signup, login, logout
│   ├── profile.js         # View, edit, password change
│   ├── request.js         # Send and review connection requests
│   ├── user.js            # Feed, connections, received requests
│   └── payment.js         # Razorpay order creation and webhook
└── utils/
    ├── cronJob.js          # Daily email digest
    ├── sendEmail.js        # AWS SES wrapper
    ├── sesClient.js        # SES client config
    ├── socket.js           # Socket.io initialisation
    ├── razorpay.js         # Razorpay instance
    ├── hashPassword.js     # bcrypt helper
    ├── validation.js       # Input validators
    └── constants.js        # Membership amounts
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Razorpay account
- AWS account with SES configured

### Installation

```bash
git clone https://github.com/Robin-singh24/Dev-Tinder.git
cd Dev-Tinder
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLIENT_URL=https://your-frontend-url.vercel.app

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
SES_SENDER_EMAIL=your_verified_ses_email
```

### Run

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | No | Register new user |
| POST | `/login` | No | Login, sets JWT cookie |
| POST | `/logout` | No | Clears JWT cookie |

### Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile/view` | Yes | Get own profile |
| PATCH | `/profile/edit` | Yes | Update profile fields |
| PATCH | `/profile/password` | Yes | Change password |

### Connection Requests

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/request/send/:status/:userId` | Yes | Send `interested` or `ignored` request |
| POST | `/request/review/:status/:userId` | Yes | `accepted` or `rejected` incoming request |

### User

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/user/feed` | Yes | Paginated developer feed |
| GET | `/user/connections` | Yes | List of accepted connections |
| GET | `/user/requests/received` | Yes | Pending incoming requests |

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payment/create` | Yes | Create Razorpay order |
| POST | `/payment/webhook` | No | Handle Razorpay webhook |
| GET | `/premium/verify` | Yes | Check premium status |
