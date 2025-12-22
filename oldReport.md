Here is the complete report in English, formatted as a single `report.md` file.

```markdown
# Documentation Report: Gaza Universities Majors Platform

## 1. Project Overview
This project is a dynamic Single Page Application (SPA) designed to centralize and facilitate access to information regarding university majors in Gaza. It allows students to browse universities, search for specific majors, and access detailed study plans. Additionally, it features a comprehensive Admin Panel for authorized personnel to manage and update data securely [conversation_history:1].

---

## 2. Tech Stack

The project utilizes a separation of concerns architecture to ensure maintainability and scalability:

*   **Frontend:**
    *   **HTML5:** Used for semantic structural markup.
    *   **CSS3 & Tailwind CSS:** Utilized for modern, responsive styling with full Right-to-Left (RTL) support for Arabic.
    *   **JavaScript (ES6 Modules):** Handles application logic, DOM manipulation, state management, and API interactions.
*   **Backend & BaaS (Backend as a Service):**
    *   **Firebase Firestore:** A NoSQL cloud database used to store university and major data in a hierarchical JSON-like format.
    *   **Firebase Authentication:** Manages secure login sessions for administrators.
*   **Deployment:**
    *   **Firebase Hosting:** Serves the static assets over a secure global CDN (HTTPS) [conversation_history:2].

---

## 3. Project File Structure

The project is organized into a clean directory structure ready for deployment:

```
gaza-universities/
│
├── public/                 # Public directory for hosting
│   ├── index.html          # Main entry point
│   ├── styles/
│   │   └── style.css       # Custom CSS overrides
│   └── scripts/
│       └── main.js         # Core application logic & Firebase SDK
│
├── firebase.json           # Hosting configuration
└── .firebaserc             # Firebase project aliases
```

---

## 4. Core Functionalities

The system is divided into two primary views:

### A. Public User View
1.  **University Browsing:** Displays a grid of interactive cards showing university names, distinctive theme colors, and the count of available majors.
2.  **Live Search:** A real-time search bar that filters results by university name or major name instantly without page reloads.
3.  **Major Details:** Clicking a university reveals its specific majors with descriptions.
4.  **Study Plans:** Users can access study plans directly via external links (PDFs/Pages) provided in the data [conversation_history:1].

### B. Admin Panel
1.  **Secure Authentication:** A login system that restricts administrative access to authorized users via Firebase Auth.
2.  **University Management:**
    *   **Edit:** Modify university names and theme colors.
    *   **Add New University:** A dedicated Modal form to create new university entries, ensuring unique ID validation.
3.  **Major Management:**
    *   **Add Major:** A popup Modal to input major names, descriptions, and optional study plan URLs.
    *   **Delete Major:** Capability to remove obsolete majors with confirmation.
4.  **Navigation:** Seamless switching between the Admin Panel and the Main Public View using a specialized "Back" button [conversation_history:2].

---

## 5. Key Features & Additions

Several enhancements were implemented to improve User Experience (UX) and Developer Experience (DX):

### 1. Interactive Modals
Instead of navigating to separate pages for data entry, the application uses Tailwind-styled overlay Modals. This keeps the admin within the same context, making data entry faster and smoother.

### 2. Fully Responsive Design
The interface is built using Tailwind's utility-first classes, ensuring the layout adapts perfectly to mobile devices, tablets, and desktops.

### 3. Study Plan Integration (Plan URLs)
The data structure supports a `plan_url` field. If a URL is present, the UI dynamically renders a "Go to Plan" button; otherwise, it defaults to the text description.

### 4. Firestore Security Rules
Database security is enforced at the server level. Rules are configured to allow public read access (`allow read: if true`) while strictly limiting write/delete operations to authenticated users (`allow write: if request.auth != null`) [conversation_history:3].

---

## 6. Development Workflow

1.  **UI Design:** Constructed the HTML skeleton and applied Tailwind CSS for rapid styling.
2.  **Integration:** Imported Firebase SDKs via ES modules in `main.js`.
3.  **Logic Implementation:** Developed asynchronous `fetch` functions for data retrieval and DOM rendering logic.
4.  **Admin Features:** Implemented CRUD (Create, Read, Update, Delete) operations connected to Firebase Auth.
5.  **Deployment:** Configured `firebase.json` and deployed the `public` directory using the Firebase CLI.
```