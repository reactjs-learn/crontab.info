import React from "react";
import { Box, Typography, List, ListItemButton } from "@mui/material";

const presets = [
  // Common Examples
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every day at noon", value: "0 12 * * *" },
  { label: "Every Sunday", value: "0 0 * * 0" },
  { label: "Every Monday", value: "0 0 * * 1" },
  { label: "Every 1st of month", value: "0 0 1 * *" },

  // Specific Times
  { label: "Every 15 minutes", value: "*/15 * * * *" },
  { label: "Every 6 hours", value: "0 */6 * * *" },
  { label: "Every day at 3am", value: "0 3 * * *" },
  { label: "Every day at 2:30am", value: "30 2 * * *" },

  // Specific Days
  { label: "Weekdays at midnight", value: "0 0 * * 1-5" },
  { label: "Weekends at 8am", value: "0 8 * * 6,0" },
  { label: "Monday to Friday at 5pm", value: "0 17 * * 1-5" },

  // Multiple Times
  { label: "Twice a day", value: "0 0,12 * * *" },
  { label: "Every other hour", value: "0 */2 * * *" },
  { label: "Three times a day", value: "0 8,12,16 * * *" },

  // Business Hours
  { label: "Every hour during work day", value: "0 9-17 * * 1-5" },
  { label: "Every 30 min during work hours", value: "*/30 9-17 * * 1-5" },

  // Monthly
  { label: "First Monday of Month", value: "0 0 1-7 * 1" },
  { label: "Last day of Month at 5pm", value: "0 17 28-31 * *" },
];

const CrontabPresets = ({ onSelect }) => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
        Quick Presets:
      </Typography>
      <List
        sx={{
          p: 0,
          flex: 1,
          overflow: "auto",
          maxHeight: "200px", // Match the height of NextRuns
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255,255,255,0.1)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,215,0,0.3)",
            borderRadius: "4px",
            "&:hover": {
              background: "rgba(255,215,0,0.5)",
            },
          },
        }}
      >
        {presets.map((preset) => (
          <ListItemButton
            key={preset.label}
            onClick={() => onSelect(preset.value)}
            sx={{
              color: "#666",
              py: 1,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              "&:last-child": {
                borderBottom: "none",
              },
              "&:hover": {
                backgroundColor: "rgba(255, 215, 0, 0.1)",
                color: "#FFD700",
              },
            }}
          >
            <Box>
              <Typography sx={{ color: "inherit" }}>{preset.label}</Typography>
              <Typography sx={{ color: "#FFD700", fontSize: "0.8rem" }}>{preset.value}</Typography>
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default CrontabPresets;
