# BookVault - Digital Bookstore

A modern, production-ready digital bookstore for selling downloadable ebooks. Built with React, TypeScript, Tailwind CSS, and Vite.

## Architecture

This is the **customer-facing application**. A separate admin dashboard connects to the same backend/database.

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS 4** for styling
- **React Router** for navigation
- **Axios** for API communication
- **React Helmet Async** for SEO

### Backend Expectations
The frontend communicates with a backend API that manages:
- Books (CRUD, publish/unpublish, feature)
- Categories
- Users (registration, authentication)
- Orders & Payments (Paystack integration)
- Secure file downloads
- Contact messages

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
VITE_SITE_URL=https://bookvault.ng
VITE_SITE_NAME=BookVault
```

## Backend API Endpoints Expected

### Books
- `GET /api/books` - List books (with filters, pagination)
- `GET /api/books/featured` - Get featured books
- `GET /api/books/newest` - Get newest books
- `GET /api/books/slug/:slug` - Get book by slug
- `GET /api/books/:id` - Get book by ID

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/:slug` - Get category by slug

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Orders
- `POST /api/orders` - Create order
- `POST /api/orders/:id/pay` - Initialize payment
- `GET /api/orders/verify/:reference` - Verify payment
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/:orderId/download/:bookId` - Get download URL

### Contact
- `POST /api/contact` - Submit contact message

## Security Notes

- Paystack SECRET key is NEVER in frontend code
- Payment verification happens server-side via webhook
- Book files are stored privately, never publicly accessible
- Download URLs are temporary and expire
- Authentication tokens stored in localStorage (consider httpOnly cookies for production)
- All API calls include auth token when available

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

The built `dist/` folder can be deployed to any static hosting service (Vercel, Netlify, etc.).

For production:
1. Set `VITE_API_BASE_URL` to your production backend URL
2. Set `VITE_PAYSTACK_PUBLIC_KEY` to your live Paystack key
3. Set `VITE_SITE_URL` to your production domain
4. Ensure backend handles CORS properly
