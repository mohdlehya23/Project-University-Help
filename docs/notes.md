Problem-Solving Log - Gaza University Portal Project

Before every thing I had some problems when i tried to install Docker Desktop Application , the application was crashed when make unpackaging and install the application then i tried to search a bout this problem and i found the error in docker logs file so the problem was iam not enabled the virtual maschine platform feature so i enabled it then restart my computer then here we go with this problems too :(

1. MongoDB Atlas Connection Issue (DNS)

Problem: Connection to the Atlas database fails due to IPv6 conflicts in recent Node.js versions.

Solution: Add dns.setDefaultResultOrder('ipv4first') to the database connection file to force the use of IPv4 priority.

2. Docker Build Failure (TypeScript Errors)

Problem: The npm run build process stops due to strict tsc (TypeScript Compiler) errors, such as unused variables and type-only imports.

Solution:

Update imports to use import type for type definitions (e.g., FormEvent and ReactNode).

Add the --skipLibCheck flag to the build command in package.json to ignore errors within external libraries.

Change the build script to vite build only to bypass strict type-checking during the production build phase.

3. Container Communication Issue (Networking)

Problem: Nginx fails to start with the error host not found in upstream "backend".

Solution: Place all containers within a single Docker Bridge Network and ensure the backend container is named backend so Nginx can resolve it. Utilizing docker-compose automates this networking setup.

4. Missing Dependencies in Production (bcryptjs)

Problem: The backend crashes inside the Docker container because the bcryptjs module or its type definitions are missing.

Solution:

Move bcryptjs to the dependencies section in package.json to ensure it is installed in the production environment.

Install @types/bcryptjs and update the package-lock.json file locally before triggering the build.

Use npm install instead of npm ci during the build stages to avoid interruptions caused by version mismatches in the lock file.

5. Missing Environment Variables (.env)

Problem: An error message stating MONGO_URI is not defined appears inside the container even though the file exists.

Solution:

Ensure the .env file is located in the project's root directory (alongside docker-compose.yml).

Include the env_file: - .env directive in the docker-compose.yml file to explicitly pass environment variables to the containers.

6. Windows PowerShell Compatibility

Problem: Standard Linux commands like rm -rf do not function in Windows PowerShell.

Solution: Use the equivalent PowerShell command: Remove-Item -Recurse -Force.
