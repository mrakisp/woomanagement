import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import Paper from "@mui/material/Paper";

interface BottomNavProps {
  buttons: React.ReactNode;
}

export default function FixedBottomNavigation({ buttons }: BottomNavProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />

      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
        elevation={3}
      >
        <BottomNavigation sx={{ pb: 2, padding: 1, background: "#d8e3ed" }}>
          {buttons}
          {/* <BottomNavigationAction label="Button" icon={button} /> */}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
