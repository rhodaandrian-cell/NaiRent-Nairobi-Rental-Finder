# NaiRent-Nairobi-Rental-Finder
# 🏠 NaiRent — Nairobi Rental Finder

A full-stack web application that connects landlords and tenants in Nairobi, Kenya. Landlords can list rental properties while tenants can browse, save, and inquire about available homes across Nairobi's neighborhoods.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Hooks, React Router, Axios) |
| Backend | Flask (REST API, Flask-SQLAlchemy) |
| Database | PostgreSQL / SQLite |
| Authentication | JWT (JSON Web Tokens) |

---

## ✨ Features

- 🔐 JWT-based authentication with role-based access (Landlord / Tenant)
- 🏘️ Browse listings filtered by Nairobi neighborhood, price, and bedrooms
- 📋 Landlords can post, edit, and delete property listings
- 💾 Tenants can save/favorite listings
- 📩 Tenants can send inquiries to landlords
- 📊 Role-specific dashboards
- 📱 Fully responsive and mobile-friendly UI

---

## 👥 User Roles

### 🏠 Landlord
- Post new property listings
- Edit and delete own listings
- View inquiries from tenants

### 🔍 Tenant
- Browse and search listings
- Save/favorite listings
- Send inquiries to landlords
- View saved listings on dashboard

---

## 🗃️ Database Relationships

### One-to-Many (1-M)
- One **User (Landlord)** → many **Listings**
- One **Listing** → many **Inquiries**

### Many-to-Many (M-M)
- Many **Users (Tenants)** ↔ many **Listings** (saved/favorites)
- Many **Listings** ↔ many **Tags** (WiFi, Parking, Furnished, Borehole, etc.)

---

## 📁 Project Structure

```
nairent/
├── client/                     # React Frontend
│   ├── public/
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── pages/              # Page components
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── ListingDetail.jsx
│       │   └── Browse.jsx
│       ├── context/            # Auth context / state management
│       ├── services/           # Axios API calls
│       └── App.jsx
│
└── server/                     # Flask Backend
    ├── models/                 # SQLAlchemy models
    ├── routes/                 # Flask blueprints
    ├── config.py               # App configuration
    ├── seed.py                 # Database seed file
    ├── app.py                  # App entry point
    └── .env                    # Environment variables (not committed)
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (or SQLite for development)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/nairent.git
cd nairent/server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret key

# Run database migrations
flask db upgrade

# Seed the database
python seed.py

# Start the server
flask run
```

### Frontend Setup

```bash
cd nairent/client

# Install dependencies
npm install

# Start the React app
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file in the `/server` directory:

```env
DATABASE_URL=postgresql://username:password@localhost/nairent
JWT_SECRET_KEY=your_secret_key_here
FLASK_ENV=development
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| DELETE | `/api/auth/logout` | Logout user |

### Listings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/listings` | Get all listings |
| GET | `/api/listings/:id` | Get a single listing |
| POST | `/api/listings` | Create a listing (landlord only) |
| PATCH | `/api/listings/:id` | Update a listing (landlord only) |
| DELETE | `/api/listings/:id` | Delete a listing (landlord only) |

### Saved Listings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/saved` | Get tenant's saved listings |
| POST | `/api/saved/:id` | Save a listing |
| DELETE | `/api/saved/:id` | Remove a saved listing |

### Inquiries
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/inquiries` | Get inquiries (role-based) |
| POST | `/api/inquiries` | Send an inquiry (tenant only) |
| DELETE | `/api/inquiries/:id` | Delete an inquiry |

---

## 🏘️ Nairobi Neighborhoods Supported

Westlands, Kilimani, Karen, Lavington, Kasarani, Ruaka, Eastleigh, South B, South C, Parklands, Kileleshwa, Ngumo, Langata, Embakasi, Kahawa West, Githurai, Ruiru, Thika, Kahawa Wendani

---

## 🌱 Seed Accounts (for testing)

| Role | Email | Password |
|---|---|---|
| Landlord | landlord@test.com | password123 |
| Tenant | tenant@test.com | password123 |

---

## 📸 Pages Overview

- **Home** — Hero section, search bar, featured listings, neighborhood filters
- **Browse** — All listings with filter by area, price, bedrooms
- **Listing Detail** — Photos, amenities, location, contact landlord
- **Login / Register** — Role selection (Tenant or Landlord)
- **Landlord Dashboard** — Manage listings, view inquiries
- **Tenant Dashboard** — Saved listings, sent inquiries

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ for Nairobi 🇰🇪
