import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronLeft, ChevronRight, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const generateQuestions = () => {
  const domains = ['Frontend', 'Backend', 'Data Science', 'DevOps', 'Cybersecurity', 'Mobile', 'Cloud', 'AI/ML', 'UI/UX', 'Blockchain'];
  const questions = [];
  for (let i = 0; i < 100; i++) {
    const domain = domains[i % domains.length];
    questions.push({
      id: i + 1,
      question: `[${domain}] Question ${i + 1}: Which of the following best describes your interest in ${domain.toLowerCase()} technologies?`,
      options: [
        `I actively build ${domain.toLowerCase()} projects`,
        `I'm curious and want to learn more`,
        `I have some exposure but prefer other areas`,
        `Not my area of interest`,
      ],
      scores: [3, 2, 1, 0],
      domain,
    });
  }
  return questions;
};

const questions = generateQuestions();

const QuizPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const current = questions[currentIndex];
  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  const selectAnswer = (optionIndex) => {
    setAnswers({ ...answers, [current.id]: optionIndex });
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const finishQuiz = () => {
    setShowResult(true);
  };

  const restart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setShowResult(false);
  };

  const getResults = () => {
    const domainScores: Record<string, number> = {};
    questions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        if (!domainScores[q.domain]) domainScores[q.domain] = 0;
        domainScores[q.domain] += q.scores[answers[q.id]];
      }
    });
    return Object.entries(domainScores)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .map(([domain, score]) => ({ domain, score: score as number, max: 30 }));
  };

  if (showResult) {
    const results = getResults();
    const topDomain = results[0];
    const totalAnswered = Object.keys(answers).length;
    const totalScore = results.reduce((acc, r) => acc + r.score, 0);

    return (
      <Layout>
        <div className="section-container py-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-glow-gradient flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground mb-6">
              You answered {totalAnswered} of {questions.length} questions
            </p>
            <div className="glass-card p-6 mb-6 inline-block">
              <p className="text-sm text-muted-foreground mb-1">Your Best Domain Match</p>
              <p className="text-2xl font-bold gradient-text">{topDomain?.domain || 'N/A'}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
              {results.slice(0, 5).map((r, i) => (
                <div key={r.domain} className="glass-card p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{r.domain}</p>
                  <p className="text-lg font-bold text-primary">{r.score}</p>
                </div>
              ))}
            </div>
            <Button onClick={restart} className="glow-button text-white border-0">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-container py-10 max-w-3xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Domain Quiz</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Discover Your <span className="gradient-text">Perfect Domain</span></h1>
        </motion.div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentIndex + 1} / {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-glow-gradient rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 mb-6"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              {current.domain}
            </span>
            <h2 className="text-lg font-semibold mb-6">{current.question}</h2>
            <div className="space-y-3">
              {current.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => selectAnswer(idx)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    answers[current.id] === idx
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/30 hover:bg-secondary/50'
                  }`}
                >
                  <span className="text-sm">{option}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button onClick={goPrev} disabled={currentIndex === 0} variant="outline" className="glow-button-secondary">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          {currentIndex === questions.length - 1 ? (
            <Button onClick={finishQuiz} className="glow-button text-white border-0">
              Finish Quiz
              <Trophy className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={goNext} className="glow-button text-white border-0">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QuizPage;
