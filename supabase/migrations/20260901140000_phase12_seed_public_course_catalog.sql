-- Phase 12 seed: the 8 standalone course catalog entries defined in src/data/courses.ts that
-- were never migrated into public.courses (only the Masterclass course was, via phase9).
-- Idempotent: every insert uses on conflict do nothing against its natural unique key.

-- =========================================================================
-- 1) Basics of Computers, Phones & Internet 101 (free)
-- =========================================================================

insert into public.courses (
  title, slug, short_description, description, category, level, duration, price, currency, is_free,
  image_url, instructor, learning_outcomes, requirements, target_audience, faqs
) values (
  'Basics of Computers, Phones & Internet 101',
  'basics-of-computers-phones-internet-101',
  'Start your digital literacy journey with practical computer and smartphone basics.',
  'A beginner-friendly course for learners who want confidence using computers, smartphones, and the internet in daily life and work.',
  'Digital Literacy',
  'Beginner',
  '3 weeks',
  0,
  'KES',
  true,
  '/placeholder.svg',
  'Lucky Nakola',
  ARRAY[
    'Use a computer and smartphone confidently.',
    'Understand essential internet concepts and terminology.',
    'Perform common online tasks safely.',
    'Apply basic digital hygiene habits every day.'
  ],
  ARRAY[
    'No technical background required.',
    'A smartphone or computer with internet access.'
  ],
  ARRAY[
    'Complete beginners to digital tools.',
    'Students and job seekers building digital confidence.',
    'Small business owners moving operations online.'
  ],
  '[
    {"question": "Do I need prior IT knowledge?", "answer": "No. This course is designed for absolute beginners."},
    {"question": "Can I access this course on mobile?", "answer": "Yes. Lessons are mobile-friendly."}
  ]'::jsonb
)
on conflict (slug) do nothing;

insert into public.lessons (course_id, lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment)
select c.id, v.lesson_order, v.lesson_type::public.lms_lesson_type, v.title, v.content, v.video_url, v.resource_downloads, v.quiz, v.assignment
from public.courses c
join (values
  (1, 'video', 'Welcome to Digital Skills Foundations', 'Understand the learning path and how to use the LMS to complete this course successfully.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (2, 'text', 'Computer and Smartphone Essentials', 'Learn core device components, settings basics, and safe setup practices.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (3, 'text', 'Internet Basics and Everyday Use Cases', 'Explore browsers, search, email, and reliable information discovery.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (4, 'quiz', 'Digital Literacy Checkpoint', 'Answer short questions to validate your understanding of core concepts.', null::text, '[]'::jsonb,
    '{"title": "Digital Literacy Quiz", "instructions": "Complete all questions. Minimum pass score: 70%.", "totalQuestions": 10}'::jsonb, null::jsonb),
  (5, 'assignment', 'Practical Assignment: Your Daily Digital Routine', 'Document a safe digital routine you can apply daily at home, school, or work.', null::text,
    '[{"id": "resource-001", "title": "Digital Routine Template", "url": "#", "type": "doc"}]'::jsonb,
    null::jsonb,
    '{"title": "Digital Routine Checklist", "instructions": "Submit a checklist with at least 8 practical actions for safe and productive daily digital use.", "dueInDays": 5}'::jsonb)
) as v(lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment) on true
where c.slug = 'basics-of-computers-phones-internet-101'
on conflict (course_id, lesson_order) do nothing;

-- =========================================================================
-- 2) Safe Internet Browsing & Online Security (free)
-- =========================================================================

