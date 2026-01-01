# 🚚 Jhotpot – Parcel Management & Delivery System

# 📋 Project Overview
Jhotpot is a **full-stack B2C parcel management and delivery platform** designed to streamline parcel booking, tracking, rider management, and delivery operations through a modern, role-based dashboard system.

The system is built with scalability, performance, and real-world logistics workflows in mind, making it suitable for courier services and delivery-based businesses.

---

## 🔗 Live Demo & Repositories

* 🌐 **Live Website:** [https://jhotpot.vercel.app](https://jhotpot.vercel.app)
* 💻 **Client Repository:** [https://github.com/your-username/jhotpot-client](https://github.com/your-username/jhotpot-client)
* 🖥️ **Server Repository:** [https://github.com/your-username/jhotpot-server](https://github.com/your-username/jhotpot-server)

---

## 🖼️ Screenshots

### 🏠 Home Page

![Home Page](/src/assets/home.png)

### 👤 User Dashboard

![User Dashboard](/src/assets/user.png)

### 🛠️ Rider Dashboard

![Admin Dashboard](/src/assets/rider.png)

### 🏍️ Admin Dashboard

![Rider Dashboard](/src/assets/admin.png)

---

## 🎯 Key Features

### 👤 Customer / User

* Parcel booking with delivery details
* Parcel tracking by tracking ID
* Secure online payments
* View parcel history & payment history
* Profile update & account management

### 🏍️ Rider

* View assigned delivery requests
* Update delivery status (Pending → Delivered)
* Earnings tracking dashboard

### 🛠️ Admin

* Assign riders to parcels
* Manage users and riders
* Approve or reject rider requests
* Monitor delivery status & system analytics
* Role-based access control (RBAC)

---

## 🧑‍💻 Tech Stack

### Frontend

* React.js
* React Router DOM
* Tailwind CSS
* DaisyUI
* TanStack Query
* Framer Motion
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication

### Integrations & Tools

* Stripe (Payment Gateway)
* Cloud Image Hosting
* Role-based Authorization

---

## 🗂️ Project Structure

```bash
client/
 ┣ components/
 ┣ layouts/
 ┣ pages/
 ┣ hooks/
 ┣ routes/
 ┗ assets/

server/
 ┣ controllers/
 ┣ routes/
 ┣ middleware/
 ┣ models/
 ┗ utils/
```

---

## 🔐 Authentication & Authorization

* JWT-based authentication
* Secure private routes for protected pages
* Role-based access for **Admin**, **Rider**, and **Customer**
* Unauthorized access is restricted at both frontend and backend levels

---

## 🔄 System Workflow

1. User creates a parcel delivery request
2. Admin reviews and assigns a rider
3. Rider accepts and delivers the parcel
4. Delivery status is updated in real time
5. User can track parcel and view payment history



---

## ⚙️ Installation & Setup

### Clone the repositories

```bash
git clone https://github.com/your-username/jhotpot-client.git
git clone https://github.com/your-username/jhotpot-server.git
```

### Client Setup

```bash
cd jhotpot-client
npm install
npm run dev
```

### Server Setup

```bash
cd jhotpot-server
npm install
npm run start
```

---

## 🔑 Environment Variables

Create a `.env` file in both client and server projects.

### Client (`.env`)

```env
VITE_API_URL=your_backend_api_url
```

### Server (`.env`)

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## 🚀 Future Enhancements

* Real-time tracking using Socket.io
* Push notifications for delivery updates
* Mobile application (React Native)
* Advanced delivery analytics & reports

---

## 👨‍💻 Author

**Shuvo Dev Nath**
MERN Stack Developer

* GitHub: [https://github.com/SDNATH-Git](https://github.com/SDNATH-Git)
* LinkedIn: [https://www.linkedin.com/in/sd-nath/](https://www.linkedin.com/in/sd-nath/)

---

## 📜 License

This project is developed for educational and portfolio purposes.

---

⭐ *If you find this project useful, feel free to give it a star on GitHub!*
