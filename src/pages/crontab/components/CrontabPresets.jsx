import React from "react";
import { Box, Typography, List, ListItemButton } from "@mui/material";

const presets = [
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Daily at noon", value: "0 12 * * *" },
  { label: "Weekly on Monday", value: "0 0 * * 1" },
  { label: "Monthly on the 1st", value: "0 0 1 * *" },
];

const CrontabPresets = ({ onSelect }) => {
  return (
    <Box sx={{ height: "100%" }}>
      <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
        Quick Presets:
      </Typography>
      <List sx={{ p: 0 }}>
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
            {preset.label}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default CrontabPresets;
