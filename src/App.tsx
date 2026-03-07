import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AppProvider } from "@/contexts/AppContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Index from "./pages/Index";
import DomainsPage from "./pages/DomainsPage";
import RoadmapsPage from "./pages/RoadmapsPage";
import RoadmapGeneratorPage from "./pages/RoadmapGeneratorPage";
import CoursesPage from "./pages/CoursesPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import SkillGapPage from "./pages/SkillGapPage";

import PlannerPage from "./pages/PlannerPage";
import HelpPage from "./pages/HelpPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import PuzzlesPage from "./pages/PuzzlesPage";
import JokesPage from "./pages/JokesPage";
import MockInterviewPage from "./pages/MockInterviewPage";
import DashboardPage from "./pages/DashboardPage";
import DsaArenaPage from "./pages/DsaArenaPage";
import AptitudePage from "./pages/AptitudePage";
import AdminPage from "./pages/AdminPage";
import JobSearchPage from "./pages/JobSearchPage";
import DocumentAIPage from "./pages/DocumentAIPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/domains" element={<DomainsPage />} />
            <Route path="/roadmaps" element={<RoadmapsPage />} />
            <Route path="/roadmap-generator" element={<RoadmapGeneratorPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>} />
            <Route path="/skill-gap" element={<ProtectedRoute><SkillGapPage /></ProtectedRoute>} />
            
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/puzzles" element={<PuzzlesPage />} />
            <Route path="/jokes" element={<JokesPage />} />
            <Route path="/mock-interview" element={<ProtectedRoute><MockInterviewPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/dsa-arena" element={<ProtectedRoute><DsaArenaPage /></ProtectedRoute>} />
            <Route path="/aptitude" element={<ProtectedRoute><AptitudePage /></ProtectedRoute>} />
            <Route path="/job-search" element={<ProtectedRoute><JobSearchPage /></ProtectedRoute>} />
            <Route path="/document-ai" element={<ProtectedRoute><DocumentAIPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
