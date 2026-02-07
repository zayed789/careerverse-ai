import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InterviewSetupProps {
  onStart: (name: string, role: string) => void;
}

const InterviewSetup = ({ onStart }: InterviewSetupProps) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const canStart = name.trim().length > 0 && role.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Multi-Round Interview
          </h2>
          <p className="text-muted-foreground text-sm">
            You'll go through Screening, Technical, and Scenario rounds. Your
            performance is evaluated after each round.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="candidate-name" className="flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              id="candidate-name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary/30 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-role" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              Target Role
            </Label>
            <Input
              id="target-role"
              placeholder="e.g. Frontend Developer, Data Analyst"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-secondary/30 border-border/50"
            />
          </div>

          <Button
            onClick={() => onStart(name.trim(), role.trim())}
            disabled={!canStart}
            className="w-full glow-button text-white border-0 mt-4"
            size="lg"
          >
            Start Interview
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewSetup;
