# 🎓 EduLearn - Modern EdTech Platform

A full-featured Learning Management System (LMS) built with Next.js 16, TypeScript, and modern web technologies. This platform enables instructors to create and manage courses while providing students with a seamless learning experience.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🚀 Live Demo

- **Frontend**: [https://edtech-frontend.vercel.app](https://edtech-frontend.vercel.app)
- **Backend API**: [https://edtech-backend.onrender.com](https://edtech-backend.onrender.com)

## ✨ Features

### 👨‍🎓 For Students
- Browse and search course catalog
- Filter courses by category, level, and price
- Enroll in courses
- Track learning progress
- View enrolled courses dashboard

### 👨‍🏫 For Instructors
- Create and manage courses
- Edit course details (title, description, price, duration, tags)
- View enrolled students
- Manage course content and lessons

### 🔐 Authentication & Security
- Secure authentication with NextAuth.js
- JWT-based token management with refresh tokens
- Role-based access control (Student/Instructor/Admin)
- Protected routes and API endpoints

### 🎨 UI/UX
- Modern, responsive design
- Dark/Light mode support
- Smooth animations and transitions
- Mobile-first approach
- Accessible components with Radix UI

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | TailwindCSS 4, Shadcn UI |
| **State Management** | Zustand, TanStack Query |
| **Authentication** | NextAuth.js v5 (Beta) |
| **HTTP Client** | Axios with interceptors |
| **Form Handling** | React Hook Form, Zod |
| **Testing** | Vitest, Playwright, Testing Library |
| **Icons** | Lucide React |

## 📁 Project Structure

```
edtech-assignment-frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── api/               # API routes
│   ├── courses/           # Course listing and details
│   ├── dashboard/         # Student dashboard
│   ├── instructor/        # Instructor dashboard & course management
│   └── layout.tsx         # Root layout
├── components/
│   ├── layout/            # Layout components (Navbar, Footer)
│   ├── providers/         # Context providers
│   └── ui/                # Shadcn UI components
├── lib/
│   ├── api.ts             # API client with typed methods
│   ├── axios.ts           # Axios instance with interceptors
│   └── utils.ts           # Utility functions
├── types/
│   ├── api.ts             # API type definitions
│   └── next-auth.d.ts     # NextAuth type extensions
├── __tests__/             # Unit and integration tests
├── e2e/                   # End-to-end Playwright tests
└── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see [Backend Repository](https://github.com/abhishek9640/edtech-backend))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhishek9640/edtech-frontend.git
   cd edtech-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |
| `NEXTAUTH_URL` | Application URL for NextAuth | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth | Yes |

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## 📱 Screenshots

### Home Page
Modern landing page with course highlights and call-to-action sections.

### Course Catalog
Browse courses with filters for category, level, and search functionality.

### Instructor Dashboard
Manage courses, view enrollments, and track performance.

### Student Dashboard
Track enrolled courses and learning progress.

## 🤝 API Integration

This frontend connects to a Node.js/Express backend. Key API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/register` | POST | User registration |
| `/api/courses` | GET | List all courses |
| `/api/courses/:id` | GET | Get course details |
| `/api/courses` | POST | Create new course (Instructor) |
| `/api/courses/:id` | PUT | Update course (Instructor) |
| `/api/enrollments` | POST | Enroll in a course |
| `/api/users/me` | GET | Get current user profile |

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy!

### Manual Deployment

```bash
npm run build
npm run start
```

## 👨‍💻 Developer

**Abhishek Kumar**

- 🌐 GitHub: [@abhishek9640](https://github.com/abhishek9640)
- 💼 LinkedIn: [abhishek-54-kr](https://www.linkedin.com/in/abhishek-54-kr/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Shadcn UI](https://ui.shadcn.com/) - Beautiful UI components
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vercel](https://vercel.com/) - Deployment platform

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/abhishek9640">Abhishek Kumar</a>
</p>
