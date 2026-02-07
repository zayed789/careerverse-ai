import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Puzzle, ChevronLeft, ChevronRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const generatePuzzles = () => {
  const categories = ['Logic', 'Pattern', 'Algorithm', 'Debugging', 'Architecture'];
  const puzzles = [];
  const templates = [
    { q: 'What is the output of: console.log(typeof null)?', a: '"object" — This is a well-known JavaScript quirk. typeof null returns "object" due to a legacy bug in the language specification.' },
    { q: 'A function calls itself. What is this technique called?', a: 'Recursion — A function that calls itself to solve smaller subproblems until reaching a base case.' },
    { q: 'What is the time complexity of binary search?', a: 'O(log n) — Binary search halves the search space with each comparison.' },
    { q: 'You have 8 identical-looking balls. One is heavier. Find it in 2 weighings.', a: 'Divide into groups of 3-3-2. Weigh first two groups. The heavier group (or remaining) contains the ball. One more weighing identifies it.' },
    { q: 'What does SOLID stand for in software design?', a: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion — Five principles for maintainable OOP.' },
  ];

  for (let i = 0; i < 100; i++) {
    const template = templates[i % templates.length];
    const cat = categories[i % categories.length];
    puzzles.push({
      id: i + 1,
      category: cat,
      puzzle: `[${cat} #${i + 1}] ${template.q}`,
      answer: template.a,
    });
  }
  return puzzles;
};

const puzzles = generatePuzzles();

const PuzzlesPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const current = puzzles[currentIndex];
  const completedCount = Object.keys(revealed).length;
  const progress = (completedCount / puzzles.length) * 100;

  const toggleReveal = () => {
    setRevealed({ ...revealed, [current.id]: !revealed[current.id] });
  };

  const goNext = () => {
    if (currentIndex < puzzles.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <Layout>
      <div className="section-container py-10 max-w-3xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <Puzzle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Domain Puzzles</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Sharpen Your <span className="gradient-text">Problem Solving</span></h1>
          <p className="text-muted-foreground">Challenge yourself with 100 logical puzzles</p>
        </motion.div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Puzzle {currentIndex + 1} / {puzzles.length}</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              {completedCount} revealed
            </span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-glow-gradient rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Puzzle Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 mb-6"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 mb-4">
              {current.category}
            </span>
            <h2 className="text-lg font-semibold mb-6">{current.puzzle}</h2>

            <Button
              onClick={toggleReveal}
              variant="outline"
              className="glow-button-secondary mb-4"
            >
              {revealed[current.id] ? (
                <><EyeOff className="w-4 h-4 mr-2" /> Hide Answer</>
              ) : (
                <><Eye className="w-4 h-4 mr-2" /> Reveal Answer</>
              )}
            </Button>

            <AnimatePresence>
              {revealed[current.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-foreground leading-relaxed">{current.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button onClick={goPrev} disabled={currentIndex === 0} variant="outline" className="glow-button-secondary">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={goNext} disabled={currentIndex === puzzles.length - 1} className="glow-button text-white border-0">
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PuzzlesPage;
