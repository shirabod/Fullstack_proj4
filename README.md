Study Flow – Smart Study Planner (Full-Stack Simulation)
👥 Collaboration & Authorship
This project was developed in full, equal collaboration by [Your Name] and Shira Alkobi. Throughout the development process, we worked closely on every module. We frequently utilized Pair Programming techniques, often developing and debugging from a single workstation to ensure architectural consistency and shared logic. Whether the code was pushed from one GitHub account or the other, every feature reflects our combined effort and mutual problem-solving.

🚀 Key Features
Complete CRUD Operations: Create, Read, Update, and Delete study tasks.

Advanced Filtering & Search: Real-time search by title or subject and filtering by priority levels.

Dynamic Dashboard: Live statistics (Total/Pending/Completed) and an urgent tasks panel to keep students on track.

Interactive Calendar View: A visual deadline tracker with color-coded task indicators.

User Authentication: Secure registration and login system.

Session Persistence: Implementation of cookie-based sessions to keep users logged in across refreshes.

🛠️ Technical Architecture
This project demonstrates a deep understanding of full-stack systems by simulating an entire enterprise ecosystem within the browser:

Frontend Layer: A Single Page Application (SPA) architecture built with vanilla JavaScript (ES6+), HTML5, and CSS3, using a template-based navigation system.

Network Layer (FAJAX): A custom-built simulation of the XMLHttpRequest object (FAJAX) that introduces:

Simulated Latency: Random delays (1-3s) to mimic real-world server response times.

Packet Loss: A configurable "drop rate" to test how the frontend handles network failures.

Backend Layer: Simulated Node.js-style servers (AuthServer and TasksServer) that handle routing, data validation, and logic.

Database Layer: A simulated relational database managed via LocalStorage, featuring specialized controllers for users and tasks.

💻 Technologies Used
Language: JavaScript (ES6+)

Styling: CSS3 (Custom properties, Flexbox, Grid)

Storage: LocalStorage API & Cookie Management

Architecture: Modular MVC (Model-View-Controller) design.

🧠 Core Competencies Demonstrated
Asynchronous Flow: Managing complex data lifecycles using Promises and Async/Await.

Full-Stack Data Flow: Implementing the complete journey of a request from UI input to database persistence.

Resilient Programming: Designing frontend logic that gracefully handles simulated network errors and timeouts.

Collaboration: Demonstrating the ability to work in a synchronized team environment using Git.
