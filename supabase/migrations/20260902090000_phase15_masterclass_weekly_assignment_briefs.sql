-- Phase 15: seed the weekly assignment briefs for Weeks 1-7 (masterclass_assignments table
-- was created empty in phase14). Week 8 is intentionally excluded: it is reserved for the
-- capstone final project, tracked separately via masterclass_final_projects.
--
-- The seven briefs form one evolving project: the site built in Week 1 is progressively
-- restyled, made interactive, and given a real backend in the following weeks.

insert into public.masterclass_assignments (week_id, title, brief, requirements, submission_instructions)
select w.id, v.title, v.brief, v.requirements, v.submission_instructions
from public.masterclass_weeks w
join public.masterclass_programs p on p.id = w.program_id and p.slug = 'web-development-masterclass'
join (values
  (
    1,
    'Week 1 Project: Build Your Personal or Business Website',
    'Plan and build a multi-section personal portfolio or small business website using only semantic HTML. This is the foundation you will keep improving in every following week, so treat it as a real project, not a throwaway exercise.',
    '- At least 3 distinct sections or pages (for example Home, About, Services or Portfolio, and Contact)
- Correct use of semantic elements: header, nav, main, section or article, and footer
- A contact form with labeled inputs for name, email, and message (no processing required yet)
- At least one list, one table, and multiple images with meaningful alt text
- Internal links connecting your sections or pages, plus at least one external link
- Clean, indented, valid HTML with no inline styling',
    'Push your code to a public GitHub repository and submit the repository link below.'
  ),
  (
    2,
    'Week 2 Project: Style It and Make It Responsive',
    'Take the website you built in Week 1 and turn it into a professionally styled, fully responsive site using vanilla CSS only, no frameworks yet.',
    '- A consistent color palette, typography, and spacing system applied through an external stylesheet
- Layout built with Flexbox and or CSS Grid, not tables or pure inline styling
- Mobile-first responsive design using media queries, tested at mobile, tablet, and desktop widths
- Hover and focus states plus at least one CSS transition
- A navigation menu that adapts sensibly on small screens',
    'Update the same GitHub repository from Week 1 and submit the repository link below.'
  ),
  (
    3,
    'Week 3 Project: Rebuild It With Tailwind CSS',
    'Rebuild your website using Tailwind CSS utility classes instead of hand-written CSS, applying component and design-system thinking as you go.',
    '- Fully converted to Tailwind utility classes, with no custom CSS files beyond the Tailwind config unless clearly justified
- Responsive using Tailwind breakpoint prefixes such as sm, md, and lg
- Repeated UI such as cards, buttons, and navigation items kept visually consistent as reusable patterns
- Interactive and hover states implemented with Tailwind state variants
- A short README note comparing this version to your Week 2 vanilla CSS version: what was faster, what was harder',
    'Update the same GitHub repository and submit the repository link below.'
  ),
  (
    4,
    'Week 4 Project: Add JavaScript Interactivity',
    'Add real interactivity to your site with vanilla JavaScript, and practice a proper Git and GitHub branching workflow while doing it.',
    '- Working client-side validation on your contact form: required fields and a valid email format, with visible error messages
- At least two interactive features driven by the DOM, for example a mobile navigation toggle, a tabs or accordion component, content rendered dynamically from a JavaScript array or object, or a small widget powered by fetch and a public API
- The work developed on a separate Git branch and merged through a pull request opened on GitHub
- A README explaining what the JavaScript features do and how to run the project locally',
    'Submit your GitHub repository link and the link to the pull request where you merged this work.'
  ),
  (
    5,
    'Week 5 Project: Handle Your Form With PHP',
    'Build a small PHP backend that receives and processes the contact form from your website, introducing real server-side logic for the first time.',
    '- A PHP script that handles the form submission over POST, validates the input on the server, and shows a clear success or error response
- At least one use of a session or a cookie, for example to prevent duplicate submissions or to show a thank-you state
- Server-side validation that is independent of the JavaScript validation from Week 4, so the form stays safe even with JavaScript disabled
- Tested locally with XAMPP or an equivalent Apache and PHP setup, with README instructions for running it',
    'Update your GitHub repository with the PHP code and submit the repository link below.'
  ),
  (
    6,
    'Week 6 Project: Store Data in MySQL',
    'Design a small MySQL database and connect it to your PHP backend so form submissions, or another dataset relevant to your site, are stored and retrievable.',
    '- A database schema with at least two related tables, using a primary key and a foreign key relationship
- PHP connects to MySQL using prepared statements only, never raw string-concatenated queries
- At least a full Create and Read flow implemented end to end, with Update and Delete as a bonus
- A short written explanation in the README of what SQL injection is and how your prepared statements prevent it',
    'Submit your GitHub repository link, including your SQL schema file or a schema diagram.'
  ),
  (
    7,
    'Week 7 Project: Deploy and Containerize',
    'Take your project live, then explore packaging it with Docker so you understand how applications move from a laptop to production.',
    '- Frontend deployed and reachable at a public URL, for example through Vercel, Netlify, or GitHub Pages
- A Dockerfile written for the project that builds successfully locally, even if you do not deploy the container itself
- Any environment variables kept out of the repository and documented in a .env.example file
- A short SDLC reflection in the README describing which phase, planning, design, development, testing, or deployment, took the most effort and why',
    'Submit your GitHub repository link and the live deployed URL.'
  )
) as v(week_number, title, brief, requirements, submission_instructions) on v.week_number = w.week_number
on conflict (week_id) do nothing;
