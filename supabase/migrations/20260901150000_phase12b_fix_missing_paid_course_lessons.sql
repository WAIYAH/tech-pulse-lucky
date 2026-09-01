-- Phase 12b fix: the phase12 migration's course inserts succeeded for all 8 catalog courses,
-- but the lesson inserts silently produced 0 rows for the 4 paid courses (verified live via
-- direct REST query: course rows exist, matching lesson rows do not). Re-running the exact same
-- lesson inserts here, isolated per course, idempotent via on conflict do nothing.

insert into public.lessons (course_id, lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment)
select c.id, v.lesson_order, v.lesson_type::public.lms_lesson_type, v.title, v.content, v.video_url, v.resource_downloads, v.quiz, v.assignment
from public.courses c
join (values
  (1, 'video', 'HTML Fundamentals and Semantic Structure', 'Build clean and accessible page structure.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (2, 'text', 'CSS Layout, Flexbox, and Responsive Design', 'Use CSS to create modern mobile-first layouts.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (3, 'video', 'JavaScript Essentials and DOM Interaction', 'Add dynamic behavior and user interaction.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (4, 'assignment', 'Project Assignment: Landing Page Build', 'Create and submit a responsive landing page with semantic HTML and interactive features.', null::text, '[]'::jsonb, null::jsonb,
    '{"title": "Frontend Landing Page", "instructions": "Submit source files and a short video walkthrough.", "dueInDays": 10}'::jsonb),
  (5, 'quiz', 'Frontend Fundamentals Assessment', 'Demonstrate your understanding of HTML, CSS, and JavaScript basics.', null::text, '[]'::jsonb,
    '{"title": "Frontend Assessment", "instructions": "12 questions. Pass mark is 75%.", "totalQuestions": 12}'::jsonb, null::jsonb)
) as v(lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment) on true
where c.slug = 'web-development-html-css-javascript'
on conflict (course_id, lesson_order) do nothing;

insert into public.lessons (course_id, lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment)
select c.id, v.lesson_order, v.lesson_type::public.lms_lesson_type, v.title, v.content, v.video_url, v.resource_downloads, v.quiz, v.assignment
from public.courses c
join (values
  (1, 'text', 'Software Architecture and System Thinking', 'Plan maintainable systems and clear responsibilities.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (2, 'video', 'Backend JavaScript and API Foundations', 'Create RESTful APIs and structure backend modules.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (3, 'text', 'Database Design with MySQL', 'Design schemas, relationships, and query patterns.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (4, 'assignment', 'Capstone Assignment: Build a Full-Stack Module', 'Implement authentication, data model, and API endpoints for a feature module.', null::text, '[]'::jsonb, null::jsonb,
    '{"title": "Full-Stack Module Capstone", "instructions": "Submit repo link, ER diagram, and deployment notes.", "dueInDays": 12}'::jsonb),
  (5, 'quiz', 'Advanced Engineering Quiz', 'Assessment on architecture, API design, and SQL fundamentals.', null::text, '[]'::jsonb,
    '{"title": "Advanced Engineering Quiz", "instructions": "15 questions. Includes scenario-based problems.", "totalQuestions": 15}'::jsonb, null::jsonb)
) as v(lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment) on true
where c.slug = 'advanced-software-engineering-javascript-xampp-mysql'
on conflict (course_id, lesson_order) do nothing;

insert into public.lessons (course_id, lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment)
select c.id, v.lesson_order, v.lesson_type::public.lms_lesson_type, v.title, v.content, v.video_url, v.resource_downloads, v.quiz, v.assignment
from public.courses c
join (values
  (1, 'video', 'DevOps Mindset and Delivery Lifecycle', 'Understand collaboration, automation, and continuous improvement.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (2, 'text', 'Cloud Computing Essentials', 'Learn compute, storage, networking, and shared responsibility.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (3, 'video', 'CI/CD Pipeline Setup Basics', 'Automate testing and deployment for consistent release cycles.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (4, 'assignment', 'Assignment: Build a CI/CD Pipeline Blueprint', 'Create a practical pipeline plan for an application of your choice.', null::text, '[]'::jsonb, null::jsonb,
    '{"title": "CI/CD Blueprint", "instructions": "Submit pipeline stages, tools, and rollback strategy.", "dueInDays": 8}'::jsonb)
) as v(lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment) on true
where c.slug = 'devops-cloud-computing'
on conflict (course_id, lesson_order) do nothing;

insert into public.lessons (course_id, lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment)
select c.id, v.lesson_order, v.lesson_type::public.lms_lesson_type, v.title, v.content, v.video_url, v.resource_downloads, v.quiz, v.assignment
from public.courses c
join (values
  (1, 'text', 'Git Foundations and Workflow Patterns', 'Learn commits, branches, merges, and conflict handling.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (2, 'video', 'GitHub Collaboration in Real Projects', 'Work with pull requests, issue tracking, and review flow.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (3, 'text', 'Portfolio Strategy for Tech Careers', 'Craft project narratives and highlight measurable outcomes.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (4, 'assignment', 'Assignment: Publish Your Portfolio Roadmap', 'Create a structured portfolio improvement plan and publish it in your repository.', null::text,
    '[{"id": "resource-008", "title": "Portfolio Review Checklist", "url": "#", "type": "pdf"}]'::jsonb,
    null::jsonb,
    '{"title": "Portfolio Roadmap", "instructions": "Submit GitHub repo link and README with roadmap milestones.", "dueInDays": 7}'::jsonb),
  (5, 'quiz', 'Git and GitHub Mastery Quiz', 'Evaluate your understanding of practical version control scenarios.', null::text, '[]'::jsonb,
    '{"title": "GitHub Workflow Quiz", "instructions": "Complete all 10 questions to finish the module.", "totalQuestions": 10}'::jsonb, null::jsonb)
) as v(lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment) on true
where c.slug = 'git-github-developer-portfolio-masterclass'
on conflict (course_id, lesson_order) do nothing;
