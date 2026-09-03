# Content Gap Report — Web Development Masterclass

**Prepared:** 3 September 2026
**Scope:** Audit of every learning resource supplied in the project root, mapped against the
seeded 8-week curriculum in `masterclass_weeks`.
**Method:** Each document's text was extracted and its chapter structure read. Nothing was
classified from its filename.

---

## 1. What was audited

Eleven files were supplied, representing **eight distinct documents**. Three of them shipped as
both `.docx` and `.pdf`; those pairs were confirmed to be the same content, so the PDF is now the
student-facing viewable copy and the DOCX is the editable download.

| Document | Extent | Actual content | Assigned to |
|---|---|---|---|
| Web Fundamentals Training Manual | 71 pp, 17 chapters + glossary | Internet mechanics, client/server, frontend vs backend, website types, page anatomy, layout and design principles, build process, then foundations of HTML, CSS, JS, PHP and MySQL, dashboards, AI, capstone | Week 1 — notes |
| HTML & Semantic HTML Master Guide | 37 pp, 7 parts + quiz | HTML foundations, core elements, attributes, semantic HTML, real-world page structure, accessibility, quiz | Week 1 — notes |
| HTML Notes | 396 paragraphs, 6 parts | Condensed HTML study reference | Week 1 — reference |
| JavaScript Complete Master Guide | 1,404 paragraphs, 16 chapters | Variables through DOM, events, forms, ES6+, async, error handling, OOP, modules, quiz | Week 4 — notes |
| SPA Student Guide | 364 paragraphs | Guided single-page-app build with a vanilla JS router, quiz, project brief, rubric | Week 4 — practical |
| Frontend Auth, Forms & HTTP Guide | 24 pp, 12 sections | HTML forms, login/register, authentication vs authorization, HTTP methods, JS validation, security, quiz | Week 4 — reference |
| PHP Complete Master Guide | 1,772 paragraphs, 16 chapters | PHP syntax through forms, superglobals, OOP, PHP+MySQL, sessions, auth, security, MVC, quiz | Week 5 — notes |
| MySQL Database Management Master Guide | 1,535 paragraphs, 18 chapters | Relational theory, DDL, DML, joins, subqueries, constraints, indexes, transactions, normalization, security, PDO integration, quiz | Week 6 — notes |

### Classification decisions worth recording

- **HTML Notes is not a duplicate.** It overlaps the HTML Master Guide but is a fifth of the
  length and written as a revision sheet. It is filed as Week 1 *reference*, not notes, because it
  serves recall rather than teaching.
- **The HTML Master Guide sits entirely in Week 1**, not split across Weeks 1 and 2. The seeded
  Week 1 topic list already includes semantic HTML, so splitting it would contradict the
  curriculum that is actually in the database.
- **The Auth/Forms/HTTP guide is cross-cutting** — forms are Week 1 HTML, JavaScript validation is
  a stated Week 4 objective, and auth concepts land in Week 5. It is filed under Week 4
  *reference* because its practical core is client-side form handling, and its description tells
  students it also sets up Weeks 5 and 6.
- **The Web Fundamentals manual spans the whole programme** but anchors in Week 1, which is
  literally titled "Web Fundamentals + HTML". Its description says it previews later weeks.
- **Nothing was discarded.** No document was outdated or redundant enough to drop.

---

## 2. Gaps found

Before this work, four of the eight weeks had **no learning material at all**.

