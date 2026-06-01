# E-Commerce Premium Shop

A premium, modern full-stack e-commerce web application featuring high-fidelity glassmorphism design, secure token-based user authentication, interactive shipping address selection, custom password visibility toggles, dynamic shopping cart integrations, and transactional checkout operations.

---

## 🚀 Key Features

* **High-Fidelity UI/UX**: Styled completely in premium dark mode with Outfit typography, smooth CSS micro-animations, glowing gradients, and clean responsive glassmorphic cards.
* **Authentication Security**: Custom signup and login forms featuring custom SVG password show/hide eye toggles, robust backend JWT generation, and `sessionStorage` token mapping.
* **Dynamic Header & Cart Sync**: Global dynamic navigation header containing product routes, and a shopping cart icon with a real-time badge count synchronized across pages using custom JavaScript events (`cart-updated`).
* **Interactive Shipping Form**: Checkout address page supporting custom grids for fullName, phone number, and complete zip/state coordinates with strict input verification.
* **Review & Place Orders**: Standalone review panels mapping products, thumbnails, pricing variables, subtotals, free shipping markers, Cash on Delivery (COD) selections, and cart emptying operations on success.
* **Standalone Order Confirmation**: Standard `/order-success` page displaying generated Order IDs, billing summaries, payment markers, and shopping redirects.
* **Ready for Production**: Index health-checks (`GET /`) integrated for automated server checks, and Vite env fallbacks enabled for production environments.

---

## 🛠️ Technology Stack

### Frontend
* **Core Framework**: React (Vite bundler)
* **Styling & Theme**: Vanilla CSS & Tailwind CSS v4
* **Routing**: React Router
* **Network Client**: Axios
* **Icons & Toggles**: High-quality hand-coded custom inline SVGs

### Backend
* **Runtime Environment**: Node.js
* **API Server**: Express.js
* **Database Management**: MongoDB (Mongoose ODM)
* **Security & Tokens**: JSON Web Tokens (JWT) & bcryptjs (password hashing)

---

## 📂 Project Structure

```text
E-commerce/
├── backend/
│   ├── config/             # DB Connection Configs
│   ├── controller/         # Auth, Product, Cart, Address & Order Controllers
│   ├── data/               # Seed Files (Dummy Products collection)
│   ├── middleware/         # Auth protection middleware
│   ├── models/             # Mongoose Schemas (User, Product, Cart, Address, Order)
│   ├── routes/             # Express API Subrouters
│   ├── scripts/            # Product Seeding scripts
│   ├── server.js           # Server index & router registry
│   └── .env                # Database URIs & Secrets
└── frontend/
    ├── src/
    │   ├── api/            # Axios instance config
    │   ├── assets/         # Design images & hero assets
    │   ├── components/     # Global Components (Navbar)
    │   ├── pages/          # Home, Cart, ProductDetails, CheckoutAddress, Checkout, OrderSuccess
    │   ├── App.jsx         # Routing & Main Layout
    │   └── main.jsx        # App mounting point
```

---

## 💻 Installation & Local Setup

### Prerequisites
* Node.js (v18 or higher recommended)
* MongoDB Atlas cluster or local MongoDB instance

### 1. Setup Backend
Open a terminal inside the `/backend` directory and run:

```bash
# Install backend dependencies
npm install

# Create a .env file and configure the variables:
# MONGO_URI="your_mongodb_atlas_connection_string"
# JWT_SECRET="your_jwt_secret_key"

# Seed the collection with 10 premium dummy products
npm run seed:products

# Start the backend development server (watches for changes)
npm run dev
```

The backend server will launch and listen successfully on port **5001**.

### 2. Setup Frontend
Open a separate terminal inside the `/frontend` directory and run:

```bash
# Install frontend dependencies
npm install

# Start the frontend React development server
npm run dev
```

The frontend application will start and be available at **http://localhost:5173**.

---

## 🌍 Production Deployment

This project is built to support production builds out-of-the-box (e.g., hosting the Backend on **Render** and the Frontend on **Netlify**).

### Backend (Render)
1. Deploy your server code pointing Render to the `/backend` directory.
2. The server root index (`GET /`) is equipped with a health-check endpoint that returns `{ "message": "E-Commerce API is running successfully!" }` which satisfies automated deployment checks.
3. Configure the environment variables (`MONGO_URI` and `JWT_SECRET`) in the Render Dashboard.

### Frontend (Netlify)
1. Add your frontend repository to Netlify pointing to the `/frontend` directory.
2. In the Netlify Dashboard under **Site configuration > Environment variables**, add your production backend API variable:
   * **Key**: `VITE_API_URL`
   * **Value**: `https://e-commerce-project-x82b.onrender.com/api` *(Make sure to append /api to the end of your Render URL!)*
3. Trigger a new deploy to build the React package containing the dynamic production API URLs.
