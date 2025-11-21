# Simple Todo Frontend

Next.js frontend for the Simple Todo API with wallet and authentication features.

## Setup & Run

1. **Copy environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Update `.env.local`:**
   Set `NEXT_PUBLIC_API_BASE_URL` to your backend API URL (e.g., `http://localhost:3000`)

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3001](http://localhost:3001)

## Build for Production

```bash
npm run build
npm start
```

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Base URL of the backend API (required)

## Features

- User authentication (register, login, OTP verification)
- Wallet management (fund, transfer, withdraw)
- Transaction history with pagination
- Bill payments (airtime & bills)
- Admin dashboard
- Responsive design with Tailwind CSS
- Real-time notifications with react-hot-toast
