# Street Food QR Menu 🍜📱

A modern, mobile-first digital menu and ordering system designed for street food vendors. Customers can scan a QR code to browse the menu and place orders in real time, while vendors manage orders and updates from a secure dashboard.

### 🌐 Live Demo
[Visit Live Site](https://street-food-qr-menu.vercel.app)

---

## 🚀 Features

- 📲 **QR Code Access**: Customers scan a QR code to instantly view the digital menu—no app download needed.
- 🔐 **Vendor Authentication**: Secure login system for vendors to manage menus and track orders.
- 🧾 **Real-time Orders**: Orders are updated in real time using **Server-Sent Events (SSE)** for seamless order tracking.
- 🖊️ **Dynamic Menu Editing**: Vendors can add, edit, and delete menu items on the fly.
- 🎯 **Mobile-First UI**: Built with **Tailwind CSS** to ensure smooth user experience across all devices.
- ⚡ **Full-Stack with Next.js**: Utilizes **Next.js** for both frontend and backend logic with serverless API routes.
- ☁️ **Deployed on Vercel**: Fast, reliable, and production-ready deployment.

---

## 🛠️ Tech Stack

- **Frontend & Backend**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript
- **Real-Time Communication**: Server-Sent Events (SSE)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/99e62f0b-7e0c-417b-ae65-85d310ab4be6)
![image](https://github.com/user-attachments/assets/419f60c8-788b-4145-b58e-a1f54d1ba9dd)
![image](https://github.com/user-attachments/assets/e0653f92-7f32-4362-854f-dc1896e44828)




---

## Project Structure

The project is organized as follows:

```
street-food-qr-menu/
├── .env.local                # Environment variables (not committed to version control)
├── .gitignore                # Git ignore rules
├── eslint.config.mjs         # ESLint configuration
├── next-env.d.ts             # Next.js environment types
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Project documentation
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication routes
│   │   ├── menu/             # Menu-related routes
│   │   ├── orders/           # Order-related routes
│   │   └── shop/             # Shop-related routes
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Vendor dashboard pages
│   ├── menu/                 # Customer menu pages
│   ├── components/           # Shared UI components
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── page.tsx              # Home page
├── assets/                   # Static assets (e.g., images, icons)
├── components/               # Shared components
├── hooks/                    # Custom React hooks
├── lib/                      # Utility libraries (e.g., database connection)
├── models/                   # Mongoose models
│   ├── MenuItem.ts           # Menu item model
│   ├── Order.ts              # Order model
│   ├── Shop.ts               # Shop model
│   └── User.ts               # User model
├── public/                   # Publicly accessible static files
├── types/                    # TypeScript type definitions
│   ├── menu.ts               # Menu-related types
│   └── next-auth.d.ts        # NextAuth type extensions
└── .next/                    # Next.js build output (ignored in version control)
```

## 🔧 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/street-food-qr-menu.git
   cd street-food-qr-menu
2. **Install dependencies**
    ```bash
    npm install
3. **Run the development server**
     ```bash
     npm run dev
4. **Open localhost:3000 in your browser to view the app.**
 ---

## 📌 TODO

 - Add vendor signup

 - Integrate payments

 - Add order history and analytics

 - Improve accessibility and offline support
---
## 📄 License
This project is open source and available under the MIT License.
---

## 💬 Feedback
Have ideas or feedback? Feel free to open an issue or contribute via a pull request!
