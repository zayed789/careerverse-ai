import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Code2, Play, CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  constraints: string[];
  exampleInput: string;
  exampleOutput: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const problems: Problem[] = [
  // Easy
  {
    id: 'easy-1',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', '-10⁹ ≤ target ≤ 10⁹', 'Only one valid answer exists.'],
    exampleInput: 'nums = [2, 7, 11, 15], target = 9',
    exampleOutput: '[0, 1]',
    difficulty: 'easy',
  },
  {
    id: 'easy-2',
    title: 'Reverse String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters.',
    constraints: ['1 ≤ s.length ≤ 10⁵', 'Must be done in-place with O(1) extra memory.'],
    exampleInput: 's = ["h","e","l","l","o"]',
    exampleOutput: '["o","l","l","e","h"]',
    difficulty: 'easy',
  },
  {
    id: 'easy-3',
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only \'()[]{}\''],
    exampleInput: 's = "([])"',
    exampleOutput: 'true',
    difficulty: 'easy',
  },
  // Medium
  {
    id: 'medium-1',
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    constraints: ['0 ≤ s.length ≤ 5 × 10⁴', 's consists of English letters, digits, symbols, and spaces.'],
    exampleInput: 's = "abcabcbb"',
    exampleOutput: '3',
    difficulty: 'medium',
  },
  {
    id: 'medium-2',
    title: 'Container With Most Water',
    description: 'Given n non-negative integers a₁, a₂, ..., aₙ where each represents a point at coordinate (i, aᵢ), find two lines that together with the x-axis form a container that holds the most water.',
    constraints: ['n == height.length', '2 ≤ n ≤ 10⁵', '0 ≤ height[i] ≤ 10⁴'],
    exampleInput: 'height = [1,8,6,2,5,4,8,3,7]',
    exampleOutput: '49',
    difficulty: 'medium',
  },
  {
    id: 'medium-3',
    title: '3Sum',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i ≠ j ≠ k and nums[i] + nums[j] + nums[k] == 0.',
    constraints: ['3 ≤ nums.length ≤ 3000', '-10⁵ ≤ nums[i] ≤ 10⁵'],
    exampleInput: 'nums = [-1, 0, 1, 2, -1, -4]',
    exampleOutput: '[[-1, -1, 2], [-1, 0, 1]]',
    difficulty: 'medium',
  },
  // Hard
  {
    id: 'hard-1',
    title: 'Merge K Sorted Lists',
    description: 'You are given an array of k linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    constraints: ['k == lists.length', '0 ≤ k ≤ 10⁴', '0 ≤ lists[i].length ≤ 500', '-10⁴ ≤ lists[i][j] ≤ 10⁴'],
    exampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]',
    exampleOutput: '[1,1,2,3,4,4,5,6]',
    difficulty: 'hard',
  },
  {
    id: 'hard-2',
    title: 'Trapping Rain Water',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    constraints: ['n == height.length', '1 ≤ n ≤ 2 × 10⁴', '0 ≤ height[i] ≤ 10⁵'],
    exampleInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
    exampleOutput: '6',
    difficulty: 'hard',
  },
  {
    id: 'hard-3',
    title: 'Minimum Window Substring',
    description: 'Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.',
    constraints: ['1 ≤ s.length, t.length ≤ 10⁵', 's and t consist of uppercase and lowercase English letters.'],
    exampleInput: 's = "ADOBECODEBANC", t = "ABC"',
    exampleOutput: '"BANC"',
    difficulty: 'hard',
  },
];

const difficultyConfig = {
  easy: { label: 'Easy', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  medium: { label: 'Medium', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  hard: { label: 'Hard', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const ProblemCard = ({ problem }: { problem: Problem }) => {
  const [code, setCode] = useState('// Write your solution here\nfunction solve() {\n  \n}');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number } | null>(null);
  const { user } = useAuth() as any;
  const { updateScore } = useAppContext();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('https://testcase6788.app.n8n.cloud/webhook-test/dsa-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          problem_id: problem.id,
          difficulty: problem.difficulty,
          user_id: user?.id || 'anonymous',
        }),
      });

      if (!res.ok) throw new Error('Evaluation failed');
      const data = await res.json();
      const score = Array.isArray(data) ? data[0]?.dsa_score ?? 0 : data.dsa_score ?? 0;
      setResult({ score });
      updateScore('dsa', score);
      toast({ title: 'Submitted!', description: `DSA Score: ${score}/100` });
    } catch {
      toast({ title: 'Error', description: 'Could not reach evaluation server. Try again later.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const config = difficultyConfig[problem.difficulty];

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{problem.title}</h3>
        <Badge variant="outline" className={config.color}>{config.label}</Badge>
      </div>

      <p className="text-sm text-muted-foreground">{problem.description}</p>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Constraints</h4>
        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
          {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg bg-secondary/50 p-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input</span>
          <pre className="text-xs text-foreground mt-1 whitespace-pre-wrap font-mono">{problem.exampleInput}</pre>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output</span>
          <pre className="text-xs text-foreground mt-1 whitespace-pre-wrap font-mono">{problem.exampleOutput}</pre>
        </div>
      </div>

      {/* Code editor */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">JavaScript Editor</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-40 rounded-lg bg-background border border-border p-3 font-mono text-xs text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
          spellCheck={false}
        />
      </div>

      <div className="flex items-center justify-between">
        <Button onClick={handleSubmit} disabled={submitting} className="glow-button text-primary-foreground border-0">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {submitting ? 'Evaluating...' : 'Submit'}
        </Button>

        {result && (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-foreground">Score: {result.score}/100</span>
          </div>
        )}
      </div>
    </div>
  );
};

const DsaArenaPage = () => {
  const easy = problems.filter(p => p.difficulty === 'easy');
  const medium = problems.filter(p => p.difficulty === 'medium');
  const hard = problems.filter(p => p.difficulty === 'hard');

  const completed = 0; // placeholder
  const total = problems.length;

  return (
    <Layout>
      <div className="section-container py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">DSA Practice Arena</h1>
              <p className="text-sm text-muted-foreground">Sharpen your problem-solving skills</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="glass-card p-4 mt-4 flex items-center gap-4">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Progress</span>
            <Progress value={(completed / total) * 100} className="flex-1 h-2" />
            <span className="text-sm font-semibold text-foreground">{completed}/{total}</span>
          </div>
        </motion.div>

        {/* Problem Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="multiple" defaultValue={['easy']} className="space-y-4">
            {([
              { key: 'easy', label: 'Easy Problems', items: easy, config: difficultyConfig.easy },
              { key: 'medium', label: 'Medium Problems', items: medium, config: difficultyConfig.medium },
              { key: 'hard', label: 'Hard Problems', items: hard, config: difficultyConfig.hard },
            ] as const).map(({ key, label, items, config }) => (
              <AccordionItem key={key} value={key} className="glass-card border-0">
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={config.color}>{items.length}</Badge>
                    <span className="text-base font-semibold text-foreground">{label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 space-y-4">
                  {items.map(p => <ProblemCard key={p.id} problem={p} />)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </Layout>
  );
};

export default DsaArenaPage;
