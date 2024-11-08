import React from "react";
import { createRoot } from "react-dom/client";
import CrontabConfig from "./components/CrontabConfig";
import "./styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <CrontabConfig />
  </React.StrictMode>
);
