# Dari Marketplace

## Overview

Dari Marketplace is a comprehensive e-commerce platform that integrates with both Amazon and Alibaba, designed specifically for Dari-speaking communities. The application allows users to browse products from both marketplaces, place orders, and communicate directly with sellers/owners.

## Key Features

### Backend (Node.js/Express)
- RESTful API with JWT authentication
- MongoDB database with User, Product, and Order models
- Multi-role system (User, Seller, Admin, Owner)
- Amazon and Alibaba integration
- Comprehensive order management
- Email notifications

### Frontend (React)
- Full Dari language support
- Multi-platform product browsing
- User authentication and profile management
- Shopping cart and order tracking
- Direct messaging with sellers
- Responsive design

## Project Structure

```
dari-marketplace/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── utils/
│   ├── config/
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── shared/
│   ├── types/
│   └── constants/
└── README.md
```

## Technology Stack

### Backend
- Node.js, Express
- MongoDB, Mongoose
- JWT, bcryptjs
- axios, dotenv
- express-rate-limit, helmet

### Frontend
- React, React Router
- i18next, react-i18next
- styled-components
- formik, yup
- react-icons, framer-motion

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/amazon-login` - Amazon login
- `POST /api/auth/alibaba-login` - Alibaba login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Featured products
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get product by ID

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order

### Admin
- `GET /api/admin/stats` - Admin statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/products` - Get all products

### Health Check
- `GET /api/health` - Health check

## Setup Instructions

### Backend
1. Clone repository
2. `cd backend`
3. `npm install`
4. Create `.env` file with environment variables
5. `npm start`

### Frontend
1. `cd frontend`
2. `npm install`
3. Configure API endpoints
4. `npm start`

## Installation

### Prerequisites
- Node.js (>= 14)
- MongoDB
- Git

### Steps
1. Clone this repository
2. Navigate to `dari-marketplace/backend`
3. Run `npm install`
4. Create `.env` file with your environment variables
5. Run `npm start` to start the backend
6. Navigate to `dari-marketplace/frontend`
7. Run `npm install`
8. Start the frontend with `npm start`

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/dari-marketplace
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

## Usage

1. **Register**: Create a new account
2. **Login**: Access your account
3. **Browse Products**: Explore Amazon and Alibaba products
4. **Place Orders**: Purchase items directly
5. **Track Orders**: Monitor order status
6. **Communicate**: Message sellers directly

## Development

### Backend Development
- Use `npm run dev` for development mode
- Tests: Use `npm test`
- Linting: Use `npm run lint`

### Frontend Development
- Use `npm start` for development mode
- Tests: Use `npm test`
- Build: Use `npm run build`

## Future Plans

1. Mobile app development
2. Advanced search features
3. Voice search support
4. AR/VR shopping
5. Cryptocurrency payments
6. Multi-vendor system
7. Flash sales and offers
8. Real-time delivery tracking
9. Advanced analytics
10. Social sharing features

## Support

- **GitHub**: Issues and pull requests
- **Email**: support@dari-marketplace.com
- **Documentation**: See docs/ folder

## License

This project is licensed under the MIT License.

---

**Note**: This project is currently under active development. Contributions and feedback are welcome!