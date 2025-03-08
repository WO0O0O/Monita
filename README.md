# UpMon - Website Uptime Monitoring Made Simple

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/badge/Built%20with-Flask%20%26%20React-61DAFB?style=for-the-badge" alt="Built with"/>
</div>

<p align="center">
  <img src="https://via.placeholder.com/800x400?text=UpMon+Dashboard" alt="UpMon Dashboard Preview" width="80%"/>
</p>

## 🔍 Overview

**UpMon** is a lightweight, modern website uptime monitoring solution that helps you keep track of your web services' availability and performance. With real-time monitoring, intuitive dashboards, and detailed analytics, you'll never be caught off guard by website downtime again.

## ✨ Key Features

- **Real-time Monitoring**: Automatic checks every minute to ensure your websites are up and running
- **Beautiful Dashboard**: At-a-glance view of all your monitored websites with status indicators
- **Detailed Analytics**: Response time tracking, status code monitoring, and historical data
- **Instant Alerts**: (Coming Soon) Get notified via email or SMS when a website goes down
- **Simple Setup**: Easy to deploy and configure, with minimal dependencies

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/UpMon.git
   cd UpMon
   ```

2. Set up the backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   python run.py
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🖥️ How It Works

UpMon consists of two main components:

1. **Backend (Flask)**: Handles website monitoring, data storage, and provides a RESTful API
2. **Frontend (React)**: Delivers a responsive user interface to manage and view monitoring data

The system performs regular HTTP requests to check if your websites are responding correctly. It tracks response times, status codes, and calculates uptime percentages. All this data is presented in an intuitive dashboard that updates in real-time.

## 🛠️ Technology Stack

- **Backend**: Flask, SQLite (coming soon)
- **Frontend**: React, Material UI
- **API**: RESTful architecture with JSON
- **Monitoring**: Asynchronous checks with threading

## 📝 Roadmap

- [ ] Persistent storage with SQLite
- [ ] Email and SMS notifications
- [ ] Custom check intervals per website
- [ ] User authentication
- [ ] Advanced analytics and reporting
- [ ] Mobile app integration

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve UpMon.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">
  Made with ❤️ for the web monitoring community
</p>
