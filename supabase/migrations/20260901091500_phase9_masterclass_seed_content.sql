-- Phase 9 seed: Web Development Masterclass — 2026 Cohort
-- Reuses public.courses for money/access; adds program/cohort/weeks/lessons/terminology/quizzes/resources.
-- Idempotent: every insert uses on conflict do nothing against its natural unique key.

-- =========================================================================
-- Course row (drives payment/enrollment via the existing LMS machinery)
-- =========================================================================

insert into public.courses (
  title, slug, short_description, description, category, level, duration, price, currency, is_free,
  image_url, instructor, learning_outcomes, requirements, target_audience, faqs
) values (
  'Web Development Masterclass — 2026 Cohort',
  'web-development-masterclass',
  'An intensive 8-week, project-based web development program covering HTML, CSS, Tailwind, JavaScript, PHP, MySQL, Git and GitHub, deployment, and DevOps fundamentals.',
  'The Web Development Masterclass is an intensive 8-week, project-based program that takes learners from web fundamentals to a deployed, full-stack capstone project. Each week builds on the last, moving from HTML and CSS, through Tailwind CSS and JavaScript, into PHP, MySQL, Git and GitHub, and finally software development lifecycle, deployment, and DevOps basics with Docker. The goal is not to memorize syntax, but to understand how the web works, how software is designed, and how to take an idea from concept to deployed, explainable software.',
  'Masterclass Cohort',
  'Beginner',
  '8 weeks',
  2000,
  'KES',
  false,
  '/placeholder.svg',
  'Lucky Nakola',
  ARRAY[
    'Understand how the web, browsers, servers, and HTTP/HTTPS work together.',
    'Build responsive, accessible interfaces with HTML, CSS, and Tailwind CSS.',
    'Add interactivity with JavaScript and manage code professionally with Git and GitHub.',
    'Build server-side logic and store real data with PHP and MySQL.',
    'Understand the SDLC, deployment, DevOps, and basic Docker containerization.',
    'Design, build, test, document, and deploy a complete full-stack capstone project.'
  ],
  ARRAY[
    'A laptop or computer with internet access.',
    'No prior coding experience required, beginners are welcome.',
    'Consistent weekly practice time across the 8 weeks.'
  ],
  ARRAY[
    'Beginners and university/ICT students exploring software development.',
    'Aspiring developers who want a stronger practical foundation.',
    'Students building academic or portfolio projects.',
    'Entrepreneurs who want to understand how web development actually works.'
  ],
  '[
    {"question": "Do I need any coding experience to join?", "answer": "No. The masterclass is designed for beginners and builds up week by week, though it is intensive and requires consistent practice."},
    {"question": "What will I actually build?", "answer": "A personal or business website in Week 1, progressively enhanced through the course, plus a full-stack capstone project of your choice in Week 8."},
    {"question": "How much does the program cost?", "answer": "KES 2,000 for the complete 8-week program, payable via KCB Paybill."},
    {"question": "Will I get a certificate?", "answer": "Certificate eligibility is based on completing required lessons, quizzes, practicals, and the final capstone project. Certificates are issued by the admin team after review."},
    {"question": "Can I join a future cohort if I miss this one?", "answer": "Yes. The curriculum is designed to be reused for future cohorts in 2027, 2028, and beyond."}
  ]'::jsonb
)
on conflict (slug) do nothing;

-- =========================================================================
-- Program, cohort
-- =========================================================================

insert into public.masterclass_programs (slug, title, tagline, summary, philosophy, technologies, total_weeks)
values (
  'web-development-masterclass',
  'Web Development Masterclass',
  'Build Real Websites. Understand Real Software.',
  'An 8-week intensive, practical, project-based software development masterclass covering the full journey from web fundamentals to a deployed full-stack capstone project.',
  'CONCEPT -> UNDERSTAND -> PRACTICE -> BUILD -> TEST -> DEPLOY -> EXPLAIN. Every module answers what this is, why it exists, how it works, where it is used, and how it connects to what came before.',
  ARRAY['HTML', 'CSS', 'Tailwind CSS', 'JavaScript', 'PHP', 'MySQL', 'Git', 'GitHub', 'Vercel', 'Docker', 'SDLC'],
  8
)
on conflict (slug) do nothing;

insert into public.masterclass_cohorts (program_id, course_id, cohort_label, start_date, end_date, status, max_seats)
select p.id, c.id, '2026 Cohort', date '2026-09-07', date '2026-11-01', 'upcoming', null
from public.masterclass_programs p, public.courses c
where p.slug = 'web-development-masterclass' and c.slug = 'web-development-masterclass'
on conflict (course_id) do nothing;

-- =========================================================================
-- Weeks (all 8, shared curriculum reused by every future cohort of this program)
-- =========================================================================

insert into public.masterclass_weeks (program_id, week_number, title, theme, learning_objectives, topics, estimated_study_time)
select p.id, v.week_number, v.title, v.theme, v.learning_objectives, v.topics, v.estimated_study_time
from public.masterclass_programs p, (values
  (
    1, 'Web Fundamentals + HTML', 'Understanding the Web and Building Website Structure',
    ARRAY[
      'Explain how the internet, browsers, servers, and HTTP/HTTPS work together.',
      'Describe the difference between frontend and backend, and client and server.',
      'Structure a web page using semantic HTML elements.',
      'Build forms, links, images, lists, and tables with correct markup.',
      'Build and publish a multi-section personal or business website.'
    ],
    ARRAY[
      'What is software', 'What is web development', 'What is a website', 'What is a web application',
      'Frontend vs backend', 'Client vs server', 'Internet vs World Wide Web', 'How websites work',
      'HTTP and HTTPS', 'HTTP methods', 'Request and response', 'URLs', 'Domains', 'DNS', 'Web hosting',
      'Browsers', 'Servers', 'IP addresses', 'HTML document structure', 'Elements, tags, attributes',
      'Semantic HTML', 'Headings, paragraphs, links, images', 'Lists and tables', 'Forms, inputs, buttons',
      'Header, navigation, hero section, footer', 'Single-page vs multi-page websites', 'Static vs functional websites'
    ],
    '6-8 hours'
  ),
  (
    2, 'CSS + Responsive Design', 'Turning HTML into Professional Interfaces',
    ARRAY[
      'Apply CSS selectors, the cascade, and specificity correctly.',
      'Use the box model, margin, padding, and positioning to build layouts.',
      'Build layouts with Flexbox and CSS Grid.',
      'Design mobile-first, responsive pages using media queries.',
      'Transform the Week 1 website into a professional responsive site.'
    ],
    ARRAY[
      'What is CSS', 'CSS syntax', 'Selectors, properties, values', 'Inline, internal, external CSS',
      'Classes and IDs', 'Specificity, cascade, inheritance', 'Colors, typography, fonts, backgrounds, borders',
      'Margin, padding, box model', 'Display and positioning', 'Flexbox', 'CSS Grid', 'Responsive design',
      'Media queries', 'Mobile-first design', 'Cards and navigation layouts', 'Hover states and transitions',
      'Accessibility and design principles'
    ],
    '6-8 hours'
  ),
  (
    3, 'Tailwind CSS + Modern Frontend Development', 'Building Modern Interfaces Faster',
    ARRAY[
      'Explain why CSS frameworks exist and compare traditional CSS, Bootstrap, and Tailwind CSS.',
      'Use Tailwind utility classes for spacing, color, typography, flex, and grid.',
      'Apply Tailwind responsive breakpoints and interactive states.',
      'Think in reusable components and consistent design systems.',
      'Rebuild an existing website using Tailwind CSS.'
    ],
    ARRAY[
      'What CSS frameworks are and why they exist', 'Bootstrap overview', 'Tailwind CSS overview',
      'Utility-first CSS', 'Tailwind spacing, colors, typography utilities', 'Flexbox and grid utilities',
      'Responsive classes and breakpoints', 'Hover and focus states', 'Cards, buttons, navigation, forms',
      'Component thinking and reusable UI', 'Design systems and consistent spacing', 'Modern UI principles'
    ],
    '6-8 hours'
  ),
  (
    4, 'JavaScript + Git + GitHub', 'Making Websites Interactive and Professional Development Workflow',
    ARRAY[
      'Use JavaScript variables, functions, arrays, objects, and loops.',
      'Manipulate the DOM and respond to events, including form validation.',
      'Fetch and work with JSON data.',
      'Use Git for local version control: init, add, commit, branch, merge.',
      'Collaborate on GitHub using remotes, push, pull, and pull requests.'
    ],
    ARRAY[
      'What is JavaScript', 'Variables and data types', 'Operators and conditions', 'Functions',
      'Arrays and objects', 'Loops', 'DOM and events', 'Event listeners', 'Form validation', 'Dynamic content',
      'Local storage', 'Basic debugging and console', 'Fetch API and JSON', 'What is version control',
      'Git repository, staging area, commit', 'Branch and merge', 'Clone, pull, push, remote', 'GitHub',
      'Pull requests', 'README and .gitignore', 'Collaboration and branch workflow'
    ],
    '8-10 hours'
  ),
  (
    5, 'PHP + Backend Fundamentals', 'Moving From Static Websites to Functional Applications',
    ARRAY[
      'Explain what backend/server-side development is and how PHP fits in.',
      'Write PHP variables, conditions, loops, functions, and arrays.',
      'Handle GET and POST form data, sessions, and cookies.',
      'Trace a request from browser through Apache, PHP, and the database, and back.',
      'Distinguish frontend validation from backend validation.'
    ],
    ARRAY[
      'What is backend development', 'PHP syntax', 'Variables, data types, conditions, loops, functions, arrays',
      'Forms, GET and POST', 'Sessions and cookies', 'Authentication and authorization', 'Validation',
      'Error handling', 'XAMPP, Apache, phpMyAdmin', 'Environment configuration',
      'Request flow: browser to Apache to PHP to database and back'
    ],
    '8-10 hours'
  ),
  (
    6, 'MySQL + Databases + Full-Stack Integration', 'Making Applications Store and Manage Real Data',
    ARRAY[
      'Explain what a database and DBMS are.',
      'Design tables with primary keys, foreign keys, and relationships.',
      'Write CRUD SQL: SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY, JOIN.',
      'Connect PHP to MySQL safely using prepared statements.',
      'Explain SQL injection and how prepared statements prevent it.'
    ],
    ARRAY[
      'What is a database, DBMS, MySQL', 'Tables, rows, columns', 'Primary keys and foreign keys',
      'Relationships', 'CRUD', 'SQL: SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY, JOIN',
      'Database normalization basics', 'phpMyAdmin', 'Connecting PHP to MySQL', 'Prepared statements',
      'SQL injection', 'Authentication database design'
    ],
    '8-10 hours'
  ),
  (
    7, 'SDLC + Deployment + DevOps + Docker', 'From Local Development to Production',
    ARRAY[
      'Describe the SDLC phases and Agile, Scrum, and Kanban basics.',
      'Explain deployment concepts: environments, environment variables, hosting, DNS, SSL.',
      'Explain what DevOps and CI/CD mean at a beginner level.',
      'Explain Docker containers, images, and Dockerfiles without advanced complexity.',
      'Deploy a frontend project and inspect a basic containerized application.'
    ],
    ARRAY[
      'SDLC: planning, requirements, analysis, design, development, testing, deployment, maintenance',
      'Agile, Scrum, Kanban, user stories, wireframes', 'What deployment means',
      'Production vs development environment', 'Environment variables', 'Hosting, domains, DNS, SSL, HTTPS',
      'Vercel and GitHub deployment', 'Build process and CI/CD basics', 'What DevOps means', 'Automation',
      'Docker, containers, images, Dockerfile', 'Ports and volumes', 'Docker Compose introduction'
    ],
    '6-8 hours'
  ),
  (
    8, 'Full-Scale Capstone Project', 'BUILD. TEST. DOCUMENT. DEPLOY. PRESENT.',
    ARRAY[
      'Scope a capstone project with a clear problem statement, target users, and requirements.',
      'Design a system architecture and database for the chosen project.',
      'Build the project using the full stack covered in Weeks 1-7.',
      'Test, document, and deploy the finished application.',
      'Present and explain the project, including the reasoning behind key decisions.'
    ],
    ARRAY[
      'Problem statement', 'Target users', 'Requirements', 'System design', 'Database design', 'UI design',
      'Development', 'Testing', 'GitHub repository and README', 'Documentation', 'Deployment', 'Presentation',
      'Functionality, UI/UX, code quality, database, security awareness', 'Git/GitHub practice',
      'Explaining your own code'
    ],
    '10-12 hours'
  )
) as v(week_number, title, theme, learning_objectives, topics, estimated_study_time)
where p.slug = 'web-development-masterclass'
on conflict (program_id, week_number) do nothing;

