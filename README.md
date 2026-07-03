# Course Platform

A full-stack, milestone-based course platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

### 🔐 Authentication & Authorization
- Sign Up with email/password
- Sign In
- Sign Out
- Role-based access control (RBAC):
  - **Students**: Can view, enroll, and track course progress
  - **Admins**: Full access to manage courses and milestones

### 🎓 Student Portal
- Browse all available courses
- View enrolled courses
- Enroll in new courses
- Track progress through milestones
- Local storage for saving milestone completion
- Beautiful dark/light theme toggle

### 🛠️ Admin Panel
- Create new courses
- Add structured milestones to courses
- Edit existing courses and milestones
- Delete courses
- Preview courses before publishing
- Admin-only dashboard with statistics

### 🎨 Design & UI
- Modern gradient UI
- Responsive design (mobile, tablet, desktop)
- Smooth animations
- Dark and light theme support
- Glass morphism cards
- Eye-catching hero sections

## 🏗️ Tech Stack

- **Next.js 14** - App Router with server components
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend, Auth, and Database
- **Supabase SSR** - Server-side rendering with auth

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your Project URL and `anon` API key from Project Settings → API

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Set Up Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire content from `supabase/schema.sql`
4. Click **Run** to execute the SQL

This will:
- Create all necessary tables (courses, milestones, enrollments, user_roles)
- Enable Row Level Security (RLS)
- Create policies for data access
- Set up a trigger to automatically assign the 'student' role to new users

### 5. Start the Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 👑 Promote a User to Admin

By default, all new users are students. To make someone an admin:

1. Have them sign up for an account
2. Go to Supabase → Table Editor → `user_roles`
3. Find their user row
4. Change their role from `student` to `admin`
5. Refresh the app

See `SETUP_ADMIN.md` for more detailed instructions.

## 📁 Project Structure

```
course-platform/
├── app/
│   ├── admin/              # Admin panel (protected route)
│   │   ├── courses/        # Course management
│   │   ├── page.tsx        # Admin dashboard
│   │   └── CourseForm.tsx  # Course creation/editing form
│   ├── auth/               # Auth routes
│   │   ├── signin/
│   │   ├── signup/
│   │   └── signout/route.ts
│   ├── courses/            # Course detail pages
│   │   └── [id]/page.tsx
│   ├── student/            # Student portal
│   ├── components/         # Reusable components
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            # Home page
├── supabase/
│   └── schema.sql          # Database schema
├── utils/
│   └── supabase/           # Supabase client utilities
├── middleware.ts           # Auth middleware
├── package.json
└── tailwind.config.ts
```

## 🛡️ Security & RLS

All database tables have Row Level Security enabled:
- Anyone can view courses and milestones
- Only admins can create, edit, or delete courses
- Users can only manage their own enrollments
- Users can view their own role

## 📄 License

MIT
