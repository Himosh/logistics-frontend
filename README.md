# 🚚 Logitrack - Logistics Management System

A modern, full-featured logistics and order management system built with React, TypeScript, and Tailwind CSS. This application provides a comprehensive solution for managing products, orders, and inventory with an intuitive user interface and real-time data synchronization.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Available Scripts](#available-scripts)
- [Key Functionalities](#key-functionalities)
- [Design Patterns & Best Practices](#design-patterns--best-practices)

## ✨ Features

### Product Management
- **Product Listing with Advanced Search**: Search products by name with real-time filtering
- **Pagination**: Efficient data loading with customizable page sizes (10, 20, 50 items per page)
- **Product Creation**: Add new products with name, price, and stock information
- **Responsive Data Table**: Clean, accessible table design with shadcn/ui components

### Order Management
- **Smart Order Creation**: 
  - Searchable product dropdown with auto-complete (min 2 characters)
  - Automatic product search on 3rd character for better UX
  - Multi-item order support with dynamic line items
  - Real-time product availability validation
- **Advanced Filtering**:
  - Product name search
  - Status filtering (Pending, Shipped, Cancelled)
  - Date range filtering with shadcn Calendar components
- **Order Status Management**: Update order status with real-time feedback
- **Detailed Order View**: View all order items with quantities and product information

### User Experience
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile
- **Dark/Light Mode Support**: Theme switching capability (built-in with shadcn/ui)
- **Loading States**: Visual feedback for async operations
- **Error Handling**: User-friendly error messages with toast notifications
- **Optimistic Updates**: Immediate UI feedback for better perceived performance

## 🛠 Tech Stack

### Frontend Framework
- **React 18.3** - Modern React with hooks and concurrent features
- **TypeScript 5.8** - Type-safe development with full IntelliSense support
- **Vite 5.4** - Lightning-fast build tool and dev server

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built with Radix UI
- **Lucide React** - Beautiful, consistent icon set
- **date-fns** - Modern date utility library

### State Management & Data Fetching
- **TanStack Query (React Query) 5.83** - Powerful async state management
- **Axios 1.13** - Promise-based HTTP client

### Form Handling
- **React Hook Form 7.61** - Performant form validation
- **Zod 3.25** - TypeScript-first schema validation
- **@hookform/resolvers** - Form validation integration

### Routing
- **React Router DOM 6.30** - Declarative routing for React

### Development Tools
- **ESLint 9.32** - Code quality and consistency
- **Vitest 3.2** - Fast unit testing framework
- **@testing-library/react** - Component testing utilities

## 📦 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **Bun** (v1.0.0 or higher)
- **Backend API** - This frontend requires a running backend API (default: `http://localhost:8000`)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd logistics-frontend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using Bun (faster):
```bash
bun install
```

### 3. Environment Configuration

Create a `.env` file in the root directory (optional):

```env
VITE_API_BASE_URL=http://localhost:8000
```

If not provided, the application defaults to `http://localhost:8000`.

## 🎯 Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
# Using npm
npm run dev

# Using Bun
bun run dev
```

The application will be available at `http://localhost:8080` (or the next available port).

### Production Build

Build the application for production:

```bash
# Using npm
npm run build

# Using Bun
bun run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Running Tests

Execute the test suite:

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

### Code Linting

Check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
logistics-frontend/
├── public/
│   ├── favicon.svg          # Custom Logitrack favicon
│   └── robots.txt           # SEO configuration
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (Button, Input, Table, etc.)
│   │   ├── AppSidebar.tsx   # Application navigation sidebar
│   │   ├── CreateOrderModal.tsx    # Order creation modal with product search
│   │   ├── CreateProductModal.tsx  # Product creation modal
│   │   ├── DashboardLayout.tsx     # Main layout wrapper
│   │   ├── NavLink.tsx      # Active route navigation component
│   │   └── PaginationControls.tsx  # Reusable pagination component
│   ├── hooks/
│   │   ├── use-mobile.tsx   # Responsive design hook
│   │   └── use-toast.ts     # Toast notification hook
│   ├── lib/
│   │   ├── api.ts           # API client and request functions
│   │   └── utils.ts         # Utility functions (cn, etc.)
│   ├── pages/
│   │   ├── Index.tsx        # Home/Dashboard page
│   │   ├── NotFound.tsx     # 404 error page
│   │   ├── Orders.tsx       # Orders management page
│   │   └── Products.tsx     # Products management page
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── App.tsx              # Root application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles and Tailwind imports
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies and scripts
```

## 🔌 API Integration

### API Endpoints Used

The application integrates with the following backend API endpoints:

#### Products
- `GET /products/search?q=<query>&limit=<limit>&offset=<offset>` - Search products with pagination
- `GET /products/by-name?name=<name>` - Get products by name (for order creation)
- `POST /products` - Create new product

#### Orders
- `GET /orders/search?product_name=<name>&status=<status>&date_from=<date>&date_to=<date>&limit=<limit>&offset=<offset>` - Search orders with filters
- `POST /orders` - Create new order
- `PATCH /orders/<id>/status` - Update order status

### API Client Configuration

The API client is configured in `src/lib/api.ts` with:
- Axios instance with base URL from environment variables
- Centralized error handling with toast notifications
- Type-safe request/response interfaces
- Automatic error extraction from API responses

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run test` | Run test suite once |
| `npm run test:watch` | Run tests in watch mode |

## 🎨 Key Functionalities

### 1. Smart Product Search in Order Creation
- Minimum 2 characters required before showing dropdown
- Automatic API call on 3rd character with 300ms debounce
- Displays all available products when 2 characters entered
- Filtered results when 3+ characters entered
- Visual confirmation with green checkmark when product selected

### 2. Advanced Date Filtering
- Beautiful calendar UI using shadcn components
- Date range validation (end date cannot be before start date)
- Quick clear functionality for both dates
- Formatted date display (e.g., "Jan 15, 2026")

### 3. Responsive Pagination
- Dynamic page size options (10, 20, 50)
- Shows current range (e.g., "1-20 of 150")
- Disabled states for navigation buttons at boundaries
- Maintains filter state across page changes

### 4. Real-time Status Updates
- Dropdown selector for order status changes
- Loading indicator during updates
- Automatic table refresh after successful update
- Toast notifications for success/failure

## 🏗 Design Patterns & Best Practices

### Component Architecture
- **Composition Pattern**: Reusable UI components built with shadcn/ui
- **Container/Presentational Pattern**: Separation of business logic and UI
- **Custom Hooks**: Extracted reusable logic (use-mobile, use-toast)

### State Management
- **React Query**: Server state management with caching and automatic refetching
- **Local State**: Component-level state with useState/useEffect
- **Controlled Components**: Form inputs managed with React Hook Form

### Code Quality
- **TypeScript**: Full type coverage for type safety
- **ESLint**: Enforced code style and best practices
- **Component Naming**: Clear, descriptive names following React conventions
- **File Organization**: Logical grouping by feature and responsibility

### Performance Optimizations
- **Code Splitting**: Route-based lazy loading ready
- **Memoization**: useCallback for expensive operations
- **Debouncing**: Search inputs debounced to reduce API calls
- **Pagination**: Load only required data, not entire datasets

### Accessibility
- **Semantic HTML**: Proper use of semantic elements
- **ARIA Labels**: Screen reader support where needed
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color schemes

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Hosting Platforms

The application can be deployed to:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist/` folder or connect GitHub
- **GitHub Pages**: Use GitHub Actions or manual deployment
- **Any Static Host**: Upload contents of `dist/` directory

### Environment Variables for Production

Ensure `VITE_API_BASE_URL` is set to your production API endpoint.

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
