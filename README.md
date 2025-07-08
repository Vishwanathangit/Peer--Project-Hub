# 🚀 CodeConnect (Peer Project Hub)

**CodeConnect** is a full-stack developer collaboration platform where users can **post**, **explore**, and **interact** with coding projects. The platform includes **authentication**, **project management**, **social features**, and **profile analytics**, built using modern technologies like React, Node.js, Express, and MongoDB.

---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 Features

- ✅ **User Authentication**  
  Email/Password + Google OAuth using Firebase  
- 📤 **Project Management**  
  Create, Edit, Delete, Like, Bookmark, Favorite Projects  
- 💬 **Commenting System**  
  Add/Delete comments on projects  
- 👤 **User Profiles**  
  Update bio, upload profile picture, and view your posted projects  
- 📈 **Analytics Dashboard**  
  Track likes, bookmarks, favorites, and comments  
- 🌐 **Responsive UI**  
  Mobile-first UI with Tailwind CSS  
- ☁️ **Image Uploads**  
  Projects and profile images are stored using Cloudinary

---

## ⚙️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Zustand
- React Router DOM
- Axios
- Recharts
- Firebase (Google OAuth)

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- Cloudinary
- JWT
- Multer
- Bcrypt
- Cookie-Parser

---

## 📁 Project Structure

```bash
Peer-Project-Hub/
├── backend/
│   ├── config/           # MongoDB and Cloudinary connections
│   ├── controller/       # Auth, User, Project, and Comment controllers
│   ├── middleware/       # Multer setup, JWT verification
│   ├── models/           # Mongoose schemas
│   ├── router/           # Express routes
│   ├── utils/            # JWT token generator
│   ├── index.js          # Main backend server
│   ├── .env.sample       # Environment variable template
│   └── vercel.json       # Vercel deployment config
│
├── frontend/
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Navbar, ProjectCard, OAuth, etc.
│   │   ├── pages/        # Home, Explore, Profile, Login, etc.
│   │   ├── store/        # Zustand stores (auth, user, project, comment)
│   │   ├── utils/        # Axios instance and Firebase config
│   │   ├── App.jsx       # App routes
│   │   └── main.jsx      # Entry file
│   ├── .env.sample
│   ├── index.html
│   └── vite.config.js
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js v18+
- MongoDB Atlas or local MongoDB
- Cloudinary Account
- Firebase Project (for Google OAuth)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/Peer-Project-Hub.git
cd Peer-Project-Hub
```

---

### 2️⃣ Setup Environment Variables

#### Backend `.env` (Create from `.env.sample`)

```env
PORT=5000
MONGO_URL=your_mongodb_uri
JWT_SECRET_KEY=your_jwt_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend `.env` (Create from `.env.sample`)

```env
VITE_BACKEND_URL=http://localhost:5000/api/v1
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### 3️⃣ Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

### 4️⃣ Run the Application

- **Backend**:

```bash
cd backend
npm run dev
```

- **Frontend**:

```bash
cd frontend
npm run dev
```

> 📍 Visit frontend at: `http://localhost:5173`  
> 📍 Backend runs at: `http://localhost:5000`

---

## 🧪 Scripts

### 🔧 Backend

- `npm run dev` – Start server with nodemon
- `npm start` – Start with Node

### 🎨 Frontend

- `npm run dev` – Vite dev server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Run linter

---

## 📡 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout |
| GET | `/auth/verify/token` | Verify session |
| POST | `/auth/google` | Google OAuth login/signup |

---

### 📁 Project Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/project/create` | Create a new project |
| GET | `/project/get/all` | Get all projects |
| GET | `/project/get/:id` | Get single project |
| PUT | `/project/edit/:id` | Edit a project |
| DELETE | `/project/delete/:id` | Delete a project |
| PUT | `/project/toggle/like/:id` | Like/Dislike a project |
| PUT | `/project/toggle/bookmark/:id` | Bookmark/Unbookmark |
| PUT | `/project/toggle/favorite/:id` | Favorite/Unfavorite |

---

### 💬 Comment Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/comment/create/:projectId` | Add a comment |
| GET | `/comment/get/:projectId` | Get project comments |
| DELETE | `/comment/delete/:commentId` | Delete a comment |

---

### 👤 User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/user/update/profile/:userId` | Update user profile |
| GET | `/user/get/bookmarks/:userId` | Get bookmarked projects |
| GET | `/user/get/favorites/:userId` | Get favorite projects |
| GET | `/user/get/projects/:userId` | Get user's projects |
| GET | `/user/get/profile/:userId` | Get user profile info |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo  
2. Create your branch: `git checkout -b feature/my-feature`  
3. Commit changes: `git commit -m "Add some feature"`  
4. Push: `git push origin feature/my-feature`  
5. Submit a Pull Request 🙌

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

For questions, suggestions, or support, feel free to open an [issue](https://github.com/Vishwanathangit/Peer--Project-Hub.git) or contact the maintainer.

---

> Made with ❤️ using the MERN Stack
