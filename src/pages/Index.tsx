import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import YearPlannerSection from '@/components/home/YearPlannerSection';
import ActivitiesSection from '@/components/home/ActivitiesSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <YearPlannerSection />
      <ActivitiesSection />
    </Layout>
  );
};

export default Index;
