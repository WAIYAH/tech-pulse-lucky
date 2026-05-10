import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
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
import LMSLanding from "./pages/lms/LMSLanding";
import Courses from "./pages/lms/Courses";
import CourseDetails from "./pages/lms/CourseDetails";
import PaymentPage from "./pages/lms/PaymentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
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
                <Route path="/lms" element={<LMSLanding />} />
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
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
