import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface InterviewContextCardProps {
  candidateName: string;
  targetRole: string;
}

const InterviewContextCard = ({ candidateName, targetRole }: InterviewContextCardProps) => {
  const contextFields = [
    { label: 'Candidate Name', value: candidateName },
    { label: 'Target Role', value: targetRole },
    { label: 'Interview Type', value: 'Mock' },
    { label: 'Input Mode', value: 'Audio Only' },
    { label: 'Status', value: 'In Progress' },
  ];

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Info className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wider">
            Interview Context
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="space-y-3">
          {contextFields.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};

export default InterviewContextCard;
