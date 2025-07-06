# 📚 StudySync

A modern study management application built with Next.js that helps students organize their courses, set learning goals, track tasks, and monitor progress efficiently.

## ✨ Features

- 🎯 **Course Management**: Create and organize study courses with custom colors and deadlines
- 📋 **Goal Setting**: Set specific learning goals for each course with priority levels  
- ✅ **Task Tracking**: Break down goals into manageable tasks with due dates and time estimates
- 📊 **Progress Analytics**: Track time spent studying and monitor completion rates
- 🔐 **User Authentication**: Secure login and registration system with NextAuth.js
- 📱 **Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS
- 🎨 **Interactive Dashboard**: Visual progress charts and statistics

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI Components
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for progress visualization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd studysync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@host:port/database"
   
   # NextAuth.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Getting Started
1. **Register** a new account or **sign in** to an existing one
2. **Create your first course** by clicking "Add New Course"
3. **Set goals** for your course to define what you want to achieve
4. **Add tasks** to break down your goals into actionable steps
5. **Track progress** by logging time spent and marking tasks as complete

### Course Management
- Create courses with custom titles, descriptions, and color themes
- Set start and end dates to stay on track
- View all courses in an organized dashboard layout

### Goal Setting
- Define specific learning objectives for each course
- Set priority levels (Low, Medium, High, Urgent)
- Track completion status and deadlines

### Task Tracking
- Break down goals into smaller, manageable tasks
- Set due dates and estimated time requirements
- Log progress and add notes about your study sessions

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── courses/       # Course management
│   │   ├── goals/         # Goal management
│   │   └── tasks/         # Task management
│   ├── courses/           # Course pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── AuthGuard.tsx      # Authentication wrapper
│   ├── CourseCard.tsx     # Course display component
│   ├── DashboardStats.tsx # Statistics dashboard
│   └── ...
├── lib/                   # Utility libraries
└── types/                 # TypeScript type definitions

prisma/
├── schema.prisma          # Database schema
└── migrations/            # Database migrations
```

## 📊 Database Schema

The application uses a PostgreSQL database with the following main entities:

- **Users**: User accounts and authentication
- **Courses**: Study courses with metadata
- **Goals**: Learning objectives linked to courses
- **Tasks**: Actionable items linked to goals
- **ProgressLogs**: Time tracking and progress notes

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma database browser
- `npx prisma migrate dev` - Create and apply new migration

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
The app can be deployed on any platform that supports Node.js applications (Railway, Render, Heroku, etc.).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) - The React Framework
- UI Components by [Radix UI](https://www.radix-ui.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Database ORM by [Prisma](https://www.prisma.io/)

---

**Happy Studying! 📚✨**
