import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isRoleLoading, isAdmin } = useAuth();

  if (loading || isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
