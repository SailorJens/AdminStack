import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <div>
      {token ? (
        <Dashboard token={token} />
      ) : (
        <LoginPage onLoginSuccess={setToken} />
      )}
    </div>
  );
};

export default App;
