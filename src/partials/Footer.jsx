import React from "react";
import { useTheme } from "../providers/ThemeProvider";

const Footer = () => {
  const { darkMode } = useTheme();

  return (
    <footer className={`w-full p-4 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md mt-auto`}>
      <div className="container mx-auto text-center">
        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          {new Date().getFullYear()} Crontab.Info ©. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
