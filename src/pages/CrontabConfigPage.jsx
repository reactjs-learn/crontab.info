import React, { useState } from "react";
import { Box, Paper, Grid, ThemeProvider, createTheme, CssBaseline, Container } from "@mui/material";
import LeftSidebarView from "./crontab/LeftSidebarView";
import RightSidebarView from "./crontab/RightSidebarView";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFD700",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
  },
});

const CrontabConfigPage = () => {
  const [crontabValue, setCrontabValue] = useState("58 5 8 11 *");
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="xl" disableGutters>
        <Box
          sx={{
            p: 3,
            height: "100%",
            margin: "0 auto",
            maxWidth: "1400px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
            <Grid item xs={12} md={4} lg={3} sx={{ height: "100%" }}>
              <LeftSidebarView selectedDate={selectedDate} onDateChange={setSelectedDate} crontabValue={crontabValue} />
            </Grid>

            <Grid item xs={12} md={8} lg={9} sx={{ height: "100%" }}>
              <RightSidebarView crontabValue={crontabValue} setCrontabValue={setCrontabValue} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CrontabConfigPage;
