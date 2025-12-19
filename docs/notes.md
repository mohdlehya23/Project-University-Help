# Technical Notes

## Docker Challenges

### Challenge: Multi-stage Build Orchestration
**Problem**: Creating an efficient multi-stage Dockerfile that builds both the Node.js backend and React frontend while keeping the final images lightweight.

**Solution**: 
- Implemented a 4-stage build process:
  1. Backend builder stage with production dependencies only
  2. Frontend builder stage with full build toolchain
  3. Backend production using minimal Node.js Alpine image
  4. Frontend production using Nginx Alpine to serve static files

**Key Learnings**:
- Using `npm ci --only=production` reduces image size significantly
- Alpine-based images (node:20-alpine, nginx:alpine) are much smaller than standard images
- Separating build and runtime stages keeps production images lean
- The `COPY --from=` directive allows selective copying between stages

### Challenge: Service Communication in Docker Compose
**Problem**: Frontend container needs to communicate with backend, and backend with MongoDB.

**Solution**:
- Created a custom bridge network (`gaza-uni-network`)
- Used service names as hostnames (e.g., `mongodb://mongodb:27017`)
- Implemented health checks on the backend to ensure it's ready before frontend starts
- Configured Nginx as a reverse proxy to route `/api` requests to the backend

## Git Lessons

### Lesson 1: Atomic Commits
**What I Learned**: Each commit should represent one logical change, following the convention:
- `chore:` for infrastructure/setup
- `feat:` for new features
- `docker:` for containerization work
- `docs:` for documentation

**Why It Matters**: This makes the project history readable and allows for easy rollback of specific features without affecting others.

### Lesson 2: Staged Development Workflow
**What I Learned**: Breaking development into clear stages (Infrastructure → Backend → Frontend → Docker → Docs) with a commit after each stage creates clear project milestones.

**Why It Matters**: 
- Makes collaboration easier (team members can see exactly what was done when)
- Simplifies debugging (issues can be traced to specific stages)
- Provides clear documentation of project evolution through git history

### Lesson 3: .gitignore Best Practices
**What I Learned**: Setting up a comprehensive `.gitignore` from the start prevents accidentally committing:
- `node_modules/` (dependencies)
- `.env` files (secrets)
- Build artifacts (`dist/`, `build/`)
- IDE-specific files

**Why It Matters**: Keeps the repository clean, secure (no leaked credentials), and lightweight (no large binary files).
