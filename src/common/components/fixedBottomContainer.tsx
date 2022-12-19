import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import Paper from "@mui/material/Paper";

interface BottomNavProps {
  button?: React.ReactNode;
}

export default function FixedBottomNavigation({ button }: BottomNavProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  // console.log(props);
  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />

      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation>
          {button}
          {/* <BottomNavigationAction label="Button" icon={button} /> */}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
