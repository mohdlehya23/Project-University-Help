Master Development Prompt: Gaza Universities Platform
Project Overview:
We are building a comprehensive web platform for "Gaza Universities Majors". The goal is to help students explore universities, compare majors, and access admission/career information.



Objective
Implement the following features in 3 Phased Stages as detailed below. For each feature, ensure the code is modular, clean, and fully functional.

Phase 1: Core UX & Essential Information (High Priority)
1. Advanced Search System 🔍

Create a unified search bar that searches across Universities, Colleges, and Majors simultaneously.

Filtering: Add dropdown filters for:

University Type (Public/Private).

Academic Field (Engineering, Health, IT, etc.).

Autocomplete: Implement a suggestion dropdown that appears while typing.

Highlighting: Highlight the search term in the results.

2. Bookmarks System (Favorites) ⭐

Add a "Star" icon next to each major.

Functionality: Clicking the star saves the major to localStorage (no login required for visitors).

My Bookmarks Page: Create a separate view/modal to list all saved majors with quick links to their details.

3. Admission & Cost Info Module 📚

Update the Firestore data structure for each major to include:

admission_gpa: Minimum High School GPA required.

tuition_fees: Cost per hour or year.

degree_type: (Diploma, Bachelor, Master).

study_years: Duration (e.g., 4 years).

UI: Display this information clearly in the Major Details card/modal.

4. Dark Mode 🌙

Implement a toggle switch (Sun/Moon icon) in the header.

Use Tailwind’s dark: classes to style the dark theme.

Save the user's preference in localStorage so it persists on reload.

Phase 2: Engagement & Analytics (Medium Priority)
5. Ratings & Reviews System ⭐

Database: Create a sub-collection reviews under each major.

UI: Allow users to rate a major (1-5 stars) and write a text review.

Logic: Calculate and display the average rating for each major.

Restriction: (Optional) Require Firebase Auth (Google Sign-in) to post a review to prevent spam.

6. Career Guidance Test 🧭

Create a wizard/quiz interface (/career-test).

Questions: Ask about interests (Math, Art, Helping people, Coding).

Logic: Based on answers, suggest a list of suitable majors available in the database.

7. Analytics Dashboard (Admin Only) 📊

Integration: Connect Firebase Analytics or Google Analytics.

Admin UI: Build a dashboard showing:

Most viewed majors.

Most searched terms.

Visitor count per university.

8. Multi-Language Support 🌍

Create a localization system (JSON files for ar.json and en.json).

Add a language switcher (AR/EN) in the navbar.

Ensure RTL/LTR direction switching works correctly with Tailwind (dir="rtl" vs dir="ltr").

Phase 3: Advanced Tools & Performance (Long Term)
9. Comparison System 📊

Allow users to select up to 3 majors to "Add to Compare".

Comparison View: A side-by-side table comparing:

GPA Requirements.

Tuition Fees.

Study Plan (Course count).

Career opportunities.

10. Labor Market Data 💼

Add fields to Firestore for:

jobs: List of potential job titles.

salary_range: Average starting salary.

employment_rate: Percentage (e.g., "High demand").

UI: Display this in a "Career Outlook" tab within the Major Details.

11. Technical Performance ⚡

Lazy Loading: Implement lazy loading for university logos/images.

Caching: Use Service Workers to cache static assets (PWA capabilities) so the site loads instantly on repeat visits.

SEO: Add dynamic <meta> tags (Title, Description) for every view (University/Major) to improve Google indexing.

Implementation Instructions for the AI
Start with Phase 1. Do not try to write all code at once.

Database First: Provide the JSON structure updates needed for Firestore to support these new fields.

Modular Code: Write the JavaScript functions in separate, clearly named functions (e.g., renderComparisonTable(), toggleDarkMode()).

Tailwind Classes: Use standard Tailwind utility classes for all styling.

Error Handling: Include try/catch blocks for all Firebase operations.