-- =========================================================================
-- Lessons — Week 1 (full reference implementation: intro, 3 concepts, practical)
-- =========================================================================

insert into public.masterclass_lessons (week_id, title, lesson_order, lesson_type, content, video_url)
select w.id, v.title, v.lesson_order, v.lesson_type, v.content, v.video_url
from public.masterclass_weeks w
join public.masterclass_programs p on p.id = w.program_id and p.slug = 'web-development-masterclass' and w.week_number = 1
join (values
  (
    1, 'intro', 'Welcome to Web Development',
    'This masterclass runs on one philosophy: concept, understand, practice, build, test, deploy, explain. Before writing a single line of code, you need a mental model of what software and web development actually are, and why frontend and backend exist as separate concerns. By the end of this week you will have published your own multi-section website and understand exactly what happens between typing a URL and seeing a rendered page.',
    null
  ),
  (
    2, 'concept', 'How the Internet and the Web Work',
    'The Internet is the global network of connected computers; the World Wide Web is the system of linked documents (web pages) that runs on top of it. When you visit a site, your browser (the client) sends an HTTP or HTTPS request to a server, which sends back a response containing HTML. DNS translates the human-readable domain name into the server IP address that actually receives the request. Web hosting is simply a service that keeps a server running and reachable so that response can always be sent.',
    null
  ),
  (
    3, 'concept', 'HTML Document Structure and Semantic Elements',
    'Every HTML document starts with a DOCTYPE declaration, followed by html, head, and body. The head holds metadata (title, description, viewport) that is never shown directly on the page; the body holds everything a visitor actually sees. Elements are built from tags and can carry attributes that configure them, such as src on an image or href on a link. Semantic HTML means choosing tags for what content means, not just how it looks: header, nav, main, section, article, and footer describe structure that both browsers and assistive technology can understand.',
    null
  ),
  (
    4, 'concept', 'Building Content: Text, Links, Images, Lists, Tables, and Forms',
    'Headings (h1 through h6) establish hierarchy; paragraphs hold body text. Links use the anchor element with an href attribute to point anywhere, including other pages, sections on the same page, or external sites. Images use src plus alt text so the image still makes sense to screen readers or when it fails to load. Lists group related items, tables present tabular data in rows and columns, and forms collect input through elements like input and button, ready to be submitted with a GET or POST request.',
    null
  ),
  (
    5, 'practical', 'Practical Build: Your Multi-Section Website',
    'Build a multi-section personal or business website using plain HTML only, no CSS framework yet. Include a header with navigation, a hero section with a clear headline and call to action, at least two content sections using semantic elements, a contact form with labeled inputs, and a footer with links. Decide deliberately whether this should be a single-page site (sections linked by in-page anchors) or a multi-page site (separate linked HTML files), and be ready to explain why you chose that structure.',
    null
  )
) as v(lesson_order, lesson_type, title, content, video_url) on true
on conflict (week_id, lesson_order) do nothing;

-- =========================================================================
-- Lessons — Weeks 2-8 (intro/concept + concept + practical, three per week)
-- =========================================================================

insert into public.masterclass_lessons (week_id, title, lesson_order, lesson_type, content, video_url)
select w.id, v.title, v.lesson_order, v.lesson_type, v.content, v.video_url
from public.masterclass_weeks w
join public.masterclass_programs p on p.id = w.program_id and p.slug = 'web-development-masterclass'
join (values
  (2, 1, 'intro', 'CSS Fundamentals: Selectors, the Box Model, and Cascade',
   'CSS attaches style to HTML through selectors, which can target elements by tag, class, or ID. When two rules conflict, the cascade and specificity rules decide which one wins, and many properties like color and font also inherit down from parent to child automatically. Every element is a box made of content, padding, border, and margin; understanding this box model is the single most useful mental model for debugging layout issues.', null),
  (2, 2, 'concept', 'Responsive Layouts with Flexbox, Grid, and Media Queries',
   'Flexbox arranges items along a single row or column with flexible alignment and spacing, making it ideal for navigation bars and card rows. CSS Grid arranges items in two dimensions at once, making it ideal for full page or section layouts. Media queries apply styles only when a condition, usually screen width, is met, which is how mobile-first design works: write base styles for small screens first, then layer on rules for larger breakpoints.', null),
  (2, 3, 'practical', 'Practical: Style and Make Your Week 1 Website Responsive',
   'Take the plain HTML site from Week 1 and give it real visual design: consistent colors, typography, spacing, and a card-based layout using Flexbox or Grid. Add hover states and transitions to interactive elements, then add media queries so the layout adapts cleanly from a small phone screen up to a desktop, with no horizontal scrolling at any width.', null),

  (3, 1, 'intro', 'Why Utility-First CSS Frameworks Exist',
   'Writing custom CSS for every component does not scale well on a growing team or a fast-moving project, which is why CSS frameworks exist. Bootstrap ships pre-built, pre-styled components; Tailwind CSS instead ships small, single-purpose utility classes that you compose directly in your markup. Utility-first CSS trades some markup verbosity for speed, consistency, and never having to invent a new class name for every element.', null),
  (3, 2, 'concept', 'Tailwind Core Utilities: Spacing, Typography, Flex, and Grid',
   'Tailwind utilities map closely to CSS properties: p-4 is padding, flex and grid enable those layout modes, and text-lg or font-semibold control typography. Responsive prefixes like sm:, md:, and lg: apply a utility only from that breakpoint upward, and state modifiers like hover: and focus: apply a utility only in that interaction state, all without leaving your HTML.', null),
  (3, 3, 'practical', 'Practical: Rebuild Your Website with Tailwind CSS',
   'Rebuild the Week 2 website using Tailwind CSS utility classes instead of custom CSS. Recreate the same visual design using Tailwind spacing, color, and typography utilities, apply responsive prefixes for mobile-first breakpoints, and add hover and focus states to buttons, links, and form fields.', null),

  (4, 1, 'intro', 'JavaScript Fundamentals: Variables, Functions, and the DOM',
   'JavaScript adds behavior to a page: variables store values, functions bundle reusable logic, and arrays and objects structure data. The DOM represents your HTML as a tree of objects that JavaScript can read and modify directly, which is how a script can change text, add elements, or respond to what a user does.', null),
  (4, 2, 'concept', 'Events, Forms, and Fetching Data with JSON',
   'Event listeners let code react to what happens in the browser, such as a click or a form submission, including validating form fields before allowing a submit. The Fetch API lets JavaScript request data from a server without reloading the page, and that data is almost always exchanged as JSON, a lightweight text format for structured data that both JavaScript objects and server APIs understand natively.', null),
  (4, 3, 'practical', 'Practical: Version Control Your Interactive Website with Git and GitHub',
   'Add interactivity to your Tailwind site with JavaScript: a mobile nav toggle, form validation, and at least one feature that updates the DOM dynamically. Then initialize a Git repository, make meaningful commits as you build, create a feature branch for one change, merge it back, and push the finished project to a GitHub repository with a clear README.', null),

  (5, 1, 'intro', 'What Backend Development Is and How PHP Fits In',
   'Everything so far has run entirely in the browser. Backend development is the server-side half of an application: code that runs on a server, not the client, to process requests, apply business rules, and talk to a database. PHP is a server-side scripting language built for exactly this, and tools like XAMPP bundle Apache, PHP, and MySQL so you can run this entire stack on your own computer.', null),
  (5, 2, 'concept', 'PHP Fundamentals: Variables, Control Flow, and Handling Form Data',
   'PHP variables, conditions, loops, functions, and arrays work much like their JavaScript counterparts, but PHP executes on the server before the response ever reaches the browser. Form data submitted via GET or POST arrives in PHP superglobals, sessions and cookies let the server remember a user across multiple requests, and every value coming from a user must be validated on the server, since frontend validation alone can always be bypassed.', null),
  (5, 3, 'practical', 'Practical: Build a PHP Registration and Login Prototype',
   'Build a small PHP prototype with a registration form and a login form. Handle the submitted POST data on the server, validate it there even if you also validate it in JavaScript, store a logged-in state using sessions, and be ready to explain, precisely, why backend validation is required even when frontend validation already exists.', null),

  (6, 1, 'intro', 'What Databases Are and Why Applications Need Them',
   'A database is a structured place to store data that a program can query, update, and rely on staying consistent, which is what a DBMS like MySQL manages for you. Data lives in tables made of rows and columns, and a primary key uniquely identifies each row so other tables can reference it through a foreign key, which is how relationships between data are built.', null),
  (6, 2, 'concept', 'SQL Fundamentals: CRUD, Relationships, and Joins',
   'SQL is the language used to create, read, update, and delete data: SELECT retrieves rows, INSERT adds them, UPDATE changes them, and DELETE removes them, with WHERE filtering which rows are affected and ORDER BY controlling result order. JOIN combines rows from two related tables in a single query, which is essential once data like students and their enrollments live in separate, properly normalized tables.', null),
  (6, 3, 'practical', 'Practical: Connect PHP to MySQL and Build a CRUD App',
   'Design a small MySQL schema with at least two related tables, then connect your Week 5 PHP prototype to that database. Implement full CRUD for one entity using prepared statements only, never string-concatenated queries, and be ready to explain what SQL injection is and exactly how prepared statements prevent it.', null),

  (7, 1, 'intro', 'The Software Development Lifecycle and Agile Basics', 'The SDLC describes the phases a software project moves through: planning, requirements, analysis, design, development, testing, deployment, and maintenance. Agile approaches this iteratively with small releases and continuous feedback rather than one long upfront plan, and frameworks like Scrum and Kanban give that iteration a concrete structure using sprints, boards, and user stories.', null),
  (7, 2, 'concept', 'Deployment, DevOps, and CI/CD Fundamentals',
   'Deployment means making an application accessible outside your own machine, which involves hosting, a domain, DNS, and HTTPS via SSL, plus environment variables to configure secrets and settings differently in development versus production. DevOps is the culture of unifying development and operations through automation, and CI/CD pipelines are the concrete practice of automatically testing and shipping code changes on every push.', null),
  (7, 3, 'practical', 'Practical: Deploy a Frontend Project and Explore a Basic Docker Container',
   'Deploy your Week 3 or Week 4 frontend project live using a platform like Vercel connected to your GitHub repository, and confirm environment variables are configured correctly for production. Then, at a beginner level only, write a simple Dockerfile for a small app, build an image from it, and run it as a container, explaining what problem containerization actually solves.', null),

  (8, 1, 'intro', 'Capstone Kickoff: Choosing and Scoping Your Project',
   'Choose one approved capstone project type, such as a Student Management System, Inventory Management System, or Event Management System, and write a clear problem statement describing exactly who it is for and what problem it solves. A good problem statement is specific enough that a stranger could read it and understand what you are building and why, before you write a single line of code.', null),
  (8, 2, 'concept', 'From Design to Deployment: Planning Your Capstone',
   'Before development, plan the system design (how frontend, backend, and database pieces will interact), the database design (tables, relationships, and constraints), and a rough UI design or wireframe for the key screens. This planning step is what separates a project that gets built cleanly from one that gets rebuilt three times.', null),
  (8, 3, 'practical', 'Practical: Build, Test, Document, and Deploy Your Capstone Project',
   'Implement your capstone using the full stack from Weeks 1-7: HTML, CSS or Tailwind, JavaScript, PHP, MySQL, authentication, and CRUD, committing to Git and GitHub throughout. Test the finished application, write a clear README documenting setup and features, deploy it so others can access it, and prepare to present and explain every major decision you made.', null)
) as v(week_number, lesson_order, lesson_type, title, content, video_url) on v.week_number = w.week_number
on conflict (week_id, lesson_order) do nothing;

