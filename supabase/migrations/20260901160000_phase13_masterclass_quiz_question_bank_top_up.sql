-- Phase 13: top up masterclass quiz question banks for Weeks 2-7 to at least 10 questions each.
-- Before this migration: Week 2=6, Week 3=6, Week 4=7, Week 5=6, Week 6=6, Week 7=7 (from phase9).
-- Adds new, non-overlapping questions continuing each week's existing question_order sequence.
-- Idempotent: on conflict (quiz_id, question_order) do nothing.

insert into public.masterclass_quiz_questions (quiz_id, question_order, question_type, question_text, options, correct_answer, explanation, points)
select qz.id, v.question_order, v.question_type, v.question_text, v.options::jsonb, v.correct_answer, v.explanation, 1
from public.masterclass_quizzes qz
join public.masterclass_weeks w on w.id = qz.week_id
join public.masterclass_programs p on p.id = w.program_id and p.slug = 'web-development-masterclass'
join (values
  -- Week 2: CSS + Responsive Design (6 -> 10)
  (2, 7, 'mcq', 'Which CSS layout method is best suited for two-dimensional layouts involving both rows and columns at the same time?',
   '[{"id":"a","text":"Flexbox"},{"id":"b","text":"CSS Grid"},{"id":"c","text":"Float"},{"id":"d","text":"Inline layout"}]',
   'b', 'CSS Grid is designed for two-dimensional layout, letting you control rows and columns together, unlike the one-dimensional Flexbox.'),
  (2, 8, 'mcq', 'Which CSS unit scales relative to the root element font size, making it useful for consistent, scalable spacing?',
   '[{"id":"a","text":"px"},{"id":"b","text":"rem"},{"id":"c","text":"vh"},{"id":"d","text":"pt"}]',
   'b', 'rem is always relative to the root (html) element font size, so it scales predictably across a whole page.'),
  (2, 9, 'true_false', 'A media query written as @media (max-width: 768px) applies its styles only when the viewport width is 768px or narrower.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'true', 'max-width in a media query sets an upper bound, so the enclosed styles only apply at or below that width.'),
  (2, 10, 'mcq', 'What does the CSS property z-index control?',
   '[{"id":"a","text":"The color of text"},{"id":"b","text":"The stacking order of overlapping positioned elements"},{"id":"c","text":"The font size"},{"id":"d","text":"The number of columns in a grid"}]',
   'b', 'z-index determines which overlapping positioned elements appear in front of or behind others on the page.'),

  -- Week 3: Tailwind CSS + Modern Frontend (6 -> 10)
  (3, 7, 'mcq', 'Which Tailwind class turns an element into a flex container?',
   '[{"id":"a","text":"flex"},{"id":"b","text":"grid"},{"id":"c","text":"block"},{"id":"d","text":"flex-row-only"}]',
   'a', 'The flex utility sets display: flex on an element, making its direct children flex items.'),
  (3, 8, 'true_false', 'Tailwind dark mode variant classes, such as dark:bg-slate-900, apply their styles specifically when dark mode is active.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'true', 'The dark: prefix is a Tailwind variant that only applies its utility when dark mode is enabled.'),
  (3, 9, 'mcq', 'What is the purpose of Tailwind @apply directive inside a CSS file?',
   '[{"id":"a","text":"To disable Tailwind entirely"},{"id":"b","text":"To bundle several utility classes into one reusable custom class name"},{"id":"c","text":"To import Google Fonts"},{"id":"d","text":"To minify the final CSS output"}]',
   'b', '@apply lets you compose existing utility classes into a single named class, useful for repeated component styles.'),
  (3, 10, 'scenario', 'You want body text that is small on mobile but larger on desktop screens using Tailwind. Which class pattern is correct?',
   '[{"id":"a","text":"text-sm md:text-lg"},{"id":"b","text":"md:text-sm text-lg-only"},{"id":"c","text":"text-lg mobile:text-sm"},{"id":"d","text":"text-responsive"}]',
   'a', 'The base utility (text-sm) sets the mobile-first default, and the md: prefix overrides it at the medium breakpoint and up.'),

  -- Week 4: JavaScript + Git + GitHub (7 -> 10)
  (4, 8, 'mcq', 'What does the === operator check in JavaScript that == does not?',
   '[{"id":"a","text":"Nothing, they are identical"},{"id":"b","text":"Both value and type, without type coercion"},{"id":"c","text":"Only the variable name"},{"id":"d","text":"Whether the value is a function"}]',
   'b', '=== is strict equality: it compares value and type together, while == first coerces types before comparing.'),
  (4, 9, 'mcq', 'What is the purpose of a .gitignore file in a repository?',
   '[{"id":"a","text":"To list required npm packages"},{"id":"b","text":"To tell Git which files or folders to exclude from version control"},{"id":"c","text":"To store commit messages"},{"id":"d","text":"To configure GitHub Actions"}]',
   'b', '.gitignore tells Git which paths, like node_modules or .env, should never be tracked or committed.'),
  (4, 10, 'scenario', 'Two teammates edit the same line of the same file on different branches, and merging produces a conflict. What must happen before the merge can complete?',
   '[{"id":"a","text":"Git resolves it automatically with no input needed"},{"id":"b","text":"Someone manually reviews and resolves the conflicting lines, then commits the result"},{"id":"c","text":"The newer branch is always discarded automatically"},{"id":"d","text":"The repository must be deleted and recreated"}]',
   'b', 'A merge conflict on the same lines requires a human to decide the correct combined result before the merge can finish.'),

  -- Week 5: PHP + Backend Fundamentals (6 -> 10)
  (5, 7, 'mcq', 'Which PHP superglobal holds data sent via the URL query string or a GET-method form?',
   '[{"id":"a","text":"$_GET"},{"id":"b","text":"$_POST"},{"id":"c","text":"$_SESSION"},{"id":"d","text":"$_ENV"}]',
   'a', '$_GET holds parameters passed in the URL query string, including data from GET-method forms.'),
  (5, 8, 'true_false', 'In XAMPP, phpMyAdmin is a web-based tool used to manage MySQL databases through a browser interface.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'true', 'phpMyAdmin gives a graphical, browser-based way to view and manage MySQL databases bundled with XAMPP.'),
  (5, 9, 'mcq', 'What does a typical backend API endpoint return to a frontend application?',
   '[{"id":"a","text":"A compiled executable file"},{"id":"b","text":"Structured data, commonly formatted as JSON"},{"id":"c","text":"Only raw HTML page templates"},{"id":"d","text":"A copy of the database schema"}]',
   'b', 'Modern APIs typically return structured data, most commonly JSON, for the frontend to render or process.'),
  (5, 10, 'scenario', 'A PHP script takes a filename directly from user input and opens that file without any checks. What security risk does this create?',
   '[{"id":"a","text":"No risk, PHP handles this safely by default"},{"id":"b","text":"Path traversal, letting an attacker access files outside the intended directory"},{"id":"c","text":"It only affects page loading speed"},{"id":"d","text":"It automatically encrypts the file"}]',
   'b', 'Unvalidated file paths from user input can be manipulated to escape the intended directory and read unauthorized files.'),

  -- Week 6: MySQL + Databases + Full-Stack Integration (6 -> 10)
  (6, 7, 'mcq', 'Which SQL clause is used to sort query results?',
   '[{"id":"a","text":"SORT BY"},{"id":"b","text":"ORDER BY"},{"id":"c","text":"GROUP BY"},{"id":"d","text":"ARRANGE"}]',
   'b', 'ORDER BY sorts the rows returned by a query, ascending by default or descending with DESC.'),
  (6, 8, 'true_false', 'Normalizing a database reduces data redundancy by organizing data into related, well-structured tables.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'true', 'Normalization splits data into related tables to minimize duplicate data and keep it consistent.'),
  (6, 9, 'mcq', 'Which SQL statement is used to modify existing rows in a table?',
   '[{"id":"a","text":"UPDATE"},{"id":"b","text":"ALTER"},{"id":"c","text":"INSERT"},{"id":"d","text":"CREATE"}]',
   'a', 'UPDATE changes the values of existing rows, typically combined with a WHERE clause to target specific rows.'),
  (6, 10, 'scenario', 'You need to know how many students are enrolled in each course. Which SQL clause groups rows so COUNT() can be applied per course?',
   '[{"id":"a","text":"WHERE"},{"id":"b","text":"GROUP BY"},{"id":"c","text":"ORDER BY"},{"id":"d","text":"HAVING alone, with no GROUP BY"}]',
   'b', 'GROUP BY collects rows sharing a value, like course_id, so aggregate functions such as COUNT() can summarize each group.'),

  -- Week 7: SDLC + Deployment + DevOps + Docker (7 -> 10)
  (7, 8, 'mcq', 'What is the primary purpose of version control in a deployment pipeline?',
   '[{"id":"a","text":"To design the user interface"},{"id":"b","text":"To track and manage code changes over time, enabling collaboration and rollback"},{"id":"c","text":"To automatically write documentation"},{"id":"d","text":"To replace the need for testing"}]',
   'b', 'Version control tracks every change to the codebase, making collaboration, review, and rolling back bad changes possible.'),
  (7, 9, 'true_false', 'A staging environment is used to test an application under conditions similar to production before it goes live.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'true', 'Staging mirrors production as closely as possible so issues surface before real users are affected.'),
  (7, 10, 'mcq', 'What does the term rollback mean in a deployment context?',
   '[{"id":"a","text":"Rewriting the entire application from scratch"},{"id":"b","text":"Reverting to a previous, working version of the application after a failed deployment"},{"id":"c","text":"Deleting all production data"},{"id":"d","text":"Merging every branch into main at once"}]',
   'b', 'A rollback restores the last known-good deployed version when a new release causes problems in production.')
) as v(week_number, question_order, question_type, question_text, options, correct_answer, explanation) on v.week_number = w.week_number
on conflict (quiz_id, question_order) do nothing;
