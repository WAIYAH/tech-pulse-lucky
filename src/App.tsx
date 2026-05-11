import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import GlobalPageBackground from "./components/GlobalPageBackground";
import GlobalShowcaseSection from "./components/GlobalShowcaseSection";
import AuthRoute from "./components/lms/AuthRoute";
import ProtectedRoute from "./components/lms/ProtectedRoute";
import AdminRoute from "./components/lms/AdminRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Tips from "./pages/Tips";
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
import StudentDashboard from "./pages/lms/StudentDashboard";
import MyCourses from "./pages/lms/MyCourses";
import LearnCourse from "./pages/lms/LearnCourse";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminUsers from "./pages/admin/AdminUsers";
import Courses from "./pages/lms/Courses";
import CourseDetails from "./pages/lms/CourseDetails";
import PaymentPage from "./pages/lms/PaymentPage";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/tips" element={<Tips />} />
    <Route path="/articles" element={<Articles />} />
    <Route path="/articles/:slug" element={<ArticleDetail />} />
    <Route path="/webinars" element={<Webinars />} />
    <Route path="/events/:eventSlug" element={<EventDetails />} />
    <Route path="/custom-training" element={<CustomTraining />} />
    <Route path="/community" element={<Community />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />
    <Route path="/editorial-policy" element={<EditorialPolicy />} />
    <Route path="/lms" element={<Navigate to="/courses" replace />} />
    <Route path="/courses" element={<Courses />} />
    <Route path="/courses/:slug" element={<CourseDetails />} />
    <Route
      path="/login"
      element={
        <AuthRoute>
          <Login />
        </AuthRoute>
      }
    />
    <Route
      path="/register"
      element={
        <AuthRoute>
          <Register />
        </AuthRoute>
      }
    />
    <Route
      path="/forgot-password"
      element={
        <AuthRoute>
          <ForgotPassword />
        </AuthRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/my-courses"
      element={
        <ProtectedRoute>
          <MyCourses />
        </ProtectedRoute>
      }
    />
    <Route
      path="/learn/:courseSlug"
      element={
        <ProtectedRoute>
          <LearnCourse />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payment/:courseSlug"
      element={
        <ProtectedRoute>
          <PaymentPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      }
    />
    <Route
      path="/admin/payments"
      element={
        <AdminRoute>
          <AdminPayments />
        </AdminRoute>
      }
    />
    <Route
      path="/admin/courses"
      element={
        <AdminRoute>
          <AdminCourses />
        </AdminRoute>
      }
    />
    <Route
      path="/admin/users"
      element={
        <AdminRoute>
          <AdminUsers />
        </AdminRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const AppShell = () => {
  const location = useLocation();
  const path = location.pathname;

  const hideShowcaseSection =
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password" ||
    path.startsWith("/admin") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/my-courses") ||
    path.startsWith("/learn/") ||
    path.startsWith("/payment/");

  return (
    <div className="relative z-0 flex flex-col min-h-screen overflow-x-clip">
      <GlobalPageBackground />
      <Navbar />
      <main className="relative z-10 flex-grow">
        <AppRoutes />
      </main>
      {!hideShowcaseSection && <GlobalShowcaseSection />}
      <Footer />
      <WhatsAppButton />
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
