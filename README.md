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

<img width="1919" height="829" alt="image" src="https://github.com/user-attachments/assets/ac693433-9405-4da7-a7af-c07fd16d23f6" />
<img width="1919" height="820" alt="image" src="https://github.com/user-attachments/assets/70dfc185-d5a4-4b6d-9736-4323766fb47f" />


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