-- =========================================================================
-- Terminology — Week 1 (56 terms, full reference glossary)
-- =========================================================================

insert into public.masterclass_terminology (week_id, term, definition, simple_explanation, example, related_concept, term_order)
select w.id, v.term, v.definition, v.simple_explanation, v.example, v.related_concept, v.term_order
from public.masterclass_weeks w
join public.masterclass_programs p on p.id = w.program_id and p.slug = 'web-development-masterclass' and w.week_number = 1
join (values
  (1, 'Software', 'A set of instructions and data that tell a computer how to perform tasks.', 'Programs that run on hardware to make it useful.', 'A web browser, an operating system, or a mobile app are all software.', 'Hardware'),
  (2, 'Web development', 'The work of building and maintaining websites and web applications.', 'Coding the sites and apps you use in a browser.', 'Building an online store product catalog and checkout flow.', 'Frontend, Backend'),
  (3, 'Website', 'A collection of related web pages, usually under one domain, that share navigation and design.', 'A group of connected pages you visit through a browser.', 'wikipedia.org is a website with millions of pages.', 'Web page, Domain'),
  (4, 'Web application', 'A software program that runs in a browser and lets users interact with data, not just read content.', 'A website that behaves like an app, letting you do things, not only read.', 'Gmail, where you can compose, send, and search email.', 'Website, Frontend, Backend'),
  (5, 'Frontend', 'The part of an application that runs in the browser and controls what a user sees and interacts with.', 'Everything the user sees and clicks.', 'The layout, colors, and buttons of a page.', 'Backend, Client'),
  (6, 'Backend', 'The server-side part of an application that handles logic, data storage, and business rules.', 'The behind-the-scenes engine that the frontend talks to.', 'Code that checks a password and looks up a user in a database.', 'Frontend, Server, Database'),
  (7, 'Client', 'The device or program, usually a browser, that requests and displays information from a server.', 'The one asking for the webpage.', 'A phone browser is the client when it loads a site.', 'Server, Request'),
  (8, 'Server', 'A computer or program that stores, processes, and sends data to clients on request.', 'The one answering the browser request.', 'A server that stores a blog articles and sends them when requested.', 'Client, Hosting'),
  (9, 'Internet', 'A global network of interconnected computers that communicate using standardized protocols.', 'The physical and network layer connecting computers worldwide.', 'The cables, routers, and connections that let two computers talk.', 'World Wide Web'),
  (10, 'World Wide Web', 'A system of linked documents, web pages, accessed over the internet using browsers and HTTP.', 'The websites and pages you browse, one of many things that run on the internet.', 'Visiting techpulseinsider.com uses the Web, which runs on the Internet.', 'Internet, HTTP'),
  (11, 'HTTP', 'HyperText Transfer Protocol, the rules browsers and servers use to request and send web content.', 'The language browsers and servers speak to exchange pages.', 'A browser sends an HTTP request for a page HTML.', 'HTTPS, Request, Response'),
  (12, 'HTTPS', 'HTTP Secure, HTTP encrypted with SSL/TLS so data cannot be read or altered in transit.', 'HTTP with a lock icon, meaning the data is encrypted.', 'Banking sites always use HTTPS to protect login details.', 'HTTP, SSL'),
  (13, 'HTTP methods', 'Verbs that describe the action a request wants to perform, such as GET, POST, PUT, or DELETE.', 'The type of request being made.', 'GET fetches a page; POST submits a form.', 'Request, REST'),
  (14, 'Request', 'A message a client sends to a server asking for data or an action.', 'What the browser sends when a link is clicked.', 'Clicking a link sends a GET request for that page.', 'Response, HTTP'),
  (15, 'Response', 'The message a server sends back to a client after processing a request.', 'What the server sends back, the page, data, or an error.', 'A 200 OK response containing a page HTML.', 'Request, Status code'),
  (16, 'URL', 'Uniform Resource Locator, the address used to locate a specific resource on the web.', 'The web address typed or clicked.', 'https://techpulseinsider.com/courses', 'Domain, Path'),
  (17, 'Domain', 'The human-readable address that identifies a website, mapped to a server IP address.', 'The name part of a URL, like techpulseinsider.com.', 'google.com is a domain.', 'DNS, URL'),
  (18, 'DNS', 'Domain Name System, the service that translates domain names into IP addresses.', 'The internet phonebook, turning names into numbers computers use.', 'DNS turns techpulseinsider.com into an IP address such as 104.21.x.x.', 'Domain, IP address'),
  (19, 'Web hosting', 'A service that stores a website files and makes them accessible on the internet.', 'Renting space on a server so a site is online.', 'Vercel hosts static and frontend sites, including on free tiers.', 'Server, Deployment'),
  (20, 'Browser', 'Software that requests, renders, and displays web pages for users.', 'The app used to visit websites, such as Chrome, Safari, or Firefox.', 'Typing a URL into Chrome and pressing Enter.', 'Client, Rendering'),
  (21, 'IP address', 'A unique numeric label assigned to each device on a network, used to route data.', 'A device postal address on a network.', '192.168.1.1 is a common local IP address.', 'DNS, Server'),
  (22, 'HTML', 'HyperText Markup Language, the standard language used to structure content on the web.', 'The skeleton of a webpage.', '<h1>Hello</h1> creates a heading.', 'CSS, JavaScript'),
  (23, 'Element', 'A complete HTML building block, usually made of an opening tag, content, and a closing tag.', 'One piece of a page structure.', '<p>Text</p> is a paragraph element.', 'Tag, Attribute'),
  (24, 'Tag', 'The markup, wrapped in angle brackets, that defines the start or end of an HTML element.', 'The label that names an element.', '<div> and </div> are opening and closing tags.', 'Element'),
  (25, 'Attribute', 'Extra information added inside an opening tag to configure an element behavior or appearance.', 'Settings attached to a tag.', 'In <img src="logo.png">, src is an attribute.', 'Element, Tag'),
  (26, 'Semantic HTML', 'Using HTML elements according to their meaning, such as nav or article, rather than only their appearance.', 'Tags that describe what content is, not just how it looks.', '<footer> instead of a generic <div> for the page footer.', 'Accessibility, SEO'),
  (27, 'Heading', 'Elements from h1 to h6 that define titles and section importance in a document.', 'Titles and subtitles, from biggest, h1, to smallest, h6.', '<h1>Welcome</h1> is the page main heading.', 'Semantic HTML'),
  (28, 'Paragraph', 'A block of text content, marked up with the p element.', 'A chunk of body text.', '<p>This course runs for 8 weeks.</p>', 'Element'),
  (29, 'Link (anchor)', 'An a element that creates a hyperlink to another page, resource, or location.', 'Clickable text that takes you somewhere else.', '<a href="/courses">View Courses</a>', 'URL, Navigation'),
  (30, 'Image', 'An img element that embeds a picture into a page using a source URL.', 'How pictures get onto a webpage.', '<img src="hero.jpg" alt="Team photo">', 'Alt text'),
  (31, 'List', 'A structured group of items, either ordered (ol) or unordered (ul), made of li items.', 'Bullet points or numbered steps.', '<ul><li>HTML</li><li>CSS</li></ul>', 'Element'),
  (32, 'Table', 'A grid of rows and columns used to display tabular data using table, tr, and td.', 'Rows and columns of data, like a spreadsheet.', 'A pricing table comparing course plans.', 'Element'),
  (33, 'Form', 'A form element that collects user input and submits it to a server.', 'Fields users fill in and send, like sign-up forms.', 'A contact form with name, email, and message fields.', 'Input, HTTP methods'),
  (34, 'Input', 'An input element that lets users enter data such as text, numbers, or file selections.', 'A single fillable field in a form.', '<input type="email" name="email">', 'Form'),
  (35, 'Button', 'An element that triggers an action, such as submitting a form or running a script.', 'Something clickable that does something.', '<button type="submit">Enroll Now</button>', 'Form, Event'),
  (36, 'Header (page section)', 'A section, usually the header element, holding introductory content like a logo and navigation.', 'The top part of a page, often with the logo and menu.', 'A site header with the logo and nav links.', 'Navigation, Semantic HTML'),
  (37, 'Navigation', 'Links, often inside a nav element, that help users move between pages or sections.', 'The menu that lets a visitor get around a site.', 'A navbar with Home, Courses, and Contact links.', 'Link, Header'),
  (38, 'Hero section', 'The large, prominent area near the top of a page used to grab attention with a headline and call to action.', 'The big banner area at the top of a landing page.', 'A hero with Learn to Code in 8 Weeks and an Enroll button.', 'Call to action'),
  (39, 'Section', 'A section element grouping related content into a thematic block.', 'A labeled chunk of a page content.', 'A Curriculum section listing all 8 weeks.', 'Semantic HTML'),
  (40, 'Footer', 'A footer element holding closing content like copyright, links, and contact info.', 'The bottom strip of a page.', 'A footer with social links and a copyright notice.', 'Semantic HTML'),
  (41, 'Single-page website', 'A website whose content lives on one HTML page, often navigated via in-page anchors.', 'One page, everything scrolls on it.', 'A portfolio site with sections linked by a single nav.', 'Multi-page website'),
  (42, 'Multi-page website', 'A website made of multiple distinct HTML pages linked together.', 'Several separate pages, like Home, About, and Contact.', 'An e-commerce site with separate product and checkout pages.', 'Single-page website'),
  (43, 'Static website', 'A website whose content is fixed and does not change based on user input or a database.', 'The same content for every visitor, no backend logic.', 'A plain HTML brochure site.', 'Dynamic website'),
  (44, 'Dynamic (functional) website', 'A website that generates or changes content based on logic, user input, or a database.', 'Content that can change per user or per request.', 'A dashboard showing personal course progress.', 'Backend, Database'),
  (45, 'DOCTYPE', 'A declaration at the top of an HTML file that tells the browser which version of HTML to use.', 'Tells the browser this is HTML5.', '<!DOCTYPE html>', 'HTML document structure'),
  (46, 'Head', 'The head section of an HTML document containing metadata not shown directly on the page.', 'The page behind-the-scenes info: title, styles, SEO tags.', '<head><title>Home</title></head>', 'Metadata, Body'),
  (47, 'Body', 'The body section of an HTML document containing all visible page content.', 'Everything actually seen on the page.', '<body><h1>Hello</h1></body>', 'Head'),
  (48, 'Metadata', 'Data about the page, such as title, description, and character set, placed in the head and not shown as content.', 'Info about the page, for browsers and search engines.', '<meta name="description" content="...">', 'SEO, Head'),
  (49, 'Viewport', 'A meta tag that controls how a page scales and behaves on different screen sizes.', 'Tells mobile browsers how to size the page.', '<meta name="viewport" content="width=device-width, initial-scale=1">', 'Responsive design'),
  (50, 'Favicon', 'The small icon shown in a browser tab or bookmark for a website.', 'The tiny logo in a browser tab.', '<link rel="icon" href="/favicon.ico">', 'Branding'),
  (51, 'Nesting', 'Placing one HTML element inside another to build structure.', 'Putting tags inside other tags.', '<ul><li>Item</li></ul> nests li inside ul.', 'Element'),
  (52, 'Self-closing tag (void element)', 'An element with no closing tag or content, like img or br.', 'A tag that does not wrap anything.', '<br> creates a line break.', 'Element'),
  (53, 'Whitespace', 'Spaces, tabs, and line breaks in code used for readability, mostly collapsed by browsers.', 'Blank space that makes code easier to read.', 'Indenting nested tags for clarity.', 'Formatting'),
  (54, 'Comment (HTML)', 'Text in code ignored by the browser, used to explain or disable markup.', 'A note in the code that is not shown on the page.', '<!-- Header section starts here -->', 'Documentation'),
  (55, 'Accessibility (a11y)', 'Designing content so people with disabilities can perceive, navigate, and use it, for example with alt text and semantic tags.', 'Making sites usable for everyone, including screen reader users.', 'Adding alt text so a screen reader can describe an image.', 'Alt text, Semantic HTML'),
  (56, 'Alt text', 'A text attribute on img describing the image for screen readers and when the image fails to load.', 'A written description of a picture.', '<img src="team.jpg" alt="The Tech Pulse team at a workshop">', 'Accessibility, Image')
) as v(term_order, term, definition, simple_explanation, example, related_concept) on true
on conflict (week_id, term) do nothing;

