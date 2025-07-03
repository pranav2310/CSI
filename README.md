# GAIL Customer Feedback System

A full-stack web application for collecting, managing, and analyzing customer feedback on GAIL products.  
Built with **Node.js/Express**, **MongoDB**, and a modern **React** frontend using Material UI.

---

## Features

- **Customer Login via OTP**  
  Customers log in using their phone number and a one-time password (OTP).

- **Admin Login**  
  Secure admin access with JWT authentication.

- **Product & Question Management**  
  Admins can add, edit, and delete products and feedback questions.

- **Bulk Customer Upload**  
  Upload customer data via CSV, with product mapping.

- **Feedback Collection**  
  Customers rate products and answer both common and product-specific questions.

- **Feedback Reporting**  
  Admins can view, filter, and analyze feedback:
  - Click to view detailed feedback reports.
  - See combined/aggregate reports for multiple products.
  - Filter by year and customer phone.

---

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend:** React, Material UI, Axios, React Router
- **Other:** Multer (CSV upload), bcryptjs (password hashing), dotenv

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB

### 1. Clone the Repository
```bash
    git clone https://github.com/yourusername/gail-feedback.git
    cd gail-feedback
```


### 2. Backend Setup
```bash
    cd backend
    npm install
```

- Copy `.env.example` to `.env` and set your environment variables:

- Start Backend Server

```bash
    npx nodemon app.js
```

### 3. Frontend Setup
```bash
    cd ../frontend
    npm install
```
- Start Frontend development Server

```bash
    npm start
```

- The frontend runs at [http://localhost:3000](http://localhost:3000) and connects to the backend at `http://localhost:5001`.

---
## 📱 Twilio OTP Verification

This application uses [Twilio Verify](https://www.twilio.com/docs/verify/api) for secure, production-grade OTP (One-Time Password) delivery and validation.

### Twilio Setup

1. **Create a Twilio Account** and a Verify Service.
2. Add the following to your `.env` file:
    ```
    TWILIO_ACCOUNT_SID=your_account_sid
    TWILIO_AUTH_TOKEN=your_auth_token
    TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
    ```
3. No need to store OTPs in your database—Twilio manages code generation, delivery, and expiry.

### How OTP Works

- **Request OTP:**  
  Customers enter their phone number. The backend calls Twilio Verify to send an OTP via SMS.
- **Verify OTP:**  
  Customers enter the received OTP. The backend verifies it with Twilio. If valid, login is successful.

---

## 🛠️ API Endpoints (OTP)

- **POST `/api/customer/request-otp`**  
  Request an OTP for a phone number.

---

## Usage

- **Customer Flow:**
1. Enter phone number and request OTP.
2. Enter received OTP to log in.
3. Submit feedback for assigned products.

- **Admin Flow:**
1. Log in with admin credentials.
2. Manage products and questions.
3. Upload customers in bulk via CSV.
4. View and analyze feedback reports, including combined product reports.

---

## Project Structure
```
backend/
    models/
    routes/
    controllers/
    middlewares/
    .env.example
    app.js

frontend/
    src/
        components/
            api/
            auth/
            assets/
        App.js
        index.js
    public/
```

---

## CSV Upload Format

- **Headers:** `phone,name,products`
- **Example:** 
```
phone,name,products
9876543210,John Doe,Product A;Product B
9123456789,Jane Smith,Product C
```


---

## Customization

- To change branding colors, edit the color variables in frontend components.
- To add new question types or feedback logic, update the backend models and controllers.

---



