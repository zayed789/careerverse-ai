import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          {/* 404 Text */}
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-8xl sm:text-9xl font-bold gradient-text-bright mb-4"
          >
            404
          </motion.h1>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to a different location.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button className="glow-button text-white border-0 h-12 px-6">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="glow-button-secondary h-12 px-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFound;
