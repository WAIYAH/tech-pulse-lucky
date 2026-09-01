import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import GlobalPageBackground from "./components/GlobalPageBackground";
import GlobalShowcaseSection from "./components/GlobalShowcaseSection";
import ScrollToTopOnNavigate from "./components/ScrollToTopOnNavigate";
import BackToTopButton from "./components/BackToTopButton";
import CookieConsentBanner from "./components/CookieConsentBanner";
import ContentProtection from "./components/ContentProtection";
import SessionSecurityGuard from "./components/security/SessionSecurityGuard";
import AuthRoute from "./components/lms/AuthRoute";
import ProtectedRoute from "./components/lms/ProtectedRoute";
import AdminRoute from "./components/lms/AdminRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Webinars from "./pages/Webinars";
import EventDetails from "./pages/EventDetails";
import CustomTraining from "./pages/CustomTraining";
import Community from "./pages/Community";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import EditorialPolicy from "./pages/EditorialPolicy";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import LearnCourse from "./pages/lms/LearnCourse";
import Courses from "./pages/lms/Courses";
import CourseDetails from "./pages/lms/CourseDetails";
import PaymentPage from "./pages/lms/PaymentPage";
import LMSLanding from "./pages/lms/LMSLanding";
import MasterclassLanding from "./pages/lms/MasterclassLanding";
import AdminLayout from "./pages/admin/system/AdminLayout";
import AdminOverviewPage from "./pages/admin/system/AdminOverviewPage";
import AdminStudentsPage from "./pages/admin/system/AdminStudentsPage";
import AdminCoursesPage from "./pages/admin/system/AdminCoursesPage";
import AdminPaymentsPage from "./pages/admin/system/AdminPaymentsPage";
import AdminFinancePage from "./pages/admin/system/AdminFinancePage";
import AdminContentPage from "./pages/admin/system/AdminContentPage";
import AdminLmsControlPage from "./pages/admin/system/AdminLmsControlPage";
import AdminSettingsPage from "./pages/admin/system/AdminSettingsPage";
import AdminWebinarsPage from "./pages/admin/system/AdminWebinarsPage";
import AdminArticlesPage from "./pages/admin/system/AdminArticlesPage";
import { StudentPortalProvider } from "./pages/student/system/StudentPortalContext";
import StudentPortalLayout from "./pages/student/system/StudentPortalLayout";
import StudentOverviewPage from "./pages/student/system/StudentOverviewPage";
import StudentProgressPage from "./pages/student/system/StudentProgressPage";
import StudentCoursesPage from "./pages/student/system/StudentCoursesPage";
import StudentBrowseCoursesPage from "./pages/student/system/StudentBrowseCoursesPage";
import StudentPaymentsPage from "./pages/student/system/StudentPaymentsPage";
import StudentAssignmentsPage from "./pages/student/system/StudentAssignmentsPage";
import StudentCertificatesPage from "./pages/student/system/StudentCertificatesPage";
import StudentWebinarsPage from "./pages/student/system/StudentWebinarsPage";
import StudentNotificationsPage from "./pages/student/system/StudentNotificationsPage";
import StudentResourcesPage from "./pages/student/system/StudentResourcesPage";
import StudentSupportPage from "./pages/student/system/StudentSupportPage";
import StudentProfilePage from "./pages/student/system/StudentProfilePage";
import StudentSettingsPage from "./pages/student/system/StudentSettingsPage";
import AdminSupportPage from "./pages/admin/system/AdminSupportPage";
import AdminMasterclassLayout from "./pages/admin/system/masterclass/AdminMasterclassLayout";
import { MasterclassStudentProvider } from "./pages/student/system/masterclass/MasterclassStudentProvider";
import StudentMasterclassOverviewPage from "./pages/student/system/masterclass/StudentMasterclassOverviewPage";
import StudentMasterclassWeekPage from "./pages/student/system/masterclass/StudentMasterclassWeekPage";
import StudentMasterclassFinalProjectPage from "./pages/student/system/masterclass/StudentMasterclassFinalProjectPage";
import { routes } from "./routes/routeConfig";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path={routes.public.home} element={<Home />} />
    <Route path={routes.public.tipsLegacy} element={<Navigate to={routes.public.articles} replace />} />
    <Route path={routes.public.articles} element={<Articles />} />
    <Route path="/articles/:slug" element={<ArticleDetail />} />
    <Route path={routes.public.webinars} element={<Webinars />} />
    <Route path="/events/:eventSlug" element={<EventDetails />} />
    <Route path={routes.public.customTraining} element={<CustomTraining />} />
    <Route path={routes.public.community} element={<Community />} />
    <Route path={routes.public.about} element={<About />} />
    <Route path={routes.public.contact} element={<Contact />} />
    <Route path={routes.public.privacyPolicy} element={<PrivacyPolicy />} />
    <Route path={routes.public.terms} element={<TermsOfService />} />
    <Route
      path={routes.public.termsOfServiceLegacy}
      element={<Navigate to={routes.public.terms} replace />}
    />
    <Route path={routes.public.editorialPolicy} element={<EditorialPolicy />} />
    <Route path={routes.public.lms} element={<LMSLanding />} />
    <Route path={routes.public.courses} element={<Courses />} />
    <Route path={routes.public.masterclass} element={<MasterclassLanding />} />
    <Route path="/courses/:slug" element={<CourseDetails />} />
    <Route
      path={routes.auth.login}
      element={
        <AuthRoute>
          <Login />
        </AuthRoute>
      }
    />
    <Route
      path={routes.auth.register}
      element={
        <AuthRoute>
          <Register />
        </AuthRoute>
      }
    />
    <Route
      path={routes.auth.forgotPassword}
      element={
        <AuthRoute>
          <ForgotPassword />
        </AuthRoute>
      }
    />
    <Route
      path={routes.student.dashboard}
      element={
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentPortalProvider>
            <StudentPortalLayout />
          </StudentPortalProvider>
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to={routes.student.overview} replace />} />
      <Route path="overview" element={<StudentOverviewPage />} />
      <Route path="progress" element={<StudentProgressPage />} />
      <Route path="courses" element={<Navigate to={routes.student.myCourses} replace />} />
      <Route path="my-courses" element={<StudentCoursesPage />} />
      <Route path="browse-courses" element={<StudentBrowseCoursesPage />} />
      <Route path="learn/:courseSlug" element={<LearnCourse />} />
      <Route path="payments" element={<StudentPaymentsPage />} />
      <Route path="assignments" element={<StudentAssignmentsPage />} />
      <Route path="certificates" element={<StudentCertificatesPage />} />
      <Route path="webinars" element={<StudentWebinarsPage />} />
      <Route path="notifications" element={<StudentNotificationsPage />} />
      <Route path="resources" element={<StudentResourcesPage />} />
      <Route path="support" element={<StudentSupportPage />} />
      <Route path="profile" element={<StudentProfilePage />} />
      <Route path="settings" element={<StudentSettingsPage />} />
      <Route
        path="masterclass"
        element={
          <MasterclassStudentProvider>
            <Outlet />
          </MasterclassStudentProvider>
        }
      >
        <Route index element={<StudentMasterclassOverviewPage />} />
        <Route path="week/:weekNumber" element={<StudentMasterclassWeekPage />} />
        <Route path="final-project" element={<StudentMasterclassFinalProjectPage />} />
      </Route>
    </Route>
    <Route
      path={routes.legacy.myCourses}
      element={
        <ProtectedRoute allowedRoles={["student"]}>
          <Navigate to={routes.student.myCourses} replace />
        </ProtectedRoute>
      }
    />
    <Route
      path="/learn/:courseSlug"
      element={
        <ProtectedRoute allowedRoles={["student"]}>
          <LearnCourse />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payment/:courseSlug"
      element={
        <ProtectedRoute allowedRoles={["student"]}>
          <PaymentPage />
        </ProtectedRoute>
      }
    />
    <Route
      path={routes.admin.root}
      element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }
    >
      <Route index element={<AdminOverviewPage />} />
      <Route path="students" element={<AdminStudentsPage />} />
      <Route path="courses" element={<AdminCoursesPage />} />
      <Route path="payments" element={<AdminPaymentsPage />} />
      <Route path="support" element={<AdminSupportPage />} />
      <Route path="masterclass" element={<AdminMasterclassLayout />} />
      <Route path="finance" element={<AdminFinancePage />} />
      <Route path="webinars" element={<AdminWebinarsPage />} />
      <Route path="articles" element={<AdminArticlesPage />} />
      <Route path="content" element={<AdminContentPage />} />
      <Route path="lms-control" element={<AdminLmsControlPage />} />
      <Route path="settings" element={<AdminSettingsPage />} />
      <Route path="users" element={<Navigate to={routes.admin.students} replace />} />
      <Route path="dashboard" element={<Navigate to={routes.admin.root} replace />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const AppShell = () => {
  const location = useLocation();
  const path = location.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isStudentPortalRoute = path.startsWith("/dashboard");
  const isPortalRoute = isAdminRoute || isStudentPortalRoute;
  const isAuthRoute =
    path === routes.auth.login ||
    path === routes.auth.register ||
    path === routes.auth.forgotPassword;

  useEffect(() => {
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }

    if (isPortalRoute || isAuthRoute || path.startsWith("/learn/") || path.startsWith("/payment/")) {
      robots.setAttribute("content", "noindex, nofollow, max-image-preview:none");
      return;
    }

    robots.setAttribute(
      "content",
      "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    );
  }, [isAuthRoute, isPortalRoute, path]);

  const hideShowcaseSection =
    isAuthRoute ||
    isPortalRoute ||
    path.startsWith(routes.student.dashboard) ||
    path.startsWith(routes.legacy.myCourses) ||
    path.startsWith("/learn/") ||
    path.startsWith("/payment/");

  return (
    <div className="relative z-0 flex flex-col min-h-screen overflow-x-clip">
      <ScrollToTopOnNavigate />
      <GlobalPageBackground />
      <ContentProtection />
      <SessionSecurityGuard />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground focus:shadow-lg"
      >
        Skip to main content
      </a>
      {!isPortalRoute && <Navbar />}
      <main id="main-content" className="relative z-10 flex-grow">
        <AppRoutes />
      </main>
      {!isPortalRoute && !hideShowcaseSection && <GlobalShowcaseSection />}
      {!isPortalRoute && <Footer />}
      {!isPortalRoute && <BackToTopButton />}
      {!isPortalRoute && <WhatsAppButton />}
      {!isPortalRoute && <CookieConsentBanner />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
