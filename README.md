# 🔒 AnonMessage

A modern **AI-powered anonymous messaging platform** built with **Next.js 15**, **TypeScript**, **MongoDB**, **NextAuth**, and **Google Gemini AI**. Users can create their own anonymous inbox, receive honest feedback securely, and generate AI-powered message suggestions.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)
![NextAuth](https://img.shields.io/badge/Auth-NextAuth-blue)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange)

---

## ✨ Features

- 🔐 Secure Authentication
  - Email & Password Login
  - Google OAuth Login
  - JWT-based Authentication using NextAuth

- 👤 Personalized Anonymous Inbox
  - Unique public profile for every user
  - Share your profile link
  - Receive anonymous messages securely

- 🤖 AI Message Suggestions
  - Generate anonymous message ideas using Google Gemini AI
  - One-click message insertion

- 📩 Anonymous Messaging
  - Completely anonymous sender
  - No identity is stored or revealed

- ⚙️ User Dashboard
  - View received messages
  - Delete unwanted messages
  - Refresh inbox instantly
  - Enable/Disable anonymous messages

- 📱 Responsive UI
  - Mobile Friendly
  - Tablet Friendly
  - Desktop Optimized

- 🎨 Modern UI
  - Tailwind CSS
  - Shadcn UI
  - Dark Glassmorphism Design
  - Interactive 3D Globe

---

# 🛠️ Tech Stack

### Frontend

- Next.js 15 (App Router)
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Hook Form
- Zod
- Axios

### Backend

- Next.js API Routes
- MongoDB
- Mongoose
- NextAuth
- JWT

### AI

- Google Gemini API
- AI SDK

---

# 📂 Folder Structure

```
app/
 ├── api/
 ├── dashboard/
 ├── sign-in/
 ├── sign-up/
 ├── u/[username]/
 └── layout.tsx

components/
 ├── ui/
 ├── forms/
 └── shared/

lib/
models/
schemas/
helpers/
types/
messages.json
```

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/your-username/anon_message.git

cd anon_message
```

---

## Install dependencies

```bash
npm install
```

---

## Create Environment Variables

Create a `.env` file in the root directory.

```env
MONGODB_URI=

NEXTAUTH_SECRET=

NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_GENERATIVE_AI_API_KEY=
```

---

## Run Development Server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 📸 Screenshots
- Home Page

    <img width="1896" height="907" alt="image" src="https://github.com/user-attachments/assets/e51429a1-952b-4528-bc73-994f22e64b53" />

- User's Dashboard
  
  <img width="1896" height="906" alt="image" src="https://github.com/user-attachments/assets/cfa9e170-7882-42e7-86b6-e4f687689cb2" />

- Send message to Anyone with their Unique Link Anonymously
  
  <img width="1882" height="897" alt="image" src="https://github.com/user-attachments/assets/8ec7df1e-5aa8-4cf7-84bf-ab3500726189" />
 

---

# 🔄 Application Flow

```text
User Registers
       │
       ▼
Gets Unique Username
       │
       ▼
Shares Public Link
       │
       ▼
Anyone Sends Anonymous Message
       │
       ▼
Stored in MongoDB
       │
       ▼
User Views Messages
       │
       ▼
Delete / Manage Messages
```

---

# 🔒 Authentication

- Email & Password Authentication
- Google OAuth Authentication
- JWT Session Management
- Protected Routes
- Secure Password Hashing

---

# 🤖 AI Integration

Google Gemini AI is used for generating anonymous message suggestions.

Example:

- What's your biggest strength?
- What's one thing I should improve?
- What's your favourite memory with me?

---

# 📱 Responsive Design

Fully optimized for

- 📱 Mobile
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop

---

# 📦 Deployment

Deploy easily on **Vercel**.

```bash
npm run build
```

Then import the project into Vercel and configure your environment variables.

---

# 🔮 Future Improvements

- Real-time notifications
- Email verification
- Password reset
- Message reactions
- User profile customization
- Dark/Light theme
- Analytics dashboard
- AI moderation

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/NewFeature
```

3. Commit changes

```bash
git commit -m "Add New Feature"
```

4. Push

```bash
git push origin feature/NewFeature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Manvith Reddy**

- GitHub: https://github.com/manvithreddy07
- LinkedIn: [https://linkedin.com/in/YOUR-LINKEDIN](https://www.linkedin.com/in/manvith-reddy-medagam-208092321/)

---

⭐ If you like this project, consider giving it a **Star** on GitHub!
