# Iqura Siddiqui — Portfolio

A resume-driven portfolio for Iqura Siddiqui, highlighting operations, quality control, compliance, reporting, and practical use of AI tools.

## Run locally

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Portfolio content is maintained in `src/lib/defaultResume.json`; the corresponding TypeScript interfaces are in `src/lib/resumeTypes.ts`.

The site displays Iqura's email address and phone number as public contact details. It also loads recent public repositories from the `iquraS` GitHub account using GitHub's unauthenticated API.

## Deploy to GitHub Pages

The project is configured for the repository path `/IquraPortfolio/`. Enable GitHub Pages with **GitHub Actions** as the build and deployment source in the repository settings. Push to `main` to run the workflow in `.github/workflows/deploy.yml`.

Expected site URL: <https://iquras.github.io/IquraPortfolio/>.
