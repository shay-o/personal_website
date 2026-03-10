# Personal Website — Shay O'Reilly
**Repo:** https://github.com/shay-o/personal_website
**Live site:** shayoreilly.net (GitHub Pages — DNS not yet configured)

## Status
- Most recent: Medicare overview page refined; chat logging now stable via awaited Airtable calls.
- Focus: polish public-facing copy and get custom domain fully wired up.

## Current tasks
- [x] Airtable logging — working. Root cause was fire-and-forget pattern (`logToAirtable().catch()`) being killed by Vercel before completing; fixed by awaiting the calls before returning the response.
- [ ] Configure GitHub Pages + shayoreilly.net custom domain (Settings → Pages → set source to main, then add CNAME DNS record)
- [x] Replace LinkedIn placeholder URL → https://www.linkedin.com/in/shayoreilly/
- [x] Replace GitHub placeholder URL → https://github.com/shay-o
- [ ] Write About section bio (2–3 paragraphs + update competency tags)
- [ ] Update site-bio in header (currently placeholder text about healthtech/fintech — doesn't match Shay's background)

## Backlog / ideas
- Add volunteer section: SF Fire Dept EMS 6 (Feb–Oct 2024), Salesforce donor data work (Oct–Nov 2016)
- Automate Medicare report copy from AI-Medicare-Advice-Evaluator repo (GitHub Actions option C)
- Add a link to my resume. Likely in PDF form.

## Project structure
- `index.html` / `styles.css` / `script.js` — the site
- `chat-data.js` — chat widget config (suggested questions, header text); system prompt + resume data live server-side
- `chat-widget.js` — chat UI widget (vanilla JS, no dependencies)
- `api/chat.js` — Vercel serverless function: OpenRouter proxy + Airtable logging; holds system prompt and full resume data
- `projects/AI-Medicare-Advice-Evaluator/` — copied report files (overview.html, matrix_report.html)
- `wireframe/` — design exploration files, local only (not pushed to GitHub)

## Chat widget
- Deployed via Vercel (site was migrated from GitHub Pages to Vercel)
- Uses OpenRouter → `anthropic/claude-sonnet-4` model
- Requires Vercel env vars: `OPENROUTER_API_KEY`, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_NAME`, `AIRTABLE_GAPS_TABLE_NAME`
- Airtable table fields (case-sensitive): Session ID, First Question, Message Count, Last Updated, Transcript

## Key decisions made
- Accordion layout (section-level + nested role/project expand)
- Right-side › chevron on role rows to signal expandability (matches section-level pattern, smaller/lighter)
- No contact form — LinkedIn link in header is the primary contact path
- Medicare project links to local overview.html (not external GitHub Pages) via Option A (manual copy)

## Deployment notes
- To update the live site: edit files → `git add` → `git commit` → `git push`
- To update Medicare reports: copy new files from AI-Medicare-Advice-Evaluator/reports/ into projects/AI-Medicare-Advice-Evaluator/, rename index.html → overview.html, update matrix_report.html back-link, then push
