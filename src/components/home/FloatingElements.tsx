import { motion } from 'framer-motion';
import { Code2, Terminal, Braces, Database, Cloud, Cpu } from 'lucide-react';

const codeSnippets = [
  { code: 'const career = await ai.plan();', delay: 0 },
  { code: 'function buildFuture() { }', delay: 0.5 },
  { code: 'import { success } from "you";', delay: 1 },
  { code: '<Developer skills={["all"]} />', delay: 1.5 },
  { code: 'git push origin success', delay: 2 },
];

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating code snippets */}
      {codeSnippets.map((snippet, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: [0, 0.6, 0.6, 0],
            y: [50, -20, -40, -100],
          }}
          transition={{
            duration: 8,
            delay: snippet.delay + index * 2,
            repeat: Infinity,
            repeatDelay: 10,
          }}
          className="absolute glass-card px-4 py-2 text-sm font-mono text-primary/80"
          style={{
            left: `${15 + index * 18}%`,
            top: `${60 + (index % 3) * 10}%`,
          }}
        >
          {snippet.code}
        </motion.div>
      ))}

      {/* Floating terminal windows */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          y: [0, -15, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-[10%] glass-card p-4 w-64 hidden lg:block"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-destructive/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="font-mono text-xs text-muted-foreground space-y-1">
          <div><span className="text-green-400">$</span> npm run career</div>
          <div className="text-primary">✓ Skills analyzed</div>
          <div className="text-primary">✓ Roadmap generated</div>
          <div className="text-green-400">→ Success loading...</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          y: [0, -20, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-32 right-[8%] glass-card p-4 w-56 hidden lg:block"
      >
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium">AI Analysis</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">React</span>
            <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '90%' }}
                transition={{ duration: 2, delay: 3 }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">TypeScript</span>
            <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 2, delay: 3.2 }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Node.js</span>
            <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 2, delay: 3.4 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating icons */}
      {[
        { Icon: Code2, position: { top: '15%', left: '20%' }, delay: 0 },
        { Icon: Braces, position: { top: '25%', right: '25%' }, delay: 1 },
        { Icon: Database, position: { bottom: '30%', left: '15%' }, delay: 2 },
        { Icon: Cloud, position: { top: '40%', right: '12%' }, delay: 3 },
        { Icon: Cpu, position: { bottom: '25%', right: '20%' }, delay: 4 },
      ].map(({ Icon, position, delay }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [0.8, 1, 0.8],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 5,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute hidden md:block"
          style={position}
        >
          <div className="glass-card p-3 rounded-xl">
            <Icon className="w-6 h-6 text-primary/60" />
          </div>
        </motion.div>
      ))}

      {/* Silhouette coders - subtle gradient shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-0 left-[5%] hidden xl:block"
      >
        <div className="w-32 h-48 bg-gradient-to-t from-primary/30 to-transparent rounded-t-full blur-sm" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-0 right-[8%] hidden xl:block"
      >
        <div className="w-28 h-44 bg-gradient-to-t from-accent/30 to-transparent rounded-t-full blur-sm" />
      </motion.div>
    </div>
  );
};

export default FloatingElements;