insert into public.courses (
  title, slug, short_description, description, category, level, duration, price, currency, is_free,
  image_url, instructor, learning_outcomes, requirements, target_audience, faqs
) values (
  'Safe Internet Browsing & Online Security',
  'safe-internet-browsing-online-security',
  'Build strong cyber safety habits and protect yourself from scams and online threats.',
  'A practical cybersecurity essentials course focused on safe browsing, privacy, phishing defense, and account security.',
  'Cybersecurity',
  'Beginner',
  '2 weeks',
  0,
  'KES',
  true,
  '/placeholder.svg',
  'Lucky Nakola',
  ARRAY[
    'Recognize phishing and common scam patterns.',
    'Set up stronger account security practices.',
    'Manage passwords and 2FA effectively.',
    'Browse the web more safely on public and private networks.'
  ],
  ARRAY['Basic internet usage knowledge.'],
  ARRAY[
    'Remote workers and students.',
    'Anyone concerned about online scams.',
    'Beginners in cybersecurity.'
  ],
  '[
    {"question": "Is this course technical?", "answer": "It is practical and beginner-friendly, not heavily technical."}
  ]'::jsonb
)
on conflict (slug) do nothing;

insert into public.lessons (course_id, lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment)
select c.id, v.lesson_order, v.lesson_type::public.lms_lesson_type, v.title, v.content, v.video_url, v.resource_downloads, v.quiz, v.assignment
from public.courses c
join (values
  (1, 'video', 'Cyber Threat Landscape for Everyday Users', 'Discover the most common attacks targeting regular internet users.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (2, 'text', 'Phishing, Social Engineering, and Scam Red Flags', 'Learn to spot suspicious links, fake support calls, and urgent payment traps.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (3, 'text', 'Passwords, 2FA, and Device Security Basics', 'Implement account protection and secure mobile/computer settings.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (4, 'assignment', 'Assignment: Secure Your Top 5 Accounts', 'Apply course guidance and submit a short checklist of improvements made.', null::text, '[]'::jsonb, null::jsonb,
    '{"title": "Account Security Upgrade", "instructions": "Enable or confirm 2FA, unique passwords, and recovery options on five key accounts.", "dueInDays": 4}'::jsonb)
) as v(lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment) on true
where c.slug = 'safe-internet-browsing-online-security'
on conflict (course_id, lesson_order) do nothing;

-- =========================================================================
-- 3) AI & Machine Learning: Getting Started (free)
-- =========================================================================

insert into public.courses (
  title, slug, short_description, description, category, level, duration, price, currency, is_free,
  image_url, instructor, learning_outcomes, requirements, target_audience, faqs
) values (
  'AI & Machine Learning: Getting Started',
  'ai-machine-learning-getting-started',
  'Understand AI and ML fundamentals with practical beginner examples.',
  'An introductory course that explains artificial intelligence and machine learning in simple terms with local and global use cases.',
  'AI & Machine Learning',
  'Beginner',
  '2 weeks',
  0,
  'KES',
  true,
  '/placeholder.svg',
  'Lucky Nakola',
  ARRAY[
    'Explain AI and ML core concepts clearly.',
    'Identify practical ML use cases.',
    'Understand the basic model lifecycle.',
    'Use beginner-friendly AI productivity tools responsibly.'
  ],
  ARRAY['Curiosity and willingness to learn.'],
  ARRAY[
    'Beginners exploring AI careers.',
    'Non-technical professionals interested in AI literacy.',
    'Students preparing for future digital roles.'
  ],
  '[
    {"question": "Do I need coding skills?", "answer": "No coding is required for this starter course."}
  ]'::jsonb
)
on conflict (slug) do nothing;

insert into public.lessons (course_id, lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment)
select c.id, v.lesson_order, v.lesson_type::public.lms_lesson_type, v.title, v.content, v.video_url, v.resource_downloads, v.quiz, v.assignment
from public.courses c
join (values
  (1, 'video', 'AI and ML Concepts Without Jargon', 'Understand what AI can and cannot do in real-world settings.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (2, 'text', 'How Machine Learning Models Learn', 'Learn about data, training, inference, and iteration.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (3, 'text', 'Responsible AI, Ethics, and Bias Awareness', 'Explore fairness, transparency, and safe AI adoption practices.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (4, 'quiz', 'AI Foundations Quiz', 'Validate your understanding of AI and ML terminology and use cases.', null::text, '[]'::jsonb,
    '{"title": "AI Intro Quiz", "instructions": "Answer all 8 questions to complete this lesson.", "totalQuestions": 8}'::jsonb, null::jsonb)
) as v(lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment) on true
where c.slug = 'ai-machine-learning-getting-started'
on conflict (course_id, lesson_order) do nothing;

-- =========================================================================
-- 4) Digital Marketing for Tech Startups (free)
-- =========================================================================

