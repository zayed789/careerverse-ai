import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laugh, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const techJokes = [
  { setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs.' },
  { setup: 'Why was the JavaScript developer sad?', punchline: 'Because he didn\'t Node how to Express himself.' },
  { setup: 'How many programmers does it take to change a light bulb?', punchline: 'None. That\'s a hardware problem.' },
  { setup: 'Why do Java developers wear glasses?', punchline: 'Because they can\'t C#.' },
  { setup: 'What\'s a programmer\'s favorite hangout place?', punchline: 'Foo Bar.' },
  { setup: 'Why did the developer go broke?', punchline: 'Because he used up all his cache.' },
  { setup: 'What\'s the object-oriented way to become wealthy?', punchline: 'Inheritance.' },
  { setup: 'Why do programmers always mix up Halloween and Christmas?', punchline: 'Because Oct 31 == Dec 25.' },
  { setup: 'A SQL query walks into a bar, approaches two tables and asks...', punchline: '"Can I join you?"' },
  { setup: 'What\'s a programmer\'s favorite song?', punchline: '"Every Breath You Take" by The Police — it\'s about monitoring.' },
  { setup: '!false', punchline: 'It\'s funny because it\'s true.' },
  { setup: 'Why did the functions stop calling each other?', punchline: 'Because they got into too many arguments.' },
  { setup: 'What did the server say to the browser?', punchline: '"HTTP 200 — everything is OK between us."' },
  { setup: 'Why was the computer cold?', punchline: 'It left its Windows open.' },
  { setup: 'How does a computer get drunk?', punchline: 'It takes screenshots.' },
  { setup: 'Why did the programmer quit his job?', punchline: 'Because he didn\'t get arrays (a raise).' },
  { setup: 'What is a ghost\'s favorite data type?', punchline: 'Boo-lean.' },
  { setup: 'There are only 10 kinds of people in this world:', punchline: 'Those who understand binary and those who don\'t.' },
  { setup: 'What did the router say to the doctor?', punchline: '"It hurts when IP."' },
  { setup: 'Why do backend developers make bad comedians?', punchline: 'Their jokes never get a good response.' },
];

// Generate 100 jokes by cycling through templates
const allJokes = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  ...techJokes[i % techJokes.length],
}));

const JokesPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPunchline, setShowPunchline] = useState(false);

  const current = allJokes[currentIndex];

  const goNext = () => {
    if (currentIndex < allJokes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowPunchline(false);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowPunchline(false);
    }
  };

  const randomJoke = () => {
    let next;
    do {
      next = Math.floor(Math.random() * allJokes.length);
    } while (next === currentIndex);
    setCurrentIndex(next);
    setShowPunchline(false);
  };

  return (
    <Layout>
      <div className="section-container py-10 max-w-3xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <Laugh className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Tech Jokes</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Developer <span className="gradient-text">Humor</span></h1>
          <p className="text-muted-foreground">Take a break with 100 curated tech jokes</p>
        </motion.div>

        {/* Counter */}
        <div className="text-center text-sm text-muted-foreground mb-6">
          Joke {currentIndex + 1} / {allJokes.length}
        </div>

        {/* Joke Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 mb-6 text-center min-h-[250px] flex flex-col items-center justify-center"
          >
            <h2 className="text-xl font-semibold mb-6 leading-relaxed">{current.setup}</h2>

            {!showPunchline ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowPunchline(true)}
                  className="glow-button text-white border-0"
                >
                  Reveal Punchline 😄
                </Button>
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-primary font-medium"
              >
                {current.punchline}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button onClick={goPrev} disabled={currentIndex === 0} variant="outline" className="glow-button-secondary">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={randomJoke} variant="outline" className="glow-button-secondary">
            <Shuffle className="w-4 h-4 mr-2" />
            Random
          </Button>
          <Button onClick={goNext} disabled={currentIndex === allJokes.length - 1} className="glow-button text-white border-0">
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default JokesPage;
