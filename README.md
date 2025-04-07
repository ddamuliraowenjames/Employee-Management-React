# Employee Management React

**Live Demo (Render):** https://employee-management-react-j7lg.onrender.com  
**Live Demo (GitHub Pages):** https://ddamuliraowenjames.github.io/Employee-Management-React  

---

## Overview

A single‑page React application for managing employee onboarding. Features include:

- **Employee CRUD**: Add, edit, delete employee profiles  
- **Onboarding Tasks**: Automatically assigned checklists per hire  
- **Dashboard**: Interactive charts showing hires and task progress  
- **Reports**: Export CSV/PDF summaries  
- **Settings**: Configure lookup data and theme  

Built with Create React App, Tailwind CSS, Chart.js, and JSON‑Server (wrapped in Express for production).

---

## Render Deployment

To deploy the full stack (React + Express/JSON‑Server) on Render, you can include a `render.yaml` in your repo root:

```yaml
# render.yaml
services:
  - type: web
    name: employee-management-react
    env: node
    region: oregon
    branch: main
    buildCommand: |
      npm install
      npm run build
    startCommand: npm run serve
    envVars:
      - key: PUBLIC_URL
        value: /
Push this file to your GitHub repo.

Connect your repo in Render → Create Web Service.

Render will pick up render.yaml, install deps, build with PUBLIC_URL=/, and start your server.

GitHub Pages Deployment
Ensure your package.json has:

json
Copy
"homepage": "https://ddamuliraowenjames.github.io/Employee-Management-React"
Run:

bash
Copy
npm run predeploy
npm run deploy
Visit:

arduino
Copy
https://ddamuliraowenjames.github.io/Employee-Management-React
Local Development
Install dependencies and run both client and API:

bash
Copy
npm install
npm run dev
React app → http://localhost:3000

JSON‑Server API → http://localhost:5000

Scripts
bash
Copy
npm start        # React dev server
npm run server   # JSON‑Server on port 5000
npm run dev      # Both React & JSON‑Server concurrently
npm run build    # Production build (for GitHub Pages)
npm run serve    # Serve build + API via Express (for Render)
npm run deploy   # Publish to GitHub Pages
Contributing
Fork the repo

Create a branch:

bash
Copy
git checkout -b feat/your-feature
Commit & push, then open a PR.

License
MIT License
© 2025 Owen James Ddamulira# Employee-Management-React