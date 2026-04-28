Multi-Document Visual Editor 📝
A sophisticated, React-based text editor that allows users to manage multiple documents simultaneously through an interactive UI. Featuring a custom virtual keyboard, rich text styling, and persistent local storage.

👥 Collaboration & Development
Important Note: This project is the result of a full and equal collaboration between the team members. While the commit history or local environment might appear as though the work was conducted from a single machine, the entire development process followed the Pair Programming methodology.

Every line of code, architectural decision, and bug fix was brainstormed and implemented together. This project reflects a balanced team effort where both partners were actively involved in every stage of development.

🚀 Key Features
Multi-Document Management: Open, close, and switch between multiple documents seamlessly in a dynamic workspace.

Smart Virtual Keyboard: Full support for Hebrew and English layouts, including Caps Lock functionality, special symbols, and emojis.

Rich Text Styling: Comprehensive control over font families, text sizes, and colors. Styles can be applied to specific selections or the entire document.

Advanced Search & Replace: Powerful engine to find text within documents with real-time highlighting and "Replace All" capabilities.

Data Persistence: User-specific login system with the ability to save and restore files using the LocalStorage API. Includes "Unsaved Changes" alerts to prevent data loss.

Action History: Robust Undo/Redo functionality maintained individually for each open document.

🛠 Tech Stack
Frontend: React 19 (Hooks, Functional Components)

Styling: Tailwind CSS (Responsive Design)

Build Tool: Vite

Storage: LocalStorage API with a dedicated custom Storage Service.

💻 Getting Started
Clone the repository:

Bash
git clone [repository-url]
Navigate to the project directory:

Bash
cd FULLSTACK4
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
🏗 Project Structure
src/features/editor/: Core editor logic and state management.

src/components/: Reusable UI components such as Login screens and Modals.

src/features/editor/storage.js: Service layer for browser-based data persistence.

src/features/editor/constants.js: Configuration for keyboard layouts, fonts, and theme colors.
