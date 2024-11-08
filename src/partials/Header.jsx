import React from "react";
import { useTheme } from "../providers/ThemeProvider";
import { Typography } from "@mui/material";

const Header = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className={`w-full p-4 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Typography
            variant="h6"
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
            CRONTAB CONFIG
          </Typography>
        </div>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg ${
            darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
          } hover:opacity-80 transition-opacity`}
        >
          {darkMode ? "🌞" : "🌙"}
        </button>
      </div>
    </header>
  );
};

export default Header;
