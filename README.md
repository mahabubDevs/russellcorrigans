# RussellCorrigans App 🗨️

RussellCorrigans is a secure and scalable web application built with **TypeScript**, **Node.js**, and **Prisma**. It includes user authentication, admin control, and full RESTful API support for user management.

---

## 🚀 Features

- ✅ User registration and login
- 🔐 Authentication with tokens
- 🔄 Password reset functionality
- 👥 Admin and user role management
- 🔧 Complete CRUD APIs for user management
- 📁 Prisma-based database access layer
- 🌐 RESTful API structure
- 🛠️ Easy to deploy with Vercel configuration

---

## 🛠️ Tech Stack

| Technology     | Description                         |
|----------------|-------------------------------------|
| **Node.js**    | Runtime for server-side JavaScript  |
| **TypeScript** | Strongly typed JavaScript           |
| **Express.js** | Web framework for REST API          |
| **Prisma**     | ORM for database interactions       |
| **Zod**        | Schema validation for input data    |
| **JWT**        | JSON Web Token authentication       |
| **Bcrypt.js**  | Password hashing                    |
| **Vercel**     | Deployment platform                 |

---

## 📁 Project Structure

```
russellcorrigans/
├── prisma/             # Prisma schema and migrations
├── src/
│   ├── controllers/    # API route logic
│   ├── middlewares/    # Auth & error middleware
│   ├── models/         # User model
│   ├── routes/         # Express routes
│   ├── services/       # Business logic
│   └── utils/          # Helper functions
├── .env                # Environment variables
├── vercel.json         # Deployment config
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/mahabubDevs/russellcorrigans.git
cd russellcorrigans
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root directory with these variables:

```env
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret_key
```

### 4. Run the development server

```bash
npm run dev
```

---

## 🌐 API Endpoints

All routes are prefixed with `/api`.

### 🔐 Auth Routes

| Method | Route                    | Description           |
|--------|--------------------------|-----------------------|
| POST   | `/api/auth/register`     | Register new user     |
| POST   | `/api/auth/login`        | Login with credentials|
| POST   | `/api/auth/forget-password` | Request password reset |
| POST   | `/api/auth/reset-password/:token` | Reset password     |

### 👤 User Routes

| Method | Route               | Description             |
|--------|---------------------|-------------------------|
| GET    | `/api/users`        | Get all users (Admin)   |
| GET    | `/api/users/:id`    | Get user by ID          |
| PUT    | `/api/users/:id`    | Update user info        |
| DELETE | `/api/users/:id`    | Delete a user (Admin)   |

---

## 🚀 Deployment (Vercel)

This project is ready for deployment via [Vercel](https://vercel.com/).

Just connect the GitHub repo to Vercel, and it will auto-detect the build steps using `vercel.json`.

---

## 🤝 Contributing

Pull requests are welcome! Here's how you can contribute:

1. Fork the repository
2. Create your branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Create a new Pull Request

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgements

Thanks to [@mahabubDevs](https://github.com/mahabubDevs) for the original idea and implementation.

---

## 📬 Contact

For questions or support, reach out via [GitHub Issues](https://github.com/mahabubDevs/russellcorrigans/issues) or create a PR.
