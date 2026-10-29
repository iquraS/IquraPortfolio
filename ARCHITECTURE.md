# Portfolio Architecture

This project is a static-exported Next.js application. The profile in `src/lib/defaultResume.json` supplies the content rendered by the portfolio components, while `src/lib/resumeTypes.ts` defines the profile shape.

## Data flow

```text
defaultResume.json
        |
  ResumeProvider
        |
  Portfolio components
        |
  Next.js static export
        |
  GitHub Actions -> GitHub Pages
```

The GitHub projects section requests public repositories for `iquraS` from the GitHub API in the visitor's browser. The rest of the portfolio is generated as static content.

## Deployment

`next.config.js` sets the `/IquraPortfolio` base path for production builds. The GitHub Actions workflow installs dependencies, builds the static site, and deploys the `out` directory to GitHub Pages.
