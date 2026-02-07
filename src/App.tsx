import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import DomainsPage from "./pages/DomainsPage";
import RoadmapsPage from "./pages/RoadmapsPage";
import RoadmapGeneratorPage from "./pages/RoadmapGeneratorPage";
import CoursesPage from "./pages/CoursesPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import SkillGapPage from "./pages/SkillGapPage";
import TrendsPage from "./pages/TrendsPage";
import PlannerPage from "./pages/PlannerPage";
import HelpPage from "./pages/HelpPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import PuzzlesPage from "./pages/PuzzlesPage";
import JokesPage from "./pages/JokesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/domains" element={<DomainsPage />} />
            <Route path="/roadmaps" element={<RoadmapsPage />} />
            <Route path="/roadmap-generator" element={<RoadmapGeneratorPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/resume-builder" element={<ResumeBuilderPage />} />
            <Route path="/skill-gap" element={<SkillGapPage />} />
            <Route path="/trends" element={<TrendsPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/puzzles" element={<PuzzlesPage />} />
            <Route path="/jokes" element={<JokesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
