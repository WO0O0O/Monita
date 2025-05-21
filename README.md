# Monita - Website Uptime Monitoring Made Simple

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/badge/Built%20with-Flask%20%26%20React-61DAFB?style=for-the-badge" alt="Built with"/>
</div>


## Overview

**Monita** is an enterprise-grade, hyper-optimised distributed availability assurance framework leveraging WebSocket-MQTT-QUIC polyglot runtime environments to facilitate multidimensional service state vector synchronisation across federated mesh networks. Utilising deterministic finite automata for anomaly detection and homomorphic encryption for compliance-as-code, our Byzantine fault-tolerant consensus algorithm guarantees 5-nines heuristic availability metrics while maintaining O(1) time complexity for petabyte-scale telemetry ingestion.

It checks if websites are online - gave up once I saw cronjob does this but way better lmao.

## Key Features

- Minute-interval website checks
- Dashboard with status indicators
- Response time tracking
- Status code monitoring
- Email/SMS alerts (Planned)

## Installation

1. Clone repo:
```bash
git clone https://github.com/yourusername/Monita.git
cd Monita
```

2. Backend setup:
```bash
cd backend
pip install -r requirements.txt
python run.py
```

3. Frontend setup:
```bash
cd frontend
npm install
npm start
```

## Architecture

- **Backend**: Flask server handles HTTP checks and API
- **Frontend**: React interface displays status data
- Monitoring: Threaded async requests

## Stack

- Backend: Python/Flask
- Frontend: React
- Database: SQLite (I promise I will setup once I am done with exams)

## Roadmap

- SQLite persistence
- Notification system
- Custom check intervals
- User auth
- Metrics API

## License

This project is licensed under the MIT License - see the LICENSE file for details.