-- =========================================================================
-- Terminology — Weeks 2-8 (16-20 real terms each, extensible via admin CRUD)
-- =========================================================================

insert into public.masterclass_terminology (week_id, term, definition, simple_explanation, example, related_concept, term_order)
select w.id, v.term, v.definition, v.simple_explanation, v.example, v.related_concept, v.term_order
from public.masterclass_weeks w
join public.masterclass_programs p on p.id = w.program_id and p.slug = 'web-development-masterclass'
join (values
  (2, 1, 'CSS', 'Cascading Style Sheets, the language used to control the visual presentation of HTML content.', 'The language that makes HTML look good.', 'h1 { color: blue; }', 'HTML'),
  (2, 2, 'Selector', 'The part of a CSS rule that targets which HTML elements the styles apply to.', 'What is being styled.', '.card is a class selector.', 'CSS'),
  (2, 3, 'Class', 'A reusable attribute value used to apply the same CSS styles to multiple elements.', 'A label put on many elements to style them the same way.', '<div class="card">', 'Selector, ID'),
  (2, 4, 'ID', 'A unique attribute value used to target one specific element, often for styling or scripting.', 'A one-of-a-kind name for a single element.', '<div id="main-header">', 'Class, Specificity'),
  (2, 5, 'Specificity', 'The set of rules CSS uses to decide which style wins when multiple rules target the same element.', 'How CSS decides which rule wins.', 'An ID selector beats a class selector of equal importance.', 'Cascade'),
  (2, 6, 'Cascade', 'The order and priority system CSS follows when applying multiple conflicting style rules.', 'How styles flow and override each other, in order.', 'Later rules override earlier ones of equal specificity.', 'Specificity, Inheritance'),
  (2, 7, 'Inheritance', 'The way some CSS properties, like color and font, pass down automatically from parent to child elements.', 'Children can inherit style from a parent element.', 'Setting font-family on body affects text throughout the page.', 'Cascade'),
  (2, 8, 'Box model', 'The model describing how content, padding, border, and margin combine to form an element total size.', 'How size is calculated: content plus padding plus border plus margin.', 'A 100px-wide box with 10px padding renders wider than 100px total.', 'Margin, Padding'),
  (2, 9, 'Margin', 'The space outside an element border, separating it from neighboring elements.', 'Space around the outside of a box.', 'margin: 16px; adds space around an element.', 'Box model, Padding'),
  (2, 10, 'Padding', 'The space between an element content and its border.', 'Space inside a box, around its content.', 'padding: 12px; adds inner breathing room.', 'Box model, Margin'),
  (2, 11, 'Flexbox', 'A CSS layout model for arranging items in a single row or column with flexible alignment and spacing.', 'A tool for lining things up in a row or column easily.', 'display: flex; justify-content: space-between;', 'CSS Grid'),
  (2, 12, 'CSS Grid', 'A CSS layout model for arranging items in two-dimensional rows and columns.', 'A tool for building full page layouts, rows and columns at once.', 'display: grid; grid-template-columns: repeat(3, 1fr);', 'Flexbox'),
  (2, 13, 'Media query', 'A CSS rule that applies styles only when certain conditions, like screen width, are met.', 'Style rules that only apply on certain screen sizes.', '@media (max-width: 768px) { ... }', 'Responsive design'),
  (2, 14, 'Mobile-first design', 'A design approach that starts with styles for small screens, then layers on rules for larger ones.', 'Design for phones first, then scale up.', 'Base styles target mobile; media queries add desktop layout.', 'Responsive design, Media query'),
  (2, 15, 'Responsive design', 'An approach to building interfaces that adapt cleanly to different screen sizes and devices.', 'A site that looks good on any device.', 'A navbar that becomes a hamburger menu on mobile.', 'Media query, Mobile-first design'),
  (2, 16, 'Pseudo-class (hover)', 'A CSS selector that targets an element in a particular state, such as hover when a pointer is over it.', 'Styling based on a special state, like being hovered.', 'button:hover { background: darkblue; }', 'Transition'),
  (2, 17, 'Transition', 'A CSS property that animates changes between two states of a property over time.', 'Makes style changes happen smoothly instead of instantly.', 'transition: background-color 0.2s ease;', 'Pseudo-class'),
  (2, 18, 'Breakpoint', 'A specific screen width at which a responsive design layout changes via a media query.', 'The screen size where the layout switches.', 'A common breakpoint is 768px for tablets.', 'Media query, Responsive design'),

  (3, 1, 'CSS framework', 'A pre-built library of CSS styles and components that speeds up building consistent interfaces.', 'Ready-made styling tools so you do not start from zero.', 'Bootstrap and Tailwind CSS are both CSS frameworks.', 'Tailwind CSS, Bootstrap'),
  (3, 2, 'Bootstrap', 'A popular component-based CSS framework providing pre-styled UI components and a grid system.', 'A framework with ready-made buttons, cards, and layouts.', 'Using Bootstrap class="btn btn-primary".', 'CSS framework'),
  (3, 3, 'Tailwind CSS', 'A utility-first CSS framework that provides small, single-purpose classes composed directly in markup.', 'A framework built from tiny reusable style classes.', 'class="flex items-center gap-4 p-4"', 'Utility-first CSS'),
  (3, 4, 'Utility-first CSS', 'An approach where interfaces are built by composing many small, single-purpose classes rather than custom CSS per component.', 'Styling by combining small building-block classes.', 'Combining p-4, rounded-lg, and shadow instead of writing custom CSS.', 'Tailwind CSS'),
  (3, 5, 'Utility class', 'A single-purpose CSS class that applies one specific style, like padding or text color.', 'One class, one job.', 'text-center centers text and nothing else.', 'Utility-first CSS'),
  (3, 6, 'Breakpoint (Tailwind)', 'A responsive prefix in Tailwind, such as sm, md, lg, xl, or 2xl, that applies a utility only above a given screen width.', 'Tailwind way of saying only on bigger screens.', 'md:flex-row applies flex-row from tablet width up.', 'Responsive design'),
  (3, 7, 'Responsive prefix', 'A Tailwind modifier prepended to a utility class to scope it to a breakpoint.', 'The part before the colon meaning at this screen size.', 'lg: in lg:text-xl.', 'Breakpoint (Tailwind)'),
  (3, 8, 'Hover state (Tailwind)', 'A Tailwind modifier, hover:, that applies a utility only when the element is hovered.', 'Styling that only kicks in on mouse-over.', 'hover:bg-blue-700', 'Pseudo-class'),
  (3, 9, 'Focus state', 'A Tailwind modifier, focus:, that applies a utility when an element like an input is focused.', 'Styling that only kicks in when something is selected.', 'focus:ring-2 focus:ring-primary', 'Accessibility'),
  (3, 10, 'Design system', 'A shared set of reusable components, styles, and rules that keep a product UI consistent.', 'The rulebook that keeps a whole product looking consistent.', 'Consistent button styles, spacing, and colors across every page.', 'Component'),
  (3, 11, 'Component', 'A reusable, self-contained piece of UI, like a button or card, that can be used across a project.', 'A reusable building block of an interface.', 'A Button component reused across many pages.', 'Reusable UI'),
  (3, 12, 'Reusable UI', 'Interface elements built once and used repeatedly instead of duplicating markup and styles.', 'Build it once, use it everywhere.', 'One card component used for every course listing.', 'Component, Design system'),
  (3, 13, 'Spacing scale', 'A consistent set of predefined spacing values, like Tailwind 1, 2, 4, 8, used instead of arbitrary pixel values.', 'A fixed set of spacing sizes so everything lines up nicely.', 'p-2, p-4, p-8 instead of random padding values.', 'Design system'),
  (3, 14, 'Container', 'A wrapping element that constrains content width and centers it on the page.', 'A box that keeps content from stretching edge-to-edge.', 'A max-width container centered with auto margins.', 'Layout'),
  (3, 15, 'Class composition', 'Combining multiple utility classes on one element to build a complete style.', 'Stacking small classes together to get the full look.', 'class="flex p-4 rounded-lg shadow bg-white"', 'Utility-first CSS'),
  (3, 16, 'JIT compiler (Tailwind)', 'Tailwind Just-In-Time engine that generates only the CSS classes actually used in a project, on demand.', 'Tailwind only builds the styles actually used, keeping files small.', 'Using bg-[#123456] generates that exact class on the fly.', 'Tailwind CSS'),

  (4, 1, 'JavaScript', 'A programming language that runs in the browser, and beyond, to add interactivity and logic to web pages.', 'The language that makes web pages do things.', 'Validating a form before it submits.', 'DOM, HTML'),
  (4, 2, 'Variable', 'A named container used to store a value that can be referenced and changed in code.', 'A labeled box that holds a value.', 'let score = 0;', 'Data type'),
  (4, 3, 'Data type', 'A classification of what kind of value a piece of data is, such as string, number, or boolean.', 'What kind of value something is.', '"hello" is a string; 42 is a number.', 'Variable'),
  (4, 4, 'Function', 'A reusable block of code that performs a task and can be called by name, optionally with inputs.', 'A named, reusable set of instructions.', 'function greet(name) { return "Hi " + name; }', 'Variable'),
  (4, 5, 'Array', 'An ordered list of values stored under a single variable name.', 'A list of items in order.', 'const courses = ["HTML", "CSS", "JS"];', 'Object'),
  (4, 6, 'Object', 'A collection of related key-value pairs used to represent structured data.', 'A labeled bundle of related data.', '{ name: "Lucky", role: "instructor" }', 'Array, JSON'),
  (4, 7, 'Loop', 'A control structure that repeats a block of code until a condition is met.', 'Code that runs again and again until told to stop.', 'for (let i = 0; i < 5; i++) { ... }', 'Function'),
  (4, 8, 'DOM', 'Document Object Model, the tree-like structure of a page elements that JavaScript can read and change.', 'How JavaScript sees and edits an HTML page.', 'document.querySelector("h1").textContent = "Hello";', 'JavaScript, HTML'),
  (4, 9, 'Event', 'An action that happens in the browser, such as a click, keypress, or page load, that code can respond to.', 'Something that happens that code can react to.', 'A button click is an event.', 'Event listener'),
  (4, 10, 'Event listener', 'Code attached to an element that runs a function whenever a specific event occurs on it.', 'Code that listens for an event and reacts.', 'button.addEventListener("click", handleClick);', 'Event'),
  (4, 11, 'Fetch API', 'A built-in browser API used to make HTTP requests from JavaScript, often to load or send data.', 'How JavaScript asks a server for, or sends, data.', 'fetch("/api/courses").then(res => res.json());', 'JSON, HTTP'),
  (4, 12, 'JSON', 'JavaScript Object Notation, a lightweight text format for representing structured data, widely used in APIs.', 'A simple text format for sending structured data around.', '{ "title": "Web Dev Masterclass" }', 'Object, Fetch API'),
  (4, 13, 'Git', 'A distributed version control system that tracks changes to files over time.', 'A tool that remembers every version of your code.', 'git init starts tracking a project with Git.', 'Repository, Commit'),
  (4, 14, 'Repository', 'A folder tracked by Git that stores a project files and their full history of changes.', 'The project folder Git is watching.', 'Cloning a GitHub repository to a computer.', 'Git'),
  (4, 15, 'Commit', 'A saved snapshot of staged changes in a Git repository, with a message describing what changed.', 'A saved checkpoint of code.', 'git commit -m "Add navbar component"', 'Staging area'),
  (4, 16, 'Branch', 'An independent line of development in Git that lets you work on changes without affecting the main codebase.', 'A separate copy of the project to experiment safely.', 'git checkout -b feature/login-page', 'Merge'),
  (4, 17, 'Merge', 'The process of combining changes from one Git branch into another.', 'Bringing two branches changes together.', 'Merging a feature branch back into main.', 'Branch'),
  (4, 18, 'Remote', 'A version of a Git repository hosted elsewhere, like GitHub, that a local repo can push to or pull from.', 'The cloud copy of a Git repository.', 'origin is the default name for a remote.', 'GitHub, Push'),
  (4, 19, 'GitHub', 'A cloud platform for hosting Git repositories and collaborating with others via pull requests and issues.', 'Where developers store and collaborate on Git projects online.', 'Pushing a project to GitHub to share it.', 'Git, Pull request'),
  (4, 20, 'Pull request', 'A request on GitHub to merge changes from one branch into another, typically reviewed before merging.', 'Asking for changes to be reviewed and merged in.', 'Opening a pull request to merge a feature branch into main.', 'GitHub, Merge')
) as v(week_number, term_order, term, definition, simple_explanation, example, related_concept) on v.week_number = w.week_number
on conflict (week_id, term) do nothing;

