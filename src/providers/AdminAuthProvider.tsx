import React from 'react';
import { AdminAuthContext, useAdminAuthProvider } from '@/hooks/useAdminAuth';

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const auth = useAdminAuthProvider();

  return (
    <AdminAuthContext.Provider value={auth}>
      {children}
    </AdminAuthContext.Provider>
  );
};


