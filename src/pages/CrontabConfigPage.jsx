import React, { useState } from "react";
import { Box, Paper, Grid, ThemeProvider, createTheme, CssBaseline, Container } from "@mui/material";
import LeftSidebarView from "./crontab/LeftSidebarView";
import RightSidebarView from "./crontab/RightSidebarView";
import { generateCrontabFromDate } from "../utils/crontabUtils";

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
  const now = new Date();
  const initialCrontab = `${now.getMinutes()} ${now.getHours()} ${now.getDate()} ${now.getMonth() + 1} *`;

  const [crontabValue, setCrontabValue] = useState(initialCrontab);
  const [selectedDate, setSelectedDate] = useState(now);

  const getRandomValue = (max, min = 0, includeAsterisk = true) => {
    // 20% chance to return '*' if includeAsterisk is true
    if (includeAsterisk && Math.random() < 0.2) {
      return "*";
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleRandomCrontab = () => {
    const randomMinute = getRandomValue(59);
    const randomHour = getRandomValue(23);
    const randomDay = getRandomValue(31, 1);
    const randomMonth = getRandomValue(12, 1);
    const randomDayOfWeek = getRandomValue(6);

    setCrontabValue(`${randomMinute} ${randomHour} ${randomDay} ${randomMonth} ${randomDayOfWeek}`);
  };

  const handleCrontabChange = (newValue) => {
    setCrontabValue(newValue);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    // Generate crontab value while preserving asterisk patterns
    const newCrontabValue = generateCrontabFromDate(newDate, crontabValue);
    setCrontabValue(newCrontabValue);
  };

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
              <LeftSidebarView
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                crontabValue={crontabValue}
                onCrontabChange={handleCrontabChange}
              />
            </Grid>

            <Grid item xs={12} md={8} lg={9} sx={{ height: "100%" }}>
              <RightSidebarView
                crontabValue={crontabValue}
                setCrontabValue={handleCrontabChange}
                onRandomGenerate={handleRandomCrontab}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CrontabConfigPage;
