// ============================================================
// MOCK DATA — Central source of truth for all UI mock data
// ============================================================

export type ProjectStatus = "active" | "draft" | "published" | "archived";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  screens: number;
  updatedAt: string;
  createdAt: string;
  gradient: string; // tailwind gradient classes
  tags: string[];
  aiGenerations: number;
}

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
    codeBlock?: string;
}

export interface PlanFeature {
    text: string;
    included: boolean;
}

export interface Plan {
    id: string;
    name: string;
    price: number;
    period: string;
    description: string;
    features: PlanFeature[];
    popular: boolean;
    color: string;
}

export interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: "paid" | "pending" | "failed";
    plan: string;
}

export interface Notification {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: "Owner" | "Admin" | "Member" | "Viewer";
    avatar: string;
    joinedAt: string;
}

// ─── Projects ────────────────────────────────────────────────
export const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Fitness Tracker Pro",
    description: "A comprehensive fitness tracking app with workout plans, calorie counter, and progress charts.",
    status: "active",
    screens: 12,
    updatedAt: "2 hours ago",
    createdAt: "Jan 15, 2025",
    gradient: "from-blue-600 via-blue-500 to-cyan-400",
    tags: ["Health", "Fitness", "Dark Theme"],
    aiGenerations: 34,
  },
  {
    id: "2",
    name: "Coffee Shop POS",
    description: "Point-of-sale system for coffee shops with order management, inventory, and analytics.",
    status: "published",
    screens: 8,
    updatedAt: "Yesterday",
    createdAt: "Jan 10, 2025",
    gradient: "from-amber-600 via-orange-500 to-yellow-400",
    tags: ["Business", "POS", "Retail"],
    aiGenerations: 21,
  },
  {
    id: "3",
    name: "Social Media Feed",
    description: "Instagram-like social feed with stories, reels, and real-time notifications.",
    status: "draft",
    screens: 15,
    updatedAt: "3 days ago",
    createdAt: "Dec 28, 2024",
    gradient: "from-pink-600 via-rose-500 to-red-400",
    tags: ["Social", "Feed", "Stories"],
    aiGenerations: 47,
  },
  {
    id: "4",
    name: "Recipe Finder",
    description: "AI-powered recipe discovery app with meal planning and grocery list generation.",
    status: "active",
    screens: 10,
    updatedAt: "1 week ago",
    createdAt: "Dec 20, 2024",
    gradient: "from-green-600 via-emerald-500 to-teal-400",
    tags: ["Food", "AI", "Lifestyle"],
    aiGenerations: 18,
  },
  {
    id: "5",
    name: "Travel Planner",
    description: "Smart travel itinerary builder with hotel booking, flight search, and local guides.",
    status: "archived",
    screens: 20,
    updatedAt: "2 weeks ago",
    createdAt: "Dec 1, 2024",
    gradient: "from-violet-600 via-purple-500 to-indigo-400",
    tags: ["Travel", "Maps", "Booking"],
    aiGenerations: 62,
  },
  {
    id: "6",
    name: "Finance Dashboard",
    description: "Personal finance tracker with budget management, expense categorization, and investment portfolio.",
    status: "published",
    screens: 14,
    updatedAt: "3 weeks ago",
    createdAt: "Nov 15, 2024",
    gradient: "from-slate-600 via-zinc-500 to-gray-400",
    tags: ["Finance", "Analytics", "Charts"],
    aiGenerations: 29,
  },
];

// ─── Dashboard Stats ──────────────────────────────────────────
export const DASHBOARD_STATS = {
    appsCreated: 12,
    aiGenerations: 148,
    templatesUsed: 5,
    devicesPreviewed: 32,
    totalScreens: 89,
    publishedApps: 3,
};

// ─── Chat Messages ────────────────────────────────────────────
export const MOCK_CHAT_MESSAGES: Message[] = [
    {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your AI Mobile App Builder. Describe the app you want to create and I'll generate production-ready React Native code instantly. 🚀",
        timestamp: "10:00 AM",
    },
    {
        id: "2",
        role: "user",
        content: "I want to build a fitness tracker app with a dark theme and blue accents.",
        timestamp: "10:01 AM",
    },
    {
        id: "3",
        role: "assistant",
        content: "Perfect! A fitness tracker with a sleek dark theme and neon blue accents. I've generated the main dashboard with step counter, calorie tracker, and workout cards. Check the preview on the right! ✨",
        timestamp: "10:01 AM",
    },
];

export const AI_RESPONSES: string[] = [
    "I've updated the component with your requested changes. The new design features smooth animations and improved UX. Check the preview! ✨",
    "Great idea! I've added the feature you described. The code is clean, well-structured, and follows React Native best practices. 🚀",
    "Done! I've redesigned that section with a more modern look. The layout is now fully responsive and works on all screen sizes. 📱",
    "I've implemented the navigation flow you described. All screens are connected with smooth transitions. Take a look at the preview! 🎨",
    "The component has been updated with the new color scheme and typography. It looks much more polished now! Let me know if you'd like any tweaks. ✅",
    "I've added the data visualization charts you requested. They're interactive and update in real-time. The animations are buttery smooth! 📊",
];

