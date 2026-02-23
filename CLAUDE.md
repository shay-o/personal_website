# Personal Website — Shay O'Reilly
**Repo:** https://github.com/shay-o/personal_website
**Live site:** shayoreilly.net (GitHub Pages — DNS not yet configured)

## Current tasks
- [ ] Configure GitHub Pages + shayoreilly.net custom domain (Settings → Pages → set source to main, then add CNAME DNS record)
- [x] Replace LinkedIn placeholder URL → https://www.linkedin.com/in/shayoreilly/
- [x] Replace GitHub placeholder URL → https://github.com/shay-o
- [ ] Write About section bio (2–3 paragraphs + update competency tags)
- [ ] Update site-bio in header (currently placeholder text about healthtech/fintech — doesn't match Shay's background)

## Backlog / ideas
- Add volunteer section: SF Fire Dept EMS 6 (Feb–Oct 2024), Salesforce donor data work (Oct–Nov 2016)
- Add education section: Reed College BA History, UNC Kenan-Flagler MBA, IDEO Design Thinking, Scrum cert
- Automate Medicare report copy from AI-Medicare-Advice-Evaluator repo (GitHub Actions option C)
- Consider removing GitHub header link if not actively using GitHub publicly

## Project structure
- `index.html` / `styles.css` / `script.js` — the site
- `projects/AI-Medicare-Advice-Evaluator/` — copied report files (overview.html, matrix_report.html)
- `wireframe/` — design exploration files, local only (not pushed to GitHub)

## Key decisions made
- Accordion layout (section-level + nested role/project expand)
- Right-side › chevron on role rows to signal expandability (matches section-level pattern, smaller/lighter)
- No contact form — LinkedIn link in header is the primary contact path
- Medicare project links to local overview.html (not external GitHub Pages) via Option A (manual copy)

## Deployment notes
- To update the live site: edit files → `git add` → `git commit` → `git push`
- To update Medicare reports: copy new files from AI-Medicare-Advice-Evaluator/reports/ into projects/AI-Medicare-Advice-Evaluator/, rename index.html → overview.html, update matrix_report.html back-link, then push
