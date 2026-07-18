# 🎮 SDA Project - RPG Online

A basic RPG online game developed using modern web technologies to manage gameplay and content via a backend system. This project was created to develop a complex web application featuring seamless integration between a frontend interface and a scalable backend. 

## 👤 My Role & Contributions
As a member of a 3-person development team, my responsibilities in this project encompassed both frontend and backend integration. My primary contributions included:
*   **Full-Stack Development:** Co-developed the system utilizing Next.js for the frontend user experience and Strapi for the backend content and API management.
*   **Game Logic Integration:** Connected frontend interactions with backend APIs to process character selection, stage progression, and battle outcomes.
*   **System Deployment:** Utilized Git for version control and Vercel for building and deploying the application to the cloud.

## ⚙️ System Architecture 
The system operates by dividing the workload into two main components that communicate via APIs:
*   **Frontend (Next.js):** Provides the web interface for user registration, character class selection, gameplay rendering, and a dedicated admin panel.
*   **Backend (Strapi & Node.js):** Serves as the API provider to manage data for users, characters, monster lists, and active stages. It utilizes a single-threaded event loop to support asynchronous, non-blocking requests.
*   **Database Layer:** Employs SQLite to store internal data, configured within the `.tmp` folder, and supports data recovery via database exporting.

## 🚀 Key Features
*   **Multiuser Concurrency:** Designed to handle multiple players simultaneously, managing real-time data and requests through Strapi APIs without blocking operations.
*   **Role-Based Security:** Features an authentication system with specific access restrictions separating Administrators and regular Members.
*   **Centralized Back-Office:** Allows administrators to easily add, edit, or delete character, monster, and stage data through the Strapi Admin interface.
*   **Interactive RPG Mechanics:** Includes a complete game flow featuring character class selection (Swordman, Wizard, Archer), turn-based combat, and skill/status upgrades.

## 🛠️ Technologies & Tools
*   **Frontend:** Next.js
*   **Backend:** Strapi (Node.js)
*   **Database:** SQLite
*   **Deployment & Control:** Vercel, Docker, Git

## 📄 Project Report
The complete project documentation, including architectural diagrams, UI showcases, and system workflows, can be accessed here:
*   [🔗 View Full SDA Project Report](https://link.psu.th/STCWzx)