// ─── Billing Plans ────────────────────────────────────────────
export const BILLING_PLANS: Plan[] = [
    {
        id: "free",
        name: "Free",
        price: 0,
        period: "forever",
        description: "Perfect for exploring AI app building",
        popular: false,
        color: "zinc",
        features: [
            { text: "3 projects", included: true },
            { text: "50 AI generations/month", included: true },
            { text: "Basic templates", included: true },
            { text: "Community support", included: true },
            { text: "Custom domains", included: false },
            { text: "Team collaboration", included: false },
            { text: "Priority AI queue", included: false },
            { text: "Export source code", included: false },
        ],
    },
    {
        id: "pro",
        name: "Pro",
        price: 29,
        period: "month",
        description: "For serious builders and indie developers",
        popular: true,
        color: "blue",
        features: [
            { text: "Unlimited projects", included: true },
            { text: "500 AI generations/month", included: true },
            { text: "All premium templates", included: true },
            { text: "Priority support", included: true },
            { text: "Custom domains", included: true },
            { text: "Team collaboration (3 seats)", included: true },
            { text: "Priority AI queue", included: true },
            { text: "Export source code", included: false },
        ],
    },
    {
        id: "team",
        name: "Team",
        price: 79,
        period: "month",
        description: "For agencies and growing teams",
        popular: false,
        color: "purple",
        features: [
            { text: "Unlimited projects", included: true },
            { text: "Unlimited AI generations", included: true },
            { text: "All premium templates", included: true },
            { text: "24/7 dedicated support", included: true },
            { text: "Custom domains", included: true },
            { text: "Team collaboration (unlimited)", included: true },
            { text: "Priority AI queue", included: true },
            { text: "Export source code", included: true },
        ],
    },
];

export const MOCK_INVOICES: Invoice[] = [
    { id: "INV-001", date: "Mar 1, 2025", amount: "$29.00", status: "paid", plan: "Pro" },
    { id: "INV-002", date: "Feb 1, 2025", amount: "$29.00", status: "paid", plan: "Pro" },
    { id: "INV-003", date: "Jan 1, 2025", amount: "$29.00", status: "paid", plan: "Pro" },
    { id: "INV-004", date: "Dec 1, 2024", amount: "$0.00", status: "paid", plan: "Free" },
];

// ─── Settings ─────────────────────────────────────────────────
export const MOCK_USER = {
    name: "Alex Johnson",
    email: "alex@example.com",
    username: "alexbuilds",
    bio: "Building the future, one app at a time. 🚀",
    avatar: "AJ",
    plan: "Pro",
    timezone: "UTC-8 (Pacific Time)",
    language: "English",
    theme: "dark",
};

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: "1", title: "AI Generation Complete", description: "Get notified when your AI generation finishes", enabled: true },
    { id: "2", title: "App Published", description: "Receive alerts when your app goes live", enabled: true },
    { id: "3", title: "Team Activity", description: "Updates on team member actions", enabled: false },
    { id: "4", title: "Weekly Report", description: "Weekly summary of your app performance", enabled: true },
    { id: "5", title: "Billing Alerts", description: "Notifications about billing and usage limits", enabled: true },
    { id: "6", title: "Product Updates", description: "New features and improvements", enabled: false },
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
    { id: "1", name: "Alex Johnson", email: "alex@example.com", role: "Owner", avatar: "AJ", joinedAt: "Jan 2025" },
    { id: "2", name: "Sarah Chen", email: "sarah@example.com", role: "Admin", avatar: "SC", joinedAt: "Feb 2025" },
    { id: "3", name: "Marcus Williams", email: "marcus@example.com", role: "Member", avatar: "MW", joinedAt: "Feb 2025" },
];

// ─── Templates ────────────────────────────────────────────────
export const APP_TEMPLATES = [
    { id: "1", name: "E-Commerce", emoji: "🛍️", description: "Full shopping app with cart & checkout", screens: 12 },
    { id: "2", name: "Social Network", emoji: "👥", description: "Feed, stories, messaging & profiles", screens: 18 },
    { id: "3", name: "Food Delivery", emoji: "🍕", description: "Restaurant listing, ordering & tracking", screens: 14 },
    { id: "4", name: "Fitness App", emoji: "💪", description: "Workouts, nutrition & progress tracking", screens: 10 },
    { id: "5", name: "Finance App", emoji: "💳", description: "Banking, budgeting & investments", screens: 16 },
    { id: "6", name: "Travel App", emoji: "✈️", description: "Booking, itineraries & local guides", screens: 20 },
    { id: "7", name: "Education", emoji: "📚", description: "Courses, quizzes & progress tracking", screens: 15 },
    { id: "8", name: "Healthcare", emoji: "🏥", description: "Appointments, records & telemedicine", screens: 13 },
];
