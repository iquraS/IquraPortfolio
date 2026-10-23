# Resume-Driven Portfolio

🌐 **Live Sites**:
- **Vishesh Singh**: [ https://visheshmohan-sketch.github.io/MyPortfolio/vishesh-singh/](https://visheshmohan-sketch.github.io/MyPortfolio/vishesh-singh/)
- **Sheeba Ahmed**: [https://sheebahbti.github.io/MyPortfolio/](https://sheebahbti.github.io/MyPortfolio/)

A responsive portfolio site driven by resume profile data and public GitHub repositories.

## Create a Profile

Open `/create` in the running site. Import a DOCX, TXT, or Markdown resume, or paste text copied from a PDF. The browser suggests contact details, a possible title and summary, and skills under common headings. Review the live portfolio preview, enter or correct experience, projects, and education, then export. Resume files are processed locally and are not uploaded; verify suggestions before using them.

Download the profile JSON and use it as `src/lib/defaultResume.json` to drive the homepage. The data format is defined in `src/lib/resumeTypes.ts`. For optional AI initiatives, add an `aiInitiatives` array with `title`, `description`, `impact`, `tags`, and `status` for each item.

The portfolio loads up to six recently updated public repositories from the supplied GitHub username. GitHub's unauthenticated API has rate limits; repository loading falls back to a profile link if the API is unavailable.

Then deploy:
```bash
git add .
git commit -m "Update resume"
git push origin main
```

Changes automatically deploy to the live URL!

## 💡 Features

- **Hero Section** - Professional introduction with contact links
- **About** - Summary and leadership philosophy
- **Skills** - Technical and leadership competencies
- **Career Timeline** - Interactive journey from IC to Manager
- **Key Projects** - Achievements with measurable impact
- **Contact** - Multiple ways to connect

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript
- **Deployment**: GitHub Pages (Auto-deploy on push)