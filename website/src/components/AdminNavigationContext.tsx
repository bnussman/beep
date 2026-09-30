import { createContext, useContext, useState, type ReactNode } from "react";

type AdminNavigationContextValue = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminNavigationContext =
  createContext<AdminNavigationContextValue | null>(null);

export function AdminNavigationProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <AdminNavigationContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </AdminNavigationContext.Provider>
  );
}

export function useAdminNavigation() {
  const context = useContext(AdminNavigationContext);
  if (!context) {
    throw new Error("Admin navigation must be used within its provider");
  }
  return context;
}