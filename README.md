# SpendSplit

This repository contains the source code for the Mumbai Hacks project, featuring a Django backend integrated with Supabase and a Next.js frontend with modern UI components.

## 🚀 Tech Stack

### Backend
- **Framework:** Django (with Django Ninja)
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Clerk (clerk-backend-api)
- **AI Integration:** Google Generative AI
- **Other Tools:** `python-dotenv`, `psycopg2-binary`, `Pillow`

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Tailwind Merge, CLSX
- **Components:** Radix UI (Primitives), Lucide React (Icons), Shadcn UI (Components)
- **Authentication:** Clerk (@clerk/nextjs)
- **Charts:** Recharts
- **Animations:** Framer Motion
- **State/Data:** React 19

## 📋 Prerequisites

Ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **Python** (v3.10+ recommended)
- **npm** or **pnpm**
- **PostgreSQL** (Local instance for development, if needed)

## 🛠️ Installation & Setup

### 1. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Create a virtual environment (optional but recommended):

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend` directory and add the following (based on `settings.py`):

```env
SUPABASE_PASSWORD=your_supabase_password
SUPABASE_HOST=your_supabase_host
SUPABASE_USERNAME=your_supabase_username
# Add other keys as required by your project (e.g., CLERK_SECRET_KEY, GOOGLE_API_KEY)
```

Run Migrations:

```bash
# Migrate remote Supabase DB
python manage.py migrate
```

Start the Backend Server:

```bash
python manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000`.

### 2. Frontend Setup

Navigate to the `frontend` directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
# or
pnpm install
```

**Environment Variables:**
Create a `.env.local` file in the `frontend` directory. You will likely need Clerk API keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
# Add other public/private keys as needed
```

Start the Frontend Development Server:

```bash
npm run dev
# or
pnpm dev
```

The frontend will be available at `http://localhost:3000`.

## 📂 Project Structure

```
├── backend/                # Django Backend
│   ├── APP/                # Main Application Logic
│   ├── PROJ/               # Project Settings & Configuration
│   ├── manage.py           # Django Management Script
│   └── requirements.txt    # Python Dependencies
│
├── frontend/               # Next.js Frontend
│   ├── app/                # App Router Pages & Layouts
│   ├── components/         # Reusable UI Components
│   ├── lib/                # Utility Functions
│   ├── public/             # Static Assets
│   └── package.json        # Node.js Dependencies
│
└── README.md               # Project Documentation (This file)
```
## Team Members

- Aman Singh (Lead)
- Sumedh Hadkar
- Tanishq Chavan
- Pranav Waghmare
