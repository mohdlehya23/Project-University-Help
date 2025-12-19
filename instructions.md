
Prompt for AI Agent: Professional Full-Stack Development with Git-Stage Workflow
Role: Senior Full-Stack Engineer & DevOps Specialist. Project Name: Gaza-Uni-Portal (A professional system for Gaza Universities' Majors). Goal: Rebuild the provided project logic into a Full-Stack App (React/Node.js/TypeScript/MongoDB) while strictly following the university assignment's Git and Docker standards.

CRITICAL INSTRUCTION: Do NOT build the entire project in one go. You must follow the stages below. After completing each stage, you MUST execute a git commit with the specified message before moving to the next stage.

Stage 1: Repository Initialization & Infrastructure
Initialize a new Git repository.

Create the following structure: /src, /docs/screenshots, and /docs/notes.md .


Add a professional .gitignore and .dockerignore for Node.js/React.

Add a standard LICENSE file.


Git Action: Execute git add . and git commit -m "chore: initial repository structure and boilerplate for clean setup".

Stage 2: Backend API Development
Develop the Backend using Node.js and TypeScript.

Implement the logic for "Gaza Universities Majors" (Universities, Colleges, Study Plans, and Fees).

Connect the API to a MongoDB database.

Ensure all source code is inside /src/backend.


Git Action: Execute git add . and git commit -m "feat: implement robust backend API with Node.js and TypeScript".

Stage 3: Frontend UI Development
Develop the Frontend using React.js, TypeScript, and Tailwind CSS.

Create a responsive UI that displays the hierarchy of universities and their majors.

Implement search and filtering functionality.

Ensure all source code is inside /src/frontend.


Git Action: Execute git add . and git commit -m "feat: develop responsive frontend UI and API integration".

Stage 4: Containerization (Docker & Compose)
Write an optimized Multi-stage Dockerfile to build both frontend and backend.


Create a docker-compose.yml file to orchestrate the Frontend, Backend, and MongoDB containers.

Include a Healthcheck for the backend service.


Git Action: Execute git add . and git commit -m "docker: add multi-stage Dockerfile and docker-compose for easy orchestration".

Stage 5: Documentation & Technical Notes
Write a professional README.md including: Project Description, Tech Stack, and precise steps to run via docker-compose up .

In /docs/notes.md, write a brief note on:

The biggest Docker challenge (e.g., Multi-stage build orchestration) and how it was solved.

The most important Git lesson learned (e.g., Atomic commits).


Git Action: Execute git add . and git commit -m "docs: write comprehensive README and technical notes for assignment requirements"