insert into public.masterclass_terminology (week_id, term, definition, simple_explanation, example, related_concept, term_order)
select w.id, v.term, v.definition, v.simple_explanation, v.example, v.related_concept, v.term_order
from public.masterclass_weeks w
join public.masterclass_programs p on p.id = w.program_id and p.slug = 'web-development-masterclass'
join (values
  (5, 1, 'Backend development', 'The practice of building the server-side logic, data handling, and infrastructure behind an application.', 'Building the engine behind the scenes of an app.', 'Writing code that checks a login and looks up a user.', 'PHP, Server'),
  (5, 2, 'PHP', 'A widely-used server-side scripting language designed for building dynamic, database-driven websites.', 'A backend language that runs on the server, not the browser.', '<?php echo "Hello"; ?>', 'Server-side programming'),
  (5, 3, 'Server-side programming', 'Code that runs on the server, not in the user browser, to process requests and generate responses.', 'Code that runs behind the scenes, on the server.', 'Checking a password against a database before allowing login.', 'PHP, Backend development'),
  (5, 4, 'GET', 'An HTTP method typically used to request data, often with parameters visible in the URL.', 'Asking for data, usually via the URL.', 'example.com/search?q=html sends q as a GET parameter.', 'POST, HTTP methods'),
  (5, 5, 'POST', 'An HTTP method typically used to submit data to a server, such as form input, not shown in the URL.', 'Sending data to the server, kept out of the URL.', 'Submitting a login form via POST.', 'GET, Form'),
  (5, 6, 'Session', 'A server-side mechanism for storing data about a user across multiple requests, often used for login state.', 'How a server remembers you are logged in as you browse.', '$_SESSION["user_id"] = 5;', 'Cookie, Authentication'),
  (5, 7, 'Cookie', 'A small piece of data stored in the browser by a website, often used to remember users between visits.', 'A tiny note the browser keeps for a website.', 'A cookie storing a session ID so a user stays logged in.', 'Session'),
  (5, 8, 'Authentication', 'The process of verifying that a user is who they claim to be, typically via login credentials.', 'Proving who you are, usually with a password.', 'Logging in with an email and password.', 'Authorization'),
  (5, 9, 'Authorization', 'The process of determining what an authenticated user is allowed to do or access.', 'Deciding what you are allowed to do once logged in.', 'Only admins are authorized to approve payments.', 'Authentication'),
  (5, 10, 'Validation', 'Checking that submitted data meets required rules, such as format, length, and type, before it is used or stored.', 'Making sure submitted data is actually valid before trusting it.', 'Checking that an email field contains a valid email format.', 'Frontend validation, Backend validation'),
  (5, 11, 'XAMPP', 'A free local development package bundling Apache, MySQL, and PHP for building and testing sites on a personal computer.', 'A toolkit that lets you run PHP and MySQL on a laptop.', 'Starting Apache and MySQL from the XAMPP control panel.', 'Apache, PHP, phpMyAdmin'),
  (5, 12, 'Apache', 'A widely used web server software that receives HTTP requests and serves responses, often running PHP.', 'The server software that actually answers browser requests.', 'Apache runs PHP files when a browser requests a page.', 'Server, XAMPP'),
  (5, 13, 'phpMyAdmin', 'A web-based tool for managing MySQL databases through a graphical interface.', 'A visual tool for viewing and editing a database.', 'Browsing a users table rows in phpMyAdmin.', 'MySQL, XAMPP'),
  (5, 14, 'Request flow', 'The path a request takes from browser to server to database and back as a response.', 'The journey a request takes from click to response.', 'Browser to Apache to PHP to MySQL and back.', 'HTTP, Server'),
  (5, 15, 'Frontend validation', 'Checks performed in the browser, often with JavaScript, before data is submitted, mainly for user experience.', 'Quick checks in the browser to help users fix mistakes fast.', 'Highlighting an empty required field before submit.', 'Backend validation'),
  (5, 16, 'Backend validation', 'Checks performed on the server after data is received, which cannot be bypassed by the client and are essential for security.', 'The real, trustworthy check that happens on the server.', 'Re-checking an email format in PHP even after JavaScript already checked it.', 'Frontend validation, Security'),
  (5, 17, 'Environment configuration', 'Settings, like database credentials or file paths, that configure how an application runs in a given environment.', 'The setup details an app needs to run correctly.', 'Database host, username, and password used to connect PHP to MySQL.', 'Environment variable'),
  (5, 18, 'Local development server', 'A server running on a personal computer used to build and test an application before it goes live.', 'A private practice server on your own machine.', 'Testing a PHP site at localhost before deploying it.', 'XAMPP, Apache'),

  (6, 1, 'Database', 'An organized collection of structured data that can be stored, queried, and updated.', 'A structured place to store and look up data.', 'A database storing every student, course, and payment.', 'DBMS, Table'),
  (6, 2, 'DBMS', 'Database Management System, software used to create, manage, and query databases.', 'The software that runs and manages databases.', 'MySQL is a type of DBMS.', 'Database, MySQL'),
  (6, 3, 'MySQL', 'A popular open-source relational database management system that stores data in tables.', 'A widely used database system for storing structured data.', 'Storing a students table in a MySQL database.', 'DBMS, SQL'),
  (6, 4, 'Table', 'A structured set of data in a database, organized into rows and columns.', 'A grid of data, like a spreadsheet, inside a database.', 'A students table with columns for name and email.', 'Row, Column'),
  (6, 5, 'Row', 'A single record in a database table, representing one entity full set of values.', 'One entry or record in a table.', 'One row equals one specific student data.', 'Table, Column'),
  (6, 6, 'Column', 'A named field in a database table that stores one type of value for every row.', 'One category of data across every row.', 'An email column storing every student email.', 'Table, Row'),
  (6, 7, 'Primary key', 'A column, or set of columns, that uniquely identifies each row in a table.', 'The unique ID for each row.', 'A student_id column that never repeats.', 'Foreign key'),
  (6, 8, 'Foreign key', 'A column that references a primary key in another table, creating a relationship between tables.', 'A link pointing to a row in another table.', 'An enrollments.student_id pointing to students.id.', 'Primary key, Relationship'),
  (6, 9, 'Relationship', 'A logical connection between two tables, typically formed through a foreign key.', 'How two tables are connected to each other.', 'A student can have many enrollments, a one-to-many relationship.', 'Foreign key'),
  (6, 10, 'CRUD', 'Create, Read, Update, Delete, the four basic operations performed on stored data.', 'The four things you can do to data: add, view, change, remove.', 'Adding a student is Create; editing their email is Update.', 'SQL'),
  (6, 11, 'SQL', 'Structured Query Language, the standard language used to query and manage relational databases.', 'The language used to talk to a database.', 'SELECT * FROM students;', 'MySQL, CRUD'),
  (6, 12, 'JOIN', 'A SQL clause that combines rows from two or more tables based on a related column.', 'Pulling matching data together from two tables at once.', 'JOIN enrollments ON students.id = enrollments.student_id', 'Relationship, SQL'),
  (6, 13, 'WHERE clause', 'A SQL clause used to filter rows so only those matching a condition are returned or affected.', 'The part of a query that filters results.', 'SELECT * FROM students WHERE status = "active";', 'SQL'),
  (6, 14, 'Prepared statement', 'A SQL query template with placeholders for user input, executed safely by the database driver to prevent injection.', 'A safe way to insert user data into a query.', 'Using ? placeholders instead of pasting raw input into SQL.', 'SQL injection'),
  (6, 15, 'SQL injection', 'An attack where malicious input is crafted to alter a SQL query meaning, potentially exposing or destroying data.', 'A hack where bad input tricks a database query.', 'Typing a crafted value like OR 1=1 into a login field to try to bypass authentication.', 'Prepared statement, Security'),
  (6, 16, 'Normalization', 'The process of organizing database tables to reduce data duplication and improve integrity.', 'Structuring a database so data is not repeated everywhere.', 'Storing a course once and linking to it, instead of copying its details into every enrollment row.', 'Database design'),
  (6, 17, 'phpMyAdmin (recap)', 'A web-based tool for viewing and managing MySQL databases visually.', 'The visual database tool used alongside XAMPP.', 'Running a SELECT query directly in phpMyAdmin SQL tab.', 'MySQL'),
  (6, 18, 'ORDER BY', 'A SQL clause used to sort query results by one or more columns.', 'The part of a query that sorts results.', 'ORDER BY created_at DESC', 'SQL'),

  (7, 1, 'SDLC', 'Software Development Lifecycle, the structured phases a software project moves through, from planning to maintenance.', 'The standard stages a software project goes through.', 'Planning, Design, Development, Testing, Deployment, Maintenance.', 'Agile'),
  (7, 2, 'Agile', 'An iterative approach to software development that favors small releases, feedback, and adapting to change.', 'Building software in small steps, adjusting as you learn.', 'Shipping a small feature every two weeks instead of one big release a year.', 'Scrum, Kanban'),
  (7, 3, 'Scrum', 'An Agile framework that organizes work into fixed-length sprints with defined roles and ceremonies.', 'A structured way to run Agile work in short sprints.', 'A two-week sprint ending in a review meeting.', 'Agile'),
  (7, 4, 'Kanban', 'A visual workflow method that tracks tasks as cards moving through columns like To Do, In Progress, and Done.', 'A visual board for tracking work as it moves along.', 'A Trello-style board with To Do, Doing, and Done columns.', 'Agile'),
  (7, 5, 'User story', 'A short description of a feature from the end user perspective, explaining what they need and why.', 'A feature described from the user point of view.', 'As a student, I want to see my payment status so I know if I can access my course.', 'Requirements'),
  (7, 6, 'Requirements', 'The documented needs and constraints a piece of software must satisfy.', 'What the software actually needs to do.', 'The system must let admins approve or reject payments.', 'User story'),
  (7, 7, 'Wireframe', 'A simplified visual layout of a screen used to plan structure before visual design.', 'A rough sketch of where things go on a screen.', 'Boxes showing where the header, sidebar, and content go.', 'UI design'),
  (7, 8, 'Production environment', 'The live environment where real users interact with a deployed application.', 'The real version of the app that users actually use.', 'The live techpulseinsider.com site.', 'Development environment'),
  (7, 9, 'Development environment', 'The environment used by developers to build and test code before it reaches production.', 'The practice version of the app, used while building.', 'Running the app locally with npm run dev.', 'Production environment'),
  (7, 10, 'Environment variable', 'A configuration value stored outside source code, often used for secrets and settings that differ per environment.', 'A setting kept outside the code, like a secret key.', 'VITE_SUPABASE_URL stored in a .env file.', 'Environment configuration'),
  (7, 11, 'Hosting', 'A service that stores and serves an application files so it is accessible on the internet.', 'Where a live app lives online.', 'Vercel hosting a deployed frontend.', 'Deployment, Domain'),
  (7, 12, 'DNS (recap)', 'The system that translates domain names into IP addresses so browsers can find servers.', 'The internet phonebook for domain names.', 'Pointing a custom domain to a hosting provider via DNS records.', 'Domain, Hosting'),
  (7, 13, 'SSL/HTTPS', 'A security protocol that encrypts data between browser and server, shown as HTTPS in the URL.', 'The encryption that keeps data private in transit.', 'A padlock icon shown for a site using HTTPS.', 'HTTPS'),
  (7, 14, 'CI/CD', 'Continuous Integration and Continuous Deployment, practices that automatically test and ship code changes frequently and reliably.', 'Automatically testing and releasing code changes.', 'Every push to main automatically runs tests and deploys.', 'DevOps'),
  (7, 15, 'DevOps', 'A culture and set of practices that unify software development and IT operations to ship reliably and quickly.', 'Development and operations working together, automated.', 'A team automating deployment instead of doing it manually.', 'CI/CD'),
  (7, 16, 'Docker', 'A platform for building, packaging, and running applications inside lightweight, portable containers.', 'A tool that packages an app so it runs the same everywhere.', 'Running the same container on a laptop and a production server.', 'Container'),
  (7, 17, 'Container', 'A lightweight, isolated unit that packages an application with everything it needs to run consistently.', 'A self-contained box holding an app and its dependencies.', 'A container running a Node.js app with its exact dependencies.', 'Docker, Image (Docker)'),
  (7, 18, 'Image (Docker)', 'A read-only template used to create Docker containers, built from a Dockerfile.', 'The blueprint a container is created from.', 'A node:18 image used as the base for a Node.js app.', 'Dockerfile'),
  (7, 19, 'Dockerfile', 'A text file containing instructions for building a Docker image.', 'The recipe file that builds a Docker image.', 'FROM node:18 followed by COPY and RUN instructions.', 'Docker, Image (Docker)'),
  (7, 20, 'Docker Compose', 'A tool for defining and running multi-container Docker applications using a single configuration file.', 'A way to run several containers together with one command.', 'A docker-compose.yml running an app container and a database container together.', 'Docker'),

  (8, 1, 'Problem statement', 'A clear, concise description of the specific problem a project is intended to solve.', 'What problem a project actually solves.', 'Small clinics have no simple way to track patient records digitally.', 'Requirements'),
  (8, 2, 'Target users', 'The specific group of people a project is designed for.', 'Who the project is actually built for.', 'Receptionists and nurses at a small clinic.', 'Problem statement'),
  (8, 3, 'Requirements (capstone)', 'The specific features and constraints a capstone project must fulfill to be considered complete.', 'The checklist a finished project must meet.', 'Must support admin login, patient CRUD, and search.', 'System design'),
  (8, 4, 'System design', 'The high-level plan for how an application frontend, backend, and database components fit together.', 'The blueprint for how all the pieces connect.', 'A diagram showing the browser, API, and database and how they talk.', 'Database design'),
  (8, 5, 'Database design', 'The process of planning a database tables, relationships, and constraints before building it.', 'Planning data structure before building it.', 'Sketching a patients table linked to a visits table.', 'System design, Relationship'),
  (8, 6, 'Wireframe (capstone)', 'A simplified layout sketch of a capstone key screens, used to plan the UI before coding it.', 'A rough plan of what each screen will look like.', 'A sketch of the dashboard before writing any code.', 'UI design'),
  (8, 7, 'UI design', 'The process of designing how an application looks and how users interact with it.', 'Designing what the app looks like and how it feels to use.', 'Choosing layout, colors, and button placement for a dashboard.', 'Wireframe'),
  (8, 8, 'Capstone project', 'A final, comprehensive project that demonstrates mastery of everything learned throughout a course.', 'The big final project that proves what has been learned.', 'A full-stack Student Management System built over the final week.', 'Portfolio'),
  (8, 9, 'Deployment (capstone)', 'Making a finished capstone project accessible on the internet so others can use and review it.', 'Putting a finished project online for others to see.', 'Deploying the frontend to Vercel and the backend or database elsewhere.', 'Hosting'),
  (8, 10, 'Documentation', 'Written material explaining what a project does, how it works, and how to run or use it.', 'The written explanation of a project.', 'A README describing setup steps and features.', 'README'),
  (8, 11, 'README', 'A markdown file, usually at the root of a repository, introducing a project and explaining how to use it.', 'The front page file of a code repository.', 'README.md listing install steps and screenshots.', 'Documentation, GitHub'),
  (8, 12, 'Presentation', 'Communicating a project purpose, design, and functionality clearly to an audience.', 'Explaining a project out loud, clearly and confidently.', 'Walking assessors through a capstone features and decisions.', 'Capstone project'),
  (8, 13, 'Code review', 'The practice of examining code, your own or someone else, to check quality, correctness, and clarity before it is finalized.', 'Double-checking code for quality before it is considered done.', 'Re-reading a capstone code to make sure it is clean and understandable.', 'Documentation'),
  (8, 14, 'Version control (recap)', 'Tracking every change made to a codebase over time, typically using Git.', 'Keeping a full history of every change to code.', 'Using Git commits to track a capstone progress.', 'Git'),
  (8, 15, 'Testing (capstone)', 'Verifying that a capstone project features work correctly and handle errors gracefully before presenting it.', 'Checking that a project actually works before showing it off.', 'Trying to submit a form with missing fields to see if it is handled properly.', 'SDLC'),
  (8, 16, 'Technical debt', 'The extra future work created when a shortcut or quick fix is chosen over a more thorough solution.', 'The cost of taking shortcuts now that must be paid for later.', 'Hardcoding a value instead of making it configurable, to save time under deadline.', 'Code review')
) as v(week_number, term_order, term, definition, simple_explanation, example, related_concept) on v.week_number = w.week_number
on conflict (week_id, term) do nothing;

