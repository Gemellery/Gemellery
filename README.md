# 💎 Gemellery: Premium Blockchain-Powered Gemstone Marketplace

**Gemellery** is a sophisticated, end-to-end digital marketplace designed for high-value gemstone trading. By integrating **Blockchain technology**, Gemellery ensures absolute transparency, trust, and authenticity for every transaction. Featuring a multi-layered ecosystem for buyers, sellers, and administrators, it leverages AI-driven tools and decentralized verification to redefine the gemstone industry.

---

## ✨ Key Features

### 🛒 Marketplace & E-commerce
- **Exquisite Catalog:** High-resolution browsing of rare gemstones with detailed filtering.
- **AI Jewelry Designer:** Innovative tool to visualize and design custom jewelry pieces around selected gems.
- **Smart Cart & Wishlist:** Seamless shopping experience with persistent data and easy checkout.
- **Dynamic Pricing:** Real-time price tracking and historical charts for gem values.

### 🛡️ Blockchain & Security
- **NFT-Based Certificates:** Every gemstone comes with a blockchain-verified digital certificate (`GemCertificate.sol`).
- **Immutable Provenance:** Track the complete history of a gem from mine to market.
- **Smart Contract Auditing:** Hardhat-backed development and testing of all transactional logic.
- **Secure Authentication:** Multi-factor login, JWT-protected routes, and Google OAuth integration.

### 👥 User Roles & Dashboards
- **💎 For Buyers:** Personalized dashboard, order tracking, wishlist management, and certificate verification.
- **🏪 For Sellers:** Inventory management, sales analytics, shipment tracking, and automated reporting.
- **👑 For Admins:** Seller verification, product moderation, user management, and detailed site analytics.
- **🛠️ For Super Admin:** Complete system control, admin management, and maintenance mode toggles.

### 🤖 Intelligence & Support
- **AI Chatbot:** Integrated Google Gemini-powered assistant for instant gemstone inquiries and support.
- **Automated Reporting:** Generate professional PDF reports for orders and inventories.
- **Notification Engine:** Real-time email updates via Nodemailer for all critical milestones.

---

## 🛠️ Technical Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS 4, Framer Motion, Recharts |
| **Backend** | Node.js, Express, Sequelize ORM, MySQL |
| **Blockchain** | Solidity, Hardhat, Ethers.js, TypeChain |
| **Storage** | AWS S3 (Images/Files), Local Storage |
| **Identity** | JWT, Bcrypt, Google Identity Service |
| **AI/ML** | Google Generative AI (Gemini), Sharp (Image Processing) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [MySQL](https://www.mysql.com/) (Local or Cloud instance)
- [MetaMask](https://metamask.io/) (For blockchain features)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/gemellery.git
cd gemellery

# Install for Root
npm install

# Install for Backend
cd backend && npm install

# Install for Frontend
cd ../frontend && npm install

# Install for Blockchain
cd ../blockchain && npm install
```

### 2. Configuration
Create `.env` files in both `backend/` and `blockchain/` directories.

**Backend `.env`:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=gemellery_db
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
GOOGLE_CLIENT_ID=your_google_id
GEMINI_API_KEY=your_gemini_key
```

### 3. Database & Blockchain Setup
```bash
# Backend: Initialize Sequelize
cd backend
npx sequelize-cli db:migrate

# Blockchain: Compile & Deploy
cd ../blockchain
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

### 4. Run Development Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## 📂 Project Structure

```text
Gemellery/
├── backend/            # Express.js Server & API
│   ├── src/
│   │   ├── controllers/ # Logic handlers
│   │   ├── models/      # Sequelize definitions
│   │   ├── routes/      # API endpoints
│   │   └── services/    # External integrations (S3, Gemini)
├── frontend/           # React 19 Application
│   ├── src/
│   │   ├── components/  # Reusable UI
│   │   ├── pages/       # Route-level components
│   │   └── context/     # State management
├── blockchain/         # Hardhat Project
│   ├── contracts/       # Solidity Smart Contracts
│   └── test/            # Contract test suites
└── .github/            # CI/CD Workflows
```

---

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with 💖 for the Gemstone Industry by the Gemellery Team.