| Week | Topic | Existing resource | Missing resource | Priority | Status |
|---|---|---|---|---|---|
| 1 | Web fundamentals & HTML | Training manual, HTML master guide, quick reference | Slide deck | Low | Open |
| 2 | CSS & responsive design | **None** | Complete CSS guide: cascade, box model, Flexbox, Grid, mobile-first | **Critical** | **Written** |
| 3 | Tailwind CSS | **None** | Complete Tailwind guide: utility-first, config, components | **Critical** | **Written** |
| 4 | JavaScript | JS master guide, SPA build guide, forms/auth guide | — | — | Covered |
| 4 | Git & GitHub | **None** | Version control guide: branching, conflicts, pull requests | **High** | **Written** |
| 5 | PHP | PHP master guide | Practical exercise sheet | Medium | Open |
| 6 | MySQL | MySQL master guide | ER-diagram exercise pack | Medium | Open |
| 7 | Deployment, Docker, DevOps | **None** | Complete guide: SDLC, environments, DNS/SSL, Docker, CI/CD | **Critical** | **Written** |
| 8 | Capstone | Chapter 17 of the Week 1 manual only | Full project guide, brief, rubric, security checklist | **Critical** | **Written** |

### Gaps that remain open

These were judged real but lower value than the five documents written, and are listed so the
decision is visible rather than silent.

| Gap | Weeks affected | Priority | Note |
|---|---|---|---|
| Slide decks (PPTX) | All | Low | The LMS supports PPTX upload and the folders exist. Decks are session aids, not study material, so they add little to a student reading alone. |
| Standalone practical sheets | 1, 2, 3, 5, 6, 7 | Medium | Each written guide already carries a practical exercise chapter and an assignment brief, so this is a packaging gap rather than a content gap. |
| Session recordings | All | Medium | Cannot be authored — they are produced when the cohort runs. The `recording` category is ready for them. |
| Per-week glossary documents | All | Low | Each guide now carries 40-50 terms, and the LMS already has a terminology tab per week backed by `masterclass_terminology`. |
| Starter code repositories | 2, 3, 4, 8 | Medium | Better served as GitHub links than as uploaded archives; the `link`/`github` resource types already support this. |

---

## 3. What was written

Five documents, **105 pages and roughly 34,000 words**, all following the Tech Pulse Insider
document standard.

| Document | Pages | Terms | Quiz | Assignment |
|---|---|---|---|---|
| Week 2 — CSS Foundations & Responsive Design | 22 | 48 | 10 questions | Responsive business site |
| Week 3 — Tailwind CSS & Modern Frontend | 19 | 42 | 10 questions | Component-driven landing page |
| Week 4 — Git & GitHub Workflow | 20 | 48 | 10 questions | Collaborate on a shared repository |
| Week 7 — Deployment, Docker & DevOps | 22 | 52 | 10 questions | Deploy, document and containerise |
| Week 8 — Capstone Project Guide | 22 | 50 | 10 questions | The full capstone brief and rubric |

Each follows the same instructional spine: cover page, course information, learning objectives,
prerequisites, contents, teaching chapters, terminology table, common mistakes, security and
professional considerations, a practical exercise, a quiz with an answer key and explanations, an
assignment with evaluation weighting, a summary, and further reading.

Quizzes mix multiple choice, true/false and short answer. Every answer carries a "why", because
the point is to find gaps rather than to produce a score.

---

## 4. Coverage after this work

| Week | Notes | Practical | Reference | Total resources |
|---|---|---|---|---|
| 1 | 2 | — | 1 | 5 |
| 2 | 1 | — | — | 2 |
| 3 | 1 | — | — | 2 |
| 4 | 2 | 1 | 1 | 6 |
| 5 | 1 | — | — | 1 |
| 6 | 1 | — | — | 1 |
| 7 | 1 | — | — | 2 |
| 8 | 1 | — | — | 2 |

Twenty-one catalogue entries across eight weeks. Every week now has at least one substantial
teaching document. No week is empty.

---

## 5. Recommended next content work

1. **Practical sheets for Weeks 5 and 6.** These are the two heaviest technical weeks and the only
   ones whose material is a reference manual rather than a taught guide.
2. **Starter repositories for Weeks 2, 3 and 8**, added as GitHub links rather than uploads.
3. **Slide decks**, generated once the first cohort's sessions settle into a shape worth capturing.
4. **Recordings**, uploaded per cohort into the `recording` category as sessions run.
