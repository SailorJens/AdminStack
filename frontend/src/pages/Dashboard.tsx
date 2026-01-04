// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { getToken, removeToken } from "../auth/auth";

interface User {
  id: number;
  email: string;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const logout = () => {
    removeToken();
    navigate("/login", { replace: true });
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    const token = getToken();
    if (!token) {
      // No token -> go login
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:7777/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token invalid/expired -> clear and go login
        removeToken();
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({} as any));
        setError((data as any).detail || "Failed to fetch users");
        setLoading(false);
        return;
      }

      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <CircularProgress style={{ marginTop: "2rem" }} />;

  if (error)
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={fetchUsers}>
          Retry
        </Button>
        <Button sx={{ mt: 2, ml: 2 }} variant="contained" onClick={logout}>
          Logout
        </Button>
      </Box>
    );

  return (
    <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
        }}
      >
        <Typography variant="h5">User Dashboard</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" onClick={fetchUsers}>
            Refresh
          </Button>
          <Button variant="contained" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