-- =========================================================================
-- Quizzes (one per week)
-- =========================================================================

insert into public.masterclass_quizzes (week_id, title, instructions, passing_score, time_limit_minutes, max_attempts, randomize_questions)
select w.id, v.title, v.instructions, v.passing_score, v.time_limit_minutes, v.max_attempts, false
from public.masterclass_weeks w
join public.masterclass_programs p on p.id = w.program_id and p.slug = 'web-development-masterclass'
join (values
  (1, 'Week 1 Quiz: Web Fundamentals and HTML', 'Complete all questions. You need at least 70% to pass. You may retake this quiz up to 3 times.', 70, 20, 3),
  (2, 'Week 2 Quiz: CSS and Responsive Design', 'Complete all questions. You need at least 70% to pass. You may retake this quiz up to 3 times.', 70, 15, 3),
  (3, 'Week 3 Quiz: Tailwind CSS and Modern Frontend', 'Complete all questions. You need at least 70% to pass. You may retake this quiz up to 3 times.', 70, 15, 3),
  (4, 'Week 4 Quiz: JavaScript, Git and GitHub', 'Complete all questions. You need at least 70% to pass. You may retake this quiz up to 3 times.', 70, 20, 3),
  (5, 'Week 5 Quiz: PHP and Backend Fundamentals', 'Complete all questions. You need at least 70% to pass. You may retake this quiz up to 3 times.', 70, 15, 3),
  (6, 'Week 6 Quiz: MySQL and Databases', 'Complete all questions. You need at least 70% to pass. You may retake this quiz up to 3 times.', 70, 15, 3),
  (7, 'Week 7 Quiz: SDLC, Deployment, DevOps and Docker', 'Complete all questions. You need at least 70% to pass. You may retake this quiz up to 3 times.', 70, 15, 3),
  (8, 'Week 8 Quiz: Capstone Readiness Check', 'Complete all questions. You need at least 70% to pass. This checkpoint may be retaken up to 3 times.', 70, 15, 3)
) as v(week_number, title, instructions, passing_score, time_limit_minutes, max_attempts) on v.week_number = w.week_number
on conflict (week_id) do nothing;

-- =========================================================================
-- Quiz questions — Week 1 (14 questions, full reference implementation)
-- =========================================================================

