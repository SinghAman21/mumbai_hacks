# SpendSplitAI 💰

> AI-powered expense tracking and group financial management platform

SpendSplitAI is a modern web application designed to simplify expense tracking and group financial management. Built with AI capabilities, it helps users track expenses, split bills fairly among group members, and maintain financial transparency in shared living or collaborative environments.

## ✨ Key Features

### 🤖 AI-Powered Expense Processing
- **Smart Receipt Scanning**: Upload receipt images and let AI extract expense details automatically
- **Natural Language Input**: Add expenses using conversational text (e.g., "Dinner at restaurant $45 split 3 ways")
- **Intelligent Categorization**: Automatic expense categorization based on description

### 👥 Group Management
- **Create & Join Groups**: Organize expenses by teams, trips, roommates, or events
- **Invite System**: Temporary invite links with 10-minute expiry for secure group joining
- **Member Roles**: Owner and member permissions for group administration
- **Activity Logs**: Track all group actions and changes

### 💸 Expense Tracking
- **Transaction Management**: Record, approve, dispute, or reject expenses
- **Fairness Calculations**: Analyze spending patterns and ensure equitable contributions
- **Customizable Thresholds**: Set minimum limits to ignore small expenses in fairness calculations
- **Real-time Updates**: See expense updates as they happen

### 📊 Analytics & Insights
- **Spending Charts**: Visualize expense trends over time
- **Per-User Analytics**: View individual member spending and contributions
- **Balance Tracking**: Monitor who owes what to whom
- **Time-based Reports**: Filter by last 7 days or 30 days

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Mode Support**: User can toggle between light and dark themes
- **Mobile Drawer Navigation**: Touch-friendly interface for settings and details
- **Real-time Notifications**: In-app alerts for pending transactions and group activities

## 🛠️ Tech Stack

### Backend
- **Django** - Web framework with Django Ninja for API endpoints
- **PostgreSQL** - Relational database (Supabase)
- **Google Generative AI** - AI-powered expense parsing from text and images
- **Clerk** - Authentication and user management
- **Python 3.10+** - Core language

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **TanStack Query** - Server state management with caching
- **Tailwind CSS v4** - Utility-first styling
- **Shadcn UI** - High-quality accessible components
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive data visualization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.10+
- PostgreSQL database (or Supabase account)
- Clerk account for authentication
- Google Generative AI API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file with required variables:
```env
SECRET_KEY=your_django_secret_key
DJANGO_DEBUG=true
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
FRONTEND_BASE_URL=http://localhost:3000

# Database (Supabase)
HOST=your_supabase_host
PORT=5432
USER=postgres
PASSWORD=your_password
DB_NAME=postgres

# Authentication
CLERK_SECRET_KEY=your_clerk_secret_key

# AI
GOOGLE_API_KEY=your_google_ai_key
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Start development server:
```bash
python manage.py runserver
```

Backend runs at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

4. Start development server:
```bash
pnpm dev
```

Frontend runs at `http://localhost:3000`

## 📱 Usage

1. **Sign Up/Login** - Create account or sign in with Clerk authentication
2. **Create Group** - Start a new group for your team, trip, or shared expenses
3. **Add Expenses** - Use AI to scan receipts, type descriptions, or upload images
4. **Track Spending** - View analytics, approve transactions, and monitor balances
5. **Manage Settings** - Customize group preferences and fairness thresholds

## 🔐 Security Features

- Secure authentication via Clerk
- JWT-based API authorization
- CORS protection
- CSRF protection
- Environment variable isolation
- Temporary invite links with expiration

## 📦 Deployment

### Backend (Django)
Recommended platforms: Render, Railway, Fly.io

Required environment variables:
- All variables from local `.env`
- Set `DJANGO_DEBUG=false`
- Update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` with production URLs

### Frontend (Next.js)
Recommended platforms: Vercel, Netlify

Required environment variables:
- `NEXT_PUBLIC_API_URL` - Production backend URL
- Clerk keys for authentication

## 👥 Team

- **Tanishq Chavan** - Full Stack Developer
- **Aman Singh** - Developer
- **Sumedh Hadkar** - Developer
- **Pranav Waghmare** - Developer

## 📄 License

This project is developed for Mumbai Hacks hackathon.

---

Built with ❤️ by the SpendSplitAI Team
