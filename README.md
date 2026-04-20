# 🚀 Pathify

Pathify is a full-stack, multi-tenant SaaS platform designed to unify **career growth, campus collaboration, and institutional management** into one intelligent ecosystem.

Built with scalability in mind, Pathify enables students and colleges to interact within isolated environments while leveraging AI-powered guidance and real-time collaboration.

---

## 🧠 Core Idea

Each college acts as an **independent organization**, where:

- Students belong to a specific college
- Data is strictly isolated per college
- Features are tailored to enhance both **student experience** and **institutional workflows**

---

## 🔥 Key Features

### 🤖 AI Career Buddy
- Personalized career roadmaps
- Weekly AI-generated tasks
- Resume generation

---

### 🧑‍🤝‍🧑 College Connect Network
- College-specific feed
- Peer collaboration & team building
- Project and opportunity discovery
- Like, comment, and engagement system

---

### 🏫 Multi-Tenant Architecture
- Each college is an isolated environment
- Secure data separation using `collegeId`
- Scalable for thousands of institutions

---

### 🔐 Authentication System
- JWT-based authentication
- Secure password hashing using bcrypt
- Protected API routes

---

### 📊 Gamification
- Points for activity (posts, participation)
- Leaderboard per college

---

### 💼 Collaboration System
- Create and apply to projects
- Skill-based matching
- Team building within college

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---

## ⚙️ Architecture Highlights

- MVC backend structure
- RESTful API design
- Multi-tenant data isolation
- Secure environment variable handling
- Scalable schema design (indexed by collegeId)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/pathify.git
cd pathify