insert into public.masterclass_quiz_questions (quiz_id, question_order, question_type, question_text, options, correct_answer, explanation, points)
select qz.id, v.question_order, v.question_type, v.question_text, v.options::jsonb, v.correct_answer, v.explanation, 1
from public.masterclass_quizzes qz
join public.masterclass_weeks w on w.id = qz.week_id
join public.masterclass_programs p on p.id = w.program_id and p.slug = 'web-development-masterclass' and w.week_number = 1
join (values
  (1, 'mcq', 'Which part of an application runs inside the user browser?',
   '[{"id":"a","text":"Backend"},{"id":"b","text":"Frontend"},{"id":"c","text":"Database"},{"id":"d","text":"Server"}]',
   'b', 'The frontend is the part of the app that runs in the browser and controls what users see and interact with.'),
  (2, 'mcq', 'What does HTTP stand for?',
   '[{"id":"a","text":"HyperText Transfer Protocol"},{"id":"b","text":"High Transfer Text Process"},{"id":"c","text":"Hyperlink Text Transport"},{"id":"d","text":"Host Transfer Protocol"}]',
   'a', 'HTTP stands for HyperText Transfer Protocol, the rules browsers and servers use to exchange web content.'),
  (3, 'true_false', 'HTTPS is HTTP with encryption added via SSL/TLS.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'true', 'HTTPS is HTTP secured with SSL/TLS encryption so data cannot be read or altered in transit.'),
  (4, 'mcq', 'Which HTML element should be used for the main site navigation menu?',
   '[{"id":"a","text":"<div>"},{"id":"b","text":"<nav>"},{"id":"c","text":"<section>"},{"id":"d","text":"<footer>"}]',
   'b', 'The nav element is the semantic choice for a block of navigation links.'),
  (5, 'mcq', 'What is the purpose of the head section in an HTML document?',
   '[{"id":"a","text":"Holds visible page content"},{"id":"b","text":"Holds metadata not shown directly on the page"},{"id":"c","text":"Holds only images"},{"id":"d","text":"Is optional and rarely used"}]',
   'b', 'The head holds metadata like the title and viewport settings, none of which render directly as page content.'),
  (6, 'mcq', 'Which of these is a semantic HTML element?',
   '[{"id":"a","text":"<div>"},{"id":"b","text":"<span>"},{"id":"c","text":"<article>"},{"id":"d","text":"<b>"}]',
   'c', 'article describes what the content is (a self-contained piece of content), unlike the purely generic div and span.'),
  (7, 'mcq', 'What does a URL domain part represent?',
   '[{"id":"a","text":"The exact file path on a server"},{"id":"b","text":"The human-readable address that maps to a server IP address"},{"id":"c","text":"The HTTP method used"},{"id":"d","text":"The page title"}]',
   'b', 'A domain is the readable name, such as techpulseinsider.com, that DNS maps to a server IP address.'),
  (8, 'scenario', 'A visitor types your site address and DNS cannot resolve it to an IP address. What most likely happens?',
   '[{"id":"a","text":"The page loads slowly but works"},{"id":"b","text":"The browser shows a site cannot be reached style error"},{"id":"c","text":"The page loads with missing images only"},{"id":"d","text":"The request is automatically sent over HTTPS instead"}]',
   'b', 'Without DNS resolving the domain to an IP address, the browser has no server to connect to and shows a connection error.'),
  (9, 'mcq', 'Which HTTP method is typically used to submit form data that creates a new resource?',
   '[{"id":"a","text":"GET"},{"id":"b","text":"POST"},{"id":"c","text":"HEAD"},{"id":"d","text":"LINK"}]',
   'b', 'POST is the conventional method for submitting data that creates or changes something on the server.'),
  (10, 'mcq', 'What is the correct HTML for an image with a text alternative for screen readers?',
   '[{"id":"a","text":"<img src=\"logo.png\">"},{"id":"b","text":"<img source=\"logo.png\" alt=\"Logo\">"},{"id":"c","text":"<img src=\"logo.png\" alt=\"Logo\">"},{"id":"d","text":"<image src=\"logo.png\">"}]',
   'c', 'img uses the src attribute for the file and alt for the accessible text alternative.'),
  (11, 'true_false', 'A static website content changes automatically based on data pulled from a database.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'false', 'That describes a dynamic website. A static website content is fixed and does not change per request.'),
  (12, 'mcq', 'Which element is the correct container for a group of related navigation links?',
   '[{"id":"a","text":"<ul> alone, with no wrapper"},{"id":"b","text":"<nav>"},{"id":"c","text":"<link>"},{"id":"d","text":"<a-group>"}]',
   'b', 'nav is the semantic element for a block of navigation links, often wrapping a list of anchors.'),
  (13, 'mcq', 'What best describes the relationship between the Internet and the World Wide Web?',
   '[{"id":"a","text":"They are exactly the same thing"},{"id":"b","text":"The Web is a system of linked documents that runs on top of the Internet"},{"id":"c","text":"The Internet only exists inside browsers"},{"id":"d","text":"The Web is the physical cabling layer"}]',
   'b', 'The Internet is the network layer; the Web is one system, of many, that runs on top of it.'),
  (14, 'scenario', 'A form contains <button type="submit">Enroll Now</button> inside a form element. What happens when it is clicked?',
   '[{"id":"a","text":"Nothing, buttons always need JavaScript"},{"id":"b","text":"The form data is submitted to the server"},{"id":"c","text":"The form is deleted"},{"id":"d","text":"A new browser tab opens automatically"}]',
   'b', 'A type="submit" button inside a form triggers the form submission by default, with no JavaScript required.')
) as v(question_order, question_type, question_text, options, correct_answer, explanation) on true
on conflict (quiz_id, question_order) do nothing;

-- =========================================================================
-- Quiz questions — Weeks 2-8 (6-7 real questions each)
-- =========================================================================

insert into public.masterclass_quiz_questions (quiz_id, question_order, question_type, question_text, options, correct_answer, explanation, points)
select qz.id, v.question_order, v.question_type, v.question_text, v.options::jsonb, v.correct_answer, v.explanation, 1
from public.masterclass_quizzes qz
join public.masterclass_weeks w on w.id = qz.week_id
join public.masterclass_programs p on p.id = w.program_id and p.slug = 'web-development-masterclass'
join (values
  (2, 1, 'mcq', 'Which CSS property controls the space between an element border and its content?',
   '[{"id":"a","text":"margin"},{"id":"b","text":"padding"},{"id":"c","text":"gap"},{"id":"d","text":"border-spacing"}]',
   'b', 'Padding is the space between an element content and its border; margin is the space outside the border.'),
  (2, 2, 'true_false', 'In the CSS box model, margin sits outside the border, and padding sits inside it.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'true', 'From the inside out, the box model order is: content, padding, border, then margin.'),
  (2, 3, 'mcq', 'Which selector generally has higher specificity: a class selector or an ID selector?',
   '[{"id":"a","text":"Class"},{"id":"b","text":"ID"},{"id":"c","text":"They are always equal"},{"id":"d","text":"Neither has specificity"}]',
   'b', 'An ID selector has higher specificity than a class selector of the same weight elsewhere.'),
  (2, 4, 'mcq', 'Which CSS layout method is best suited for one-dimensional row or column alignment, like a navbar?',
   '[{"id":"a","text":"CSS Grid"},{"id":"b","text":"Flexbox"},{"id":"c","text":"Float"},{"id":"d","text":"Table layout"}]',
   'b', 'Flexbox is designed for one-dimensional layout along a single row or column.'),
  (2, 5, 'mcq', 'What does mobile-first design mean?',
   '[{"id":"a","text":"Designing only for mobile devices"},{"id":"b","text":"Writing base styles for small screens, then adding rules for larger screens via media queries"},{"id":"c","text":"Designing desktop first, then hiding elements on mobile"},{"id":"d","text":"Using only inline styles on phones"}]',
   'b', 'Mobile-first means base styles target small screens, and media queries progressively add rules for larger breakpoints.'),
  (2, 6, 'scenario', 'You write .card:hover { transform: scale(1.02); }. What triggers this style?',
   '[{"id":"a","text":"The page loading"},{"id":"b","text":"The user hovering their pointer over an element with class card"},{"id":"c","text":"The element being clicked"},{"id":"d","text":"The window being resized"}]',
   'b', 'The :hover pseudo-class applies only while a pointer is positioned over the matching element.'),

  (3, 1, 'mcq', 'What best describes utility-first CSS?',
   '[{"id":"a","text":"Writing custom class names for every component"},{"id":"b","text":"Composing designs from small, single-purpose classes like flex, p-4, text-lg"},{"id":"c","text":"Avoiding CSS classes entirely"},{"id":"d","text":"Only using inline styles"}]',
   'b', 'Utility-first CSS builds interfaces by combining many small, single-purpose classes directly in markup.'),
  (3, 2, 'true_false', 'Tailwind classes like sm: and lg: apply styles at specific responsive breakpoints.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'true', 'sm:, md:, lg:, xl:, and 2xl: are Tailwind responsive prefixes tied to specific breakpoints.'),
  (3, 3, 'mcq', 'In Tailwind, which class typically applies padding on all sides of an element?',
   '[{"id":"a","text":"m-4"},{"id":"b","text":"p-4"},{"id":"c","text":"gap-4"},{"id":"d","text":"space-4"}]',
   'b', 'p- utilities apply padding; m- utilities apply margin.'),
  (3, 4, 'mcq', 'Compared to writing custom CSS for every component, one key benefit of a utility-first framework like Tailwind is:',
   '[{"id":"a","text":"It removes the need to think about design"},{"id":"b","text":"Faster, more consistent styling without leaving your markup"},{"id":"c","text":"It eliminates the need for responsive design"},{"id":"d","text":"It only works with Bootstrap"}]',
   'b', 'Utility classes speed up styling and keep it consistent, since developers compose from a fixed set of values.'),
  (3, 5, 'mcq', 'Which of these is a Tailwind interactive state modifier?',
   '[{"id":"a","text":"hover:"},{"id":"b","text":"@hover"},{"id":"c","text":":hover-class"},{"id":"d","text":"--hover"}]',
   'a', 'State modifiers like hover: and focus: are prefixed onto a utility class with a colon.'),
  (3, 6, 'scenario', 'You want a button that is blue by default and darker blue on hover using Tailwind. Which pattern is correct?',
   '[{"id":"a","text":"bg-blue-500 hover-bg-blue-700"},{"id":"b","text":"bg-blue-500 hover:bg-blue-700"},{"id":"c","text":"hover(bg-blue-700) bg-blue-500"},{"id":"d","text":"blue-bg-500:hover-700"}]',
   'b', 'The hover: prefix applied to a second utility class is the correct Tailwind pattern for a hover state.'),

  (4, 1, 'mcq', 'Which keyword declares a variable that can be reassigned but is scoped to a block?',
   '[{"id":"a","text":"var"},{"id":"b","text":"let"},{"id":"c","text":"const"},{"id":"d","text":"function"}]',
   'b', 'let declares a block-scoped variable that can be reassigned; const cannot be reassigned.'),
  (4, 2, 'mcq', 'What does the DOM represent?',
   '[{"id":"a","text":"A database format"},{"id":"b","text":"A tree-like structure of a page elements that JavaScript can read and modify"},{"id":"c","text":"A CSS framework"},{"id":"d","text":"A Git branching model"}]',
   'b', 'The DOM is the in-memory tree representation of a page that JavaScript can query and change.'),
  (4, 3, 'true_false', 'JSON stands for JavaScript Object Notation and is commonly used to exchange data between a client and a server.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'true', 'JSON is a lightweight, language-independent text format widely used for API data exchange.'),
  (4, 4, 'mcq', 'In Git, what does git commit do?',
   '[{"id":"a","text":"Uploads your code to GitHub"},{"id":"b","text":"Saves a snapshot of staged changes to your local repository history"},{"id":"c","text":"Creates a new branch"},{"id":"d","text":"Deletes uncommitted changes"}]',
   'b', 'A commit is a local, saved snapshot of staged changes; pushing is what uploads it to a remote like GitHub.'),
  (4, 5, 'mcq', 'What is the difference between git push and git pull?',
   '[{"id":"a","text":"They do the same thing"},{"id":"b","text":"push uploads local commits to a remote; pull downloads and merges remote commits into your local branch"},{"id":"c","text":"push deletes a branch; pull creates one"},{"id":"d","text":"push only works on GitHub, pull only works locally"}]',
   'b', 'push sends local commits to a remote repository; pull fetches and merges remote changes locally.'),
  (4, 6, 'mcq', 'Why would a developer create a new Git branch before starting a feature?',
   '[{"id":"a","text":"Branches are required to commit code"},{"id":"b","text":"To work on changes in isolation without affecting the main codebase until ready"},{"id":"c","text":"To automatically deploy the app"},{"id":"d","text":"Branches back up files to the cloud"}]',
   'b', 'Branching isolates in-progress work so main stays stable until the change is reviewed and merged.'),
  (4, 7, 'scenario', 'You add button.addEventListener("click", handleClick). When does handleClick run?',
   '[{"id":"a","text":"Immediately when the page loads"},{"id":"b","text":"Every time the button is clicked"},{"id":"c","text":"Only once, ever"},{"id":"d","text":"Never, unless the page is refreshed"}]',
   'b', 'An event listener runs its callback every time the specified event occurs on the target element.'),

  (5, 1, 'mcq', 'Which of these best describes backend development?',
   '[{"id":"a","text":"Styling how a page looks"},{"id":"b","text":"Server-side logic, data processing, and communicating with a database"},{"id":"c","text":"Writing HTML markup only"},{"id":"d","text":"Designing logos"}]',
   'b', 'Backend development covers the server-side logic, data handling, and infrastructure behind an app.'),
  (5, 2, 'mcq', 'In a typical PHP form-handling flow, which superglobal holds data submitted via a POST form?',
   '[{"id":"a","text":"$_GET"},{"id":"b","text":"$_POST"},{"id":"c","text":"$_SESSION"},{"id":"d","text":"$_FILES only"}]',
   'b', '$_POST holds form data submitted with the POST method.'),
  (5, 3, 'true_false', 'Frontend, client-side, validation alone is sufficient security, since users cannot bypass it.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'false', 'Frontend validation can always be bypassed, so the backend must independently validate every input.'),
  (5, 4, 'mcq', 'What is the purpose of PHP sessions?',
   '[{"id":"a","text":"To style pages"},{"id":"b","text":"To persist data about a user, like login state, across multiple requests"},{"id":"c","text":"To connect to MySQL"},{"id":"d","text":"To compile JavaScript"}]',
   'b', 'Sessions let the server remember information about a user, such as being logged in, across requests.'),
  (5, 5, 'mcq', 'In local development with XAMPP, which component serves your PHP files over HTTP?',
   '[{"id":"a","text":"MySQL"},{"id":"b","text":"Apache"},{"id":"c","text":"phpMyAdmin"},{"id":"d","text":"Git"}]',
   'b', 'Apache is the web server component that receives HTTP requests and serves your PHP files.'),
  (5, 6, 'scenario', 'A user submits a login form. The frontend already checks that the email field is not empty. Why should the backend validate it again?',
   '[{"id":"a","text":"It is unnecessary since the frontend already checked"},{"id":"b","text":"Frontend checks can be bypassed, so the backend must never trust client input blindly"},{"id":"c","text":"Backend validation is only for file uploads"},{"id":"d","text":"Only admins need backend validation"}]',
   'b', 'A user can disable JavaScript or call the API directly, bypassing frontend checks entirely, so the backend must validate independently.'),

  (6, 1, 'mcq', 'Which SQL keyword retrieves rows from a table?',
   '[{"id":"a","text":"FETCH"},{"id":"b","text":"SELECT"},{"id":"c","text":"GET"},{"id":"d","text":"PULL"}]',
   'b', 'SELECT is the SQL statement used to query and retrieve rows.'),
  (6, 2, 'mcq', 'What is a primary key?',
   '[{"id":"a","text":"Any column with text data"},{"id":"b","text":"A column, or set of columns, that uniquely identifies each row in a table"},{"id":"c","text":"A password for the database"},{"id":"d","text":"The first column in any table"}]',
   'b', 'A primary key uniquely identifies each row, and no two rows can share the same primary key value.'),
  (6, 3, 'true_false', 'A foreign key in one table typically references a primary key in another table to create a relationship.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'true', 'Foreign keys are how relational databases link related rows across separate tables.'),
  (6, 4, 'mcq', 'Why should you use prepared statements when inserting user input into a SQL query?',
   '[{"id":"a","text":"They make queries run faster"},{"id":"b","text":"They prevent SQL injection by separating query logic from user data"},{"id":"c","text":"They are required for SELECT statements only"},{"id":"d","text":"They are only needed for MySQL, not other databases"}]',
   'b', 'Prepared statements keep user input as data, never as executable query text, which blocks SQL injection.'),
  (6, 5, 'mcq', 'Which SQL clause is used to filter rows based on a condition?',
   '[{"id":"a","text":"ORDER BY"},{"id":"b","text":"WHERE"},{"id":"c","text":"JOIN"},{"id":"d","text":"GROUP"}]',
   'b', 'WHERE filters which rows a query returns or affects, based on a condition.'),
  (6, 6, 'scenario', 'You need a report joining a students table with an enrollments table to show each student enrolled courses. Which SQL clause combines rows from both tables based on a matching key?',
   '[{"id":"a","text":"UNION"},{"id":"b","text":"JOIN"},{"id":"c","text":"WHERE only"},{"id":"d","text":"INDEX"}]',
   'b', 'JOIN combines related rows from two or more tables based on a matching column, such as a foreign key.'),

  (7, 1, 'mcq', 'Which of these lists the general order of the SDLC phases?',
   '[{"id":"a","text":"Testing, Planning, Deployment, Design"},{"id":"b","text":"Planning, Design, Development, Testing, Deployment, Maintenance"},{"id":"c","text":"Deployment, Development, Planning"},{"id":"d","text":"Maintenance, Planning, Testing"}]',
   'b', 'The SDLC generally flows from planning and design through development, testing, deployment, and maintenance.'),
  (7, 2, 'mcq', 'In Agile and Scrum, what is a user story?',
   '[{"id":"a","text":"A legal document"},{"id":"b","text":"A short description of a feature from the end user perspective, describing what they need and why"},{"id":"c","text":"A bug report"},{"id":"d","text":"A deployment log"}]',
   'b', 'A user story frames a requirement from the perspective of the person who will use the feature.'),
  (7, 3, 'true_false', 'Environment variables are commonly used to store configuration, like API keys, outside of your source code.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'true', 'Environment variables keep secrets and per-environment settings out of the codebase itself.'),
  (7, 4, 'mcq', 'What does CI/CD stand for?',
   '[{"id":"a","text":"Code Isolation / Code Deployment"},{"id":"b","text":"Continuous Integration / Continuous Deployment (or Delivery)"},{"id":"c","text":"Client Interface / Client Design"},{"id":"d","text":"Container Instance / Container Data"}]',
   'b', 'CI/CD refers to automatically integrating, testing, and deploying code changes.'),
  (7, 5, 'mcq', 'What is a Docker container?',
   '[{"id":"a","text":"A virtual machine that boots a full operating system"},{"id":"b","text":"A lightweight, isolated unit that packages an application with everything it needs to run consistently"},{"id":"c","text":"A type of database"},{"id":"d","text":"A Git branch"}]',
   'b', 'A container packages an app and its dependencies so it runs the same way in any environment.'),
  (7, 6, 'mcq', 'What is the purpose of a Dockerfile?',
   '[{"id":"a","text":"To store website content"},{"id":"b","text":"A set of instructions describing how to build a Docker image"},{"id":"c","text":"A CSS stylesheet for containers"},{"id":"d","text":"A database schema"}]',
   'b', 'A Dockerfile defines the steps used to build a Docker image, which containers are then created from.'),
  (7, 7, 'scenario', 'Your app works on your laptop but fails on a teammate machine due to different installed tool versions. Which practice most directly helps prevent this class of problem?',
   '[{"id":"a","text":"Writing more CSS"},{"id":"b","text":"Containerizing the app so its environment is consistent everywhere it runs"},{"id":"c","text":"Using a bigger monitor"},{"id":"d","text":"Avoiding version control"}]',
   'b', 'Containers package the exact environment an app needs, eliminating most it works on my machine problems.'),

  (8, 1, 'mcq', 'What is the purpose of a problem statement in a capstone project?',
   '[{"id":"a","text":"To describe the color scheme"},{"id":"b","text":"To clearly define the problem the project solves and for whom"},{"id":"c","text":"To list the developer favorite tools"},{"id":"d","text":"It is optional and rarely useful"}]',
   'b', 'A problem statement anchors the entire project in a specific, real problem and audience.'),
  (8, 2, 'mcq', 'Why is a README important for a GitHub repository?',
   '[{"id":"a","text":"It is required by GitHub to allow pushes"},{"id":"b","text":"It explains what the project is, how to run it, and how it works, helping others understand it"},{"id":"c","text":"It replaces the need for comments in code"},{"id":"d","text":"It is only for open-source licenses"}]',
   'b', 'A README is the entry point that helps anyone, including future you, understand and run the project.'),
  (8, 3, 'true_false', 'Being able to explain your own code and decisions is an explicit part of the final capstone assessment.',
   '[{"id":"true","text":"True"},{"id":"false","text":"False"}]',
   'true', 'Understanding, not just producing working code, is one of the graded criteria for the capstone.'),
  (8, 4, 'mcq', 'Which of these best describes system design in the context of a capstone project?',
   '[{"id":"a","text":"Choosing a font"},{"id":"b","text":"Planning the overall architecture: how frontend, backend, and database components interact"},{"id":"c","text":"Writing the README only"},{"id":"d","text":"Picking a project name"}]',
   'b', 'System design is the high-level plan for how the moving parts of the application fit together.'),
  (8, 5, 'mcq', 'What should happen before you consider a capstone project done?',
   '[{"id":"a","text":"Only that it runs on your own machine"},{"id":"b","text":"It should be built, tested, documented, and deployed so others can access and understand it"},{"id":"c","text":"Only that the code is pushed to GitHub, regardless of whether it runs"},{"id":"d","text":"Only that the UI looks good"}]',
   'b', 'A finished capstone is built, tested, documented, and deployed, not just functional on one machine.'),
  (8, 6, 'scenario', 'During your capstone presentation, an assessor asks why you chose MySQL over storing data in a plain text file. What is the strongest answer?',
   '[{"id":"a","text":"I am not sure, I just used it because everyone else did"},{"id":"b","text":"A relational database enforces structure, supports relationships and queries, and handles concurrent access reliably, which plain text files handle poorly"},{"id":"c","text":"Text files are actually better but there was not enough time"},{"id":"d","text":"It does not matter which one was chosen"}]',
   'b', 'Being able to justify a technical decision with real reasoning is exactly what the capstone assessment is looking for.')
) as v(week_number, question_order, question_type, question_text, options, correct_answer, explanation) on v.week_number = w.week_number
on conflict (quiz_id, question_order) do nothing;

-- =========================================================================
-- Resources (program-wide; admins can add week-scoped resources via the admin UI)
-- =========================================================================

insert into public.masterclass_resources (program_id, week_id, title, description, resource_type, url, visibility, resource_order)
select p.id, null, v.title, v.description, v.resource_type, v.url, v.visibility, v.resource_order
from public.masterclass_programs p, (values
  (1, 'Cohort WhatsApp Community', 'Join the cohort community group for announcements, peer support, and study groups.', 'link', 'https://wa.me/254715674828', 'public'),
  (2, 'Program Overview and Curriculum', 'The full public program page with the week-by-week curriculum breakdown.', 'link', '/courses/web-development-masterclass', 'public')
) as v(resource_order, title, description, resource_type, url, visibility)
where p.slug = 'web-development-masterclass'
on conflict (program_id, title) do nothing;
