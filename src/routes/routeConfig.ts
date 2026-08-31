export interface NavLinkItem {
  label: string;
  path: string;
}

export const routes = {
  public: {
    home: "/",
    about: "/about",
    courses: "/courses",
    lms: "/lms",
    webinars: "/webinars",
    articles: "/articles",
    tipsLegacy: "/tips",
    customTraining: "/custom-training",
    community: "/community",
    contact: "/contact",
    privacyPolicy: "/privacy-policy",
    terms: "/terms",
    termsOfServiceLegacy: "/terms-of-service",
    editorialPolicy: "/editorial-policy",
    article: (slug: string) => `/articles/${slug}`,
    course: (slug: string) => `/courses/${slug}`,
    event: (slug: string) => `/events/${slug}`,
  },
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
  },
  student: {
    dashboard: "/dashboard",
    overview: "/dashboard/overview",
    progress: "/dashboard/progress",
    myCourses: "/dashboard/my-courses",
    payments: "/dashboard/payments",
    assignments: "/dashboard/assignments",
    certificates: "/dashboard/certificates",
    webinars: "/dashboard/webinars",
    notifications: "/dashboard/notifications",
    resources: "/dashboard/resources",
    support: "/dashboard/support",
    profile: "/dashboard/profile",
    settings: "/dashboard/settings",
    learn: (courseSlug: string) => `/dashboard/learn/${courseSlug}`,
    payment: (courseSlug: string) => `/payment/${courseSlug}`,
  },
  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    students: "/admin/students",
    courses: "/admin/courses",
    payments: "/admin/payments",
    support: "/admin/support",
    finance: "/admin/finance",
    webinars: "/admin/webinars",
    articles: "/admin/articles",
    settings: "/admin/settings",
    content: "/admin/content",
    lmsControl: "/admin/lms-control",
  },
  legacy: {
    myCourses: "/my-courses",
    learn: (courseSlug: string) => `/learn/${courseSlug}`,
  },
} as const;

export const publicNavLinks: NavLinkItem[] = [
  { label: "Home", path: routes.public.home },
  { label: "Courses", path: routes.public.courses },
  { label: "Webinars", path: routes.public.webinars },
  { label: "Articles", path: routes.public.articles },
  { label: "Custom Training", path: routes.public.customTraining },
  { label: "About", path: routes.public.about },
  { label: "Contact", path: routes.public.contact },
];

export const footerQuickLinks: NavLinkItem[] = [
  { label: "Home", path: routes.public.home },
  { label: "Courses", path: routes.public.courses },
  { label: "Webinars", path: routes.public.webinars },
  { label: "Articles", path: routes.public.articles },
  { label: "Custom Training", path: routes.public.customTraining },
];

export const footerResourceLinks: NavLinkItem[] = [
  { label: "About Lucky", path: routes.public.about },
  { label: "Contact Us", path: routes.public.contact },
  { label: "Privacy Policy", path: routes.public.privacyPolicy },
  { label: "Terms", path: routes.public.terms },
  { label: "Editorial Policy", path: routes.public.editorialPolicy },
];
