import { useState } from "react";
import { ProductionTabs } from "@/components/ProductionTabs";
import { Login } from "@/components/Login";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return <ProductionTabs />;
};

export default Index;
