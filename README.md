# Gourmet Express | Frontend Microservice

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite)
![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)

**Gourmet Express** is a luxury food delivery platform built with a distributed microservice architecture. This repository contains the **Identity & Gateway Frontend**, designed with a high-end Glassmorphism UI to manage user authentication and monitor network health.

---

## 💎 Design Philosophy
The UI is inspired by premium automotive and product design aesthetics, focusing on:
* **Glassmorphism Panels**: Translucent layers with backdrop-blur effects.
* **Luxury Palette**: A deep slate and gold color system (`#d4af37`).
* **Real-time Monitoring**: A dynamic "Network Status Hub" that pings backend nodes to show Live/Pending/Down states.

## 🚀 Features
* **Secure Authentication**: Integrated with the Spring Boot Identity Service for JWT-ready registration and login.
* **Dynamic Routing**: Managed via React Router 7 with protected dashboard access.
* **Global State Management**: Custom `AuthContext` to persist user sessions and monitor service health globally.
* **Responsive Design**: Fully optimized for mobile and desktop "Gourmet" experiences.

## 🛠️ Tech Stack
* **Framework**: React 19 (TypeScript).
* **Build Tool**: Vite 7.
* **HTTP Client**: Axios with interceptors for microservice communication.
* **Deployment**: Hosted on Render with automated Pull-based CI/CD.

---

## 📂 Project Structure
```text
src/
├── context/       # AuthContext for global state & health monitoring
├── pages/         # Luxury UI pages (Landing, Login, Home, Profile)
├── services/      # Axios API configurations for microservices
├── types/         # TypeScript interfaces for User and Order models
└── App.css        # Custom Glassmorphism design system
```
---
## ⚙️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/your-username/food-ordering-frontend.git](https://github.com/your-username/food-ordering-frontend.git)
   ```
2. **Install dependencies:**;
   ```bash
     npm install
   ```
3. **Configure Environment Variables:**:
   Create a .env file in the root directory and add your Backend URL:
   ```bash
   VITE_API_BASE_URL=[https://user-identity-service.onrender.com/api/users](https://user-identity-service.onrender.com/api/users)
   ```
4. **Run Development Server:**;
   ```bash
   npm run dev
   ```
---
## 🌐 Microservice Architecture
This frontend serves as the central orchestrator for the following nodes:
* **Identity Node:*** (Live) Handles Secure Auth & Profile Management.
* **Catalog Node:** (Pending) Product management and menu integration.
* **Order Node:** (Pending) Transactional service and order tracking.
