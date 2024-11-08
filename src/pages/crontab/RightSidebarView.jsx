import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import CrontabExpression from "./components/CrontabExpression";
import CrontabNextRuns from "./components/CrontabNextRuns";
import CrontabPresets from "./components/CrontabPresets";
import { StyledPaper } from "./components/StyledPaper";
import CrontabExplanation from "./components/CrontabExplanation";
import { getNextRuns, parseCrontabExpression } from "../../utils/crontabUtils";

const RightSidebarView = ({ crontabValue, setCrontabValue }) => {
  const [nextRuns, setNextRuns] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);

  useEffect(() => {
    // Clear previous runs immediately
    setNextRuns([]);

    // Check which fields are invalid
    const parsed = parseCrontabExpression(crontabValue);
    const newInvalidFields = [];

    if (!/^[0-9*,/-]+$/.test(parsed.minute) || parseInt(parsed.minute) > 59) newInvalidFields.push(0);
    if (!/^[0-9*,/-]+$/.test(parsed.hour) || parseInt(parsed.hour) > 23) newInvalidFields.push(1);
    if (!/^[0-9*,/-]+$/.test(parsed.dayOfMonth) || parseInt(parsed.dayOfMonth) > 31) newInvalidFields.push(2);
    if (!/^[0-9*,/-]+$/.test(parsed.month) || parseInt(parsed.month) > 12) newInvalidFields.push(3);
    if (!/^[0-9*,/-]+$/.test(parsed.dayOfWeek) || parseInt(parsed.dayOfWeek) > 7) newInvalidFields.push(4);

    setInvalidFields(newInvalidFields);
    setIsValid(newInvalidFields.length === 0);

    // Only calculate next runs if valid
    if (newInvalidFields.length === 0) {
      try {
        const runs = getNextRuns(crontabValue);
        setNextRuns(runs);
      } catch (error) {
        console.error("Error calculating next runs:", error);
      }
    }
  }, [crontabValue]);

  return (
    <Grid container spacing={3} sx={{ height: "100%" }}>
      <Grid item xs={12}>
        <Box sx={{ textAlign: "center" }}>
          <CrontabExplanation crontabValue={crontabValue} invalidFields={invalidFields} />
          <StyledPaper>
            <CrontabExpression value={crontabValue} onChange={setCrontabValue} />
          </StyledPaper>
        </Box>
      </Grid>

      <Grid item xs={12} sx={{ flex: 1, minHeight: 0 }}>
        <Grid container spacing={3} sx={{ height: "100%" }}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <CrontabNextRuns runs={nextRuns} />
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
  );
};

export default RightSidebarView;
