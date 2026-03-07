import Layout from '@/components/layout/Layout';
import { Search } from 'lucide-react';

const JobSearchPage = () => {
  return (
    <Layout>
      <div className="section-container py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary/10">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Job Search</h1>
            <p className="text-muted-foreground">Find and explore job opportunities</p>
          </div>
        </div>
        <div className="glass-card p-12 text-center">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">Job search functionality is under development.</p>
        </div>
      </div>
    </Layout>
  );
};

export default JobSearchPage;
