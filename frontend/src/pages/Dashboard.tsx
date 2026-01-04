// Dashboard.tsx
import { Box, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Dashboard</Typography>
      <Typography>Welcome! This is a protected page.</Typography>
    </Box>
  );
}
