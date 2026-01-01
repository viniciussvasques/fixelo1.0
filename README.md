# Fixelo

**Professional Home Cleaning Marketplace**

Fixelo is a modern web platform connecting customers with professional cleaners through automated matching, instant booking, and secure payments.

## 🚀 Features

- **Customer Booking Flow**: Select service → Schedule → Pay → Get matched
- **Automated Cleaner Matching**: Smart algorithm assigns best available cleaner
- **Stripe Payment Integration**: Secure payments + Connect for cleaner payouts
- **Admin Dashboard**: Full management of bookings, cleaners, and pricing

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Payments**: Stripe (Checkout + Connect)
- **Notifications**: Twilio (SMS), Resend (Email)
- **Deployment**: Vercel

## 📁 Project Structure

```
fixelo/
├── apps/
│   └── web/              # Main Next.js application
├── packages/
│   ├── database/         # Prisma schema & client
│   ├── core/             # Business logic
│   ├── types/            # Shared TypeScript types
│   ├── ui/               # Design system components
│   └── config/           # Shared configs
└── package.json
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm 9+

### Installation

```bash
# Clone repository
cd c:\services\fixelo

# Install dependencies
npm install

# Setup environment variables
cp .env.example apps/web/.env.local
# Edit apps/web/.env.local with your credentials

# Setup database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run all tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 📚 Documentation

See `/docs` folder for detailed documentation:
- Architecture overview
- API endpoints
- Database schema
- Development standards

## 🚢 Deployment

Deployed on Vercel with automatic deployments from `main` branch.

## 📄 License

Proprietary - All rights reserved

## 👥 Team

Built with ❤️ for Orlando, FL