insert into public.courses (
  title, slug, short_description, description, category, level, duration, price, currency, is_free,
  image_url, instructor, learning_outcomes, requirements, target_audience, faqs
) values (
  'Digital Marketing for Tech Startups',
  'digital-marketing-for-tech-startups',
  'Learn practical growth strategies for startup visibility and customer acquisition.',
  'A practical course for founders and teams building audience, trust, and traction with digital marketing channels.',
  'Digital Skills',
  'Beginner',
  '2 weeks',
  0,
  'KES',
  true,
  '/placeholder.svg',
  'Lucky Nakola',
  ARRAY[
    'Build a focused startup marketing plan.',
    'Create clear messaging and brand positioning.',
    'Use social media and email for growth.',
    'Track marketing performance with key metrics.'
  ],
  ARRAY['Basic understanding of your startup idea or product.'],
  ARRAY[
    'Startup founders and co-founders.',
    'Marketing beginners in tech teams.',
    'Freelancers and creators building digital products.'
  ],
  '[
    {"question": "Will this cover paid ads?", "answer": "Yes, with a beginner-friendly budget approach."}
  ]'::jsonb
)
on conflict (slug) do nothing;

insert into public.lessons (course_id, lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment)
select c.id, v.lesson_order, v.lesson_type::public.lms_lesson_type, v.title, v.content, v.video_url, v.resource_downloads, v.quiz, v.assignment
from public.courses c
join (values
  (1, 'text', 'Positioning and Messaging for Tech Products', 'Define your niche and communicate value clearly.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (2, 'video', 'Social Media and Community-Led Growth', 'Use platform-specific content strategies to attract your ideal audience.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (3, 'text', 'Email Funnels and Conversion Basics', 'Design simple lead capture and follow-up workflows.', null::text, '[]'::jsonb, null::jsonb, null::jsonb),
  (4, 'assignment', 'Assignment: 14-Day Startup Growth Plan', 'Draft and submit your short growth plan for feedback.', null::text, '[]'::jsonb, null::jsonb,
    '{"title": "Two-Week Growth Plan", "instructions": "Submit objectives, channels, and success metrics for 14 days.", "dueInDays": 7}'::jsonb)
) as v(lesson_order, lesson_type, title, content, video_url, resource_downloads, quiz, assignment) on true
where c.slug = 'digital-marketing-for-tech-startups'
on conflict (course_id, lesson_order) do nothing;

-- =========================================================================
-- 5) Web Development Using HTML, CSS & JavaScript (paid, 300 KES)
-- =========================================================================

insert into public.courses (
  title, slug, short_description, description, category, level, duration, price, currency, is_free,
  image_url, instructor, learning_outcomes, requirements, target_audience, faqs
) values (
  'Web Development Using HTML, CSS & JavaScript',
  'web-development-html-css-javascript',
  'Build responsive websites from scratch with practical frontend projects.',
  'A paid foundational web development course designed to move learners from beginner to confident frontend builder.',
  'Web Development',
  'Intermediate',
  '4 weeks',
  300,
  'KES',
  false,
  '/placeholder.svg',
  'Lucky Nakola',
  ARRAY[
    'Structure semantic HTML documents.',
    'Style responsive interfaces with modern CSS.',
    'Add interactivity with JavaScript DOM patterns.',
    'Ship a mini portfolio-ready web project.'
  ],
  ARRAY[
    'Basic computer skills.',
    'Consistent practice time each week.'
  ],
  ARRAY[
    'Beginners transitioning to frontend development.',
    'Students building first job-ready web projects.'
  ],
  '[
    {"question": "Is this beginner-friendly?", "answer": "Yes, but learners should commit to regular practice."}
  ]'::jsonb
)
on conflict (slug) do nothing;

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

-- =========================================================================
-- 6) Advanced Software Engineering with JavaScript, XAMPP & MySQL (paid, 500 KES)
-- =========================================================================

