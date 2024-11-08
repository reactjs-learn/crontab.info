import React, { useState } from "react";
import { Box, Typography, Paper, Grid, ThemeProvider, createTheme, CssBaseline, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import CrontabCalendar from "./CrontabCalendar";
import CrontabExpression from "./CrontabExpression";
import CrontabNextRuns from "./CrontabNextRuns";
import CrontabPresets from "./CrontabPresets";

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

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  height: "100%",
}));

const CrontabConfig = () => {
  const [crontabValue, setCrontabValue] = useState("58 5 8 11 *");
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="xl" disableGutters>
        <Box
          sx={{
            p: 3,
            height: "100vh",
            margin: "0 auto",
            maxWidth: "1400px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "primary.main",
                gap: 2,
              }}
            >
              <span role="img" aria-label="calendar" style={{ fontSize: "1.5em" }}>
                📅
              </span>
              SCHEDULE CONFIG
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              next at 12/8/2024, 5:58:00 AM
              <Typography component="span" sx={{ ml: 2, color: "#3399ff", cursor: "pointer" }}>
                random
              </Typography>
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
            <Grid item xs={12} md={4} lg={3} sx={{ height: "100%" }}>
              <StyledPaper
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <CrontabCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} crontabValue={crontabValue} />
              </StyledPaper>
            </Grid>

            <Grid item xs={12} md={8} lg={9} sx={{ height: "100%" }}>
              <Grid container spacing={3} sx={{ height: "100%" }}>
                <Grid item xs={12}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ color: "text.secondary", mb: 1 }}>
                      "At{" "}
                      <Typography component="span" sx={{ color: "white" }}>
                        5 58
                      </Typography>{" "}
                      on day-of-month{" "}
                      <Typography component="span" sx={{ color: "white" }}>
                        8
                      </Typography>{" "}
                      in{" "}
                      <Typography component="span" sx={{ color: "white" }}>
                        November
                      </Typography>
                      "
                    </Typography>
                    <StyledPaper>
                      <CrontabExpression value={crontabValue} onChange={setCrontabValue} />
                    </StyledPaper>
                  </Box>
                </Grid>

                <Grid item xs={12} sx={{ flex: 1, minHeight: 0 }}>
                  <Grid container spacing={3} sx={{ height: "100%" }}>
                    <Grid item xs={12} md={6}>
                      <StyledPaper>
                        <CrontabNextRuns crontabValue={crontabValue} />
                      </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <StyledPaper>
                        <CrontabPresets onSelect={setCrontabValue} />
                      </StyledPaper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CrontabConfig;
