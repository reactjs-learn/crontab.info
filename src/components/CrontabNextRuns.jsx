import React from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { addYears, format } from "date-fns";

const CrontabNextRuns = ({ crontabValue }) => {
  const getNextRuns = () => {
    const baseDate = new Date();
    return Array.from({ length: 5 }, (_, i) => ({
      date: addYears(baseDate, i),
      formatted: format(addYears(baseDate, i), "MM/dd/yyyy, hh:mm:ss aa"),
    }));
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
        Next 5 runs:
      </Typography>
      <List sx={{ p: 0 }}>
        {getNextRuns().map((run, index) => (
          <ListItem
            key={index}
            sx={{
              color: "#666",
              py: 1,
              px: 0,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              "&:last-child": {
                borderBottom: "none",
              },
            }}
          >
            {run.formatted}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CrontabNextRuns;