insert into public.courses (
  title, slug, short_description, description, category, level, duration, price, currency, is_free,
  image_url, instructor, learning_outcomes, requirements, target_audience, faqs
) values (
  'Advanced Software Engineering with JavaScript, XAMPP & MySQL',
  'advanced-software-engineering-javascript-xampp-mysql',
  'Move beyond frontend by building full-stack systems with backend and database workflows.',
  'An advanced paid course for learners ready to build robust web applications using backend JavaScript and relational database fundamentals.',
  'Software Engineering',
  'Advanced',
  '6 weeks',
  500,
  'KES',
  false,
  '/placeholder.svg',
  'Lucky Nakola',
  ARRAY[
    'Design scalable backend architecture.',
    'Model and query relational data effectively.',
    'Build APIs and secure endpoints.',
    'Ship a full-stack capstone project.'
  ],
  ARRAY[
    'Basic JavaScript knowledge.',
    'Comfort with HTML/CSS fundamentals.'
  ],
  ARRAY[
    'Junior developers growing into full-stack roles.',
    'Learners preparing for software engineering interviews.'
  ],
  '[
    {"question": "Will we build a complete project?", "answer": "Yes. This course includes a guided capstone project."}
  ]'::jsonb
)
on conflict (slug) do nothing;

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

-- =========================================================================
-- 7) DevOps & Cloud Computing (paid, 800 KES)
-- =========================================================================

insert into public.courses (
  title, slug, short_description, description, category, level, duration, price, currency, is_free,
  image_url, instructor, learning_outcomes, requirements, target_audience, faqs
) values (
  'DevOps & Cloud Computing',
  'devops-cloud-computing',
  'Learn cloud and DevOps fundamentals for deployment, automation, and reliability.',
  'A paid practical course on CI/CD pipelines, cloud infrastructure basics, and deployment workflows used in modern teams.',
  'DevOps',
  'Advanced',
  '4 weeks',
  800,
  'KES',
  false,
  '/placeholder.svg',
  'Lucky Nakola',
  ARRAY[
    'Understand DevOps culture and workflow design.',
    'Set up simple CI/CD pipelines.',
    'Deploy applications to cloud infrastructure.',
    'Monitor and troubleshoot production services.'
  ],
  ARRAY[
    'Basic backend or scripting knowledge recommended.',
    'Familiarity with Git fundamentals.'
  ],
  ARRAY[
    'Developers transitioning into DevOps.',
    'Teams modernizing deployment practices.'
  ],
  '[
    {"question": "Is Linux knowledge required?", "answer": "Basic terminal familiarity is recommended."}
  ]'::jsonb
)
on conflict (slug) do nothing;

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

-- =========================================================================
-- 8) Git, GitHub & Developer Portfolio Masterclass (paid, 600 KES)
-- =========================================================================

insert into public.courses (
  title, slug, short_description, description, category, level, duration, price, currency, is_free,
  image_url, instructor, learning_outcomes, requirements, target_audience, faqs
) values (
  'Git, GitHub & Developer Portfolio Masterclass',
  'git-github-developer-portfolio-masterclass',
  'Master version control workflows and build a strong developer portfolio.',
  'A paid course focused on professional Git usage, GitHub collaboration, and portfolio strategy for career growth.',
  'Career Development',
  'Intermediate',
  '3 weeks',
  600,
  'KES',
  false,
  '/placeholder.svg',
  'Lucky Nakola',
  ARRAY[
    'Use Git confidently in solo and team environments.',
    'Collaborate via pull requests and code reviews on GitHub.',
    'Design a portfolio that communicates technical impact.',
    'Present projects effectively for hiring and client opportunities.'
  ],
  ARRAY[
    'Basic coding familiarity.',
    'A GitHub account.'
  ],
  ARRAY[
    'Learners applying for internships and junior roles.',
    'Freelancers and developers building personal brand credibility.'
  ],
  '[
    {"question": "Will this include portfolio review guidance?", "answer": "Yes. The course includes structure, examples, and review checklists."}
  ]'::jsonb
)
on conflict (slug) do nothing;

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
