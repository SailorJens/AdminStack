// src/App.tsx
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getToken } from "./auth/auth";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

type UserState = {
  token: string;
} | null;

export default function App() {
  const [user, setUser] = useState<UserState>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser({ token });
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
