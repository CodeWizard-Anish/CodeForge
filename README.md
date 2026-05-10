# ⚡ CodeForge


**CodeForge** is a full-stack interactive coding platform designed to bridge the gap between watching tutorials and writing real code. It combines a professional-grade editor with a unique "Line Drill" system to help developers master syntax and solve DSA problems with speed and precision.

### 🌐 Live Deployment
* **Live Application:** [code-forge-wine.vercel.app](https://code-forge-wine.vercel.app/)
* **Backend API:** [codeforge-bipz.onrender.com](https://codeforge-bipz.onrender.com)

---

## 🚀 Key Features

* **🧠 Line Drill System:** The core of CodeForge. Upload any source file (JS, Python, C++) and the platform challenges you to retype it line-by-line. It's designed to build true muscle memory for complex syntax.
* **🧩 Integrated Problem Bank:** Practice curated Data Structures and Algorithms (DSA) problems. Each problem comes with pre-configured templates for multiple languages.
* **☁️ Cloud Execution Engine:** Write and run code directly in the browser. Using a secure proxy architecture, your code is executed in isolated environments via the JDoodle API.
* **💉 Smart Import Injection:** Never worry about boilerplate. CodeForge automatically injects necessary imports (like `from typing import *` or `#include <vector>`) to ensure your solutions run just like they would in a professional environment.
* **📜 Persistence & History:** Integrated with MongoDB Atlas to save your custom drill snippets, allowing you to return to your practice sessions anytime.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** [React.js](https://reactjs.org/) (Vite)
* **Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/) (The engine behind VS Code)
* **Deployment:** Vercel

### Backend
* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)
* **Communication:** Axios (Secure API Proxying)
* **Deployment:** Render

---

## 🏗️ Architecture Overview

CodeForge uses a **Serverless-Proxy Architecture** to handle code execution safely:
1.  **Client:** Captures user code and sends a clean JSON payload to the backend.
2.  **Server:** Validates requests, pulls environment variables (API Keys), and injects "Hidden Test Runners" or "Language Imports" to create a seamless LeetCode-like experience.
3.  **Proxy Layer:** Securely communicates with remote execution containers to prevent local resource exhaustion and security risks.

---

## 💻 Local Installation

To run CodeForge on your local machine:

1.  **Clone the Repo:**
    ```bash
    git clone https://github.com/CodeWizard-Anish/CodeForge.git
    cd CodeForge
    ```

2.  **Setup Backend:**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in `/server`:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JDOODLE_CLIENT_ID=your_id
    JDOODLE_CLIENT_SECRET=your_secret
    ```
    ```bash
    node index.js
    ```

3.  **Setup Frontend:**
    ```bash
    cd client
    npm install
    npm run dev
    ```

---

## 👤 Author

**Anish** *GitHub:* [@CodeWizard-Anish](https://github.com/CodeWizard-Anish)

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
