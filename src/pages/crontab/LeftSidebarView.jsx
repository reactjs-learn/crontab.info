import React from "react";
import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import CrontabCalendar from "../../components/CrontabCalendar";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const LeftSidebarView = ({ selectedDate, onDateChange, crontabValue }) => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <StyledPaper
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <CrontabCalendar selectedDate={selectedDate} onDateChange={onDateChange} crontabValue={crontabValue} />
      </StyledPaper>
    </Box>
  );
};

export default LeftSidebarView;
