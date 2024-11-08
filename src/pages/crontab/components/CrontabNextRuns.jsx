import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { format } from "date-fns";

const CrontabNextRuns = ({ crontabValue }) => {
  const [nextRuns, setNextRuns] = useState([]);

  useEffect(() => {
    // Only calculate if we have a valid crontabValue
    if (crontabValue && typeof crontabValue === "string" && crontabValue.trim()) {
      try {
        const fields = crontabValue.trim().split(/\s+/);
        if (fields.length !== 5) return setNextRuns(Array(5).fill(null));
        if (!isValidCronExpression(fields)) return setNextRuns(Array(5).fill(null));
        calculateNextRuns(crontabValue);
      } catch (error) {
        setNextRuns(Array(5).fill(null));
      }
    } else {
      setNextRuns(Array(5).fill(null));
    }
  }, [crontabValue]);

  const isValidCronExpression = (fields) => {
    const ranges = [
      { min: 0, max: 59 }, // minute
      { min: 0, max: 23 }, // hour
      { min: 1, max: 31 }, // day
      { min: 1, max: 12 }, // month
      { min: 0, max: 6 }, // day of week
    ];

    return fields.every((field, index) => {
      if (field === "*") return true;
      const num = parseInt(field);
      return !isNaN(num) && num >= ranges[index].min && num <= ranges[index].max;
    });
  };

  const calculateNextRuns = (expression) => {
    try {
      // Check if expression is valid before processing
      if (!expression || typeof expression !== "string") throw new Error("Invalid or missing cron expression");
      const fields = expression.trim().split(/\s+/);
      if (fields.length !== 5 || !isValidCronExpression(fields)) throw new Error("Invalid cron expression format");
      const [minute, hour, dayMonth, month, dayWeek] = fields;
      const runs = [];
      let currentDate = new Date();

      for (let i = 0; i < 5; i++) {
        let nextRun = calculateNextRun(currentDate, minute, hour, dayMonth, month, dayWeek);
        if (nextRun && !isNaN(nextRun.getTime())) {
          runs.push(nextRun);
          currentDate = new Date(nextRun.getTime() + 60000);
        }
      }
      setNextRuns(runs.length > 0 ? runs : Array(5).fill(null));
    } catch (error) {
      setNextRuns(Array(5).fill(null));
    }
  };

  const calculateNextRun = (startDate, minute, hour, dayMonth, month, dayWeek) => {
    try {
      let next = new Date(startDate);
      next.setSeconds(0);
      next.setMilliseconds(0);

      // Handle minute
      if (minute === "*") {
        next.setMinutes(next.getMinutes() + 1);
      } else {
        const minuteValue = parseInt(minute);
        next.setMinutes(minuteValue);
        if (next <= startDate) {
          next.setHours(next.getHours() + 1);
        }
      }

      // Handle hour
      if (hour !== "*") {
        const hourValue = parseInt(hour);
        next.setHours(hourValue);
        if (next <= startDate) next.setDate(next.getDate() + 1);
      }

      // Handle day of month
      if (dayMonth !== "*") {
        const dayValue = parseInt(dayMonth);
        next.setDate(dayValue);
        if (next <= startDate) next.setMonth(next.getMonth() + 1);
      }

      // Handle month
      if (month !== "*") {
        const monthValue = parseInt(month) - 1;
        next.setMonth(monthValue);
        if (next <= startDate) next.setFullYear(next.getFullYear() + 1);
      }

      // Handle day of week
      if (dayWeek !== "*") {
        const dayWeekValue = parseInt(dayWeek);
        while (next.getDay() !== dayWeekValue || next <= startDate) {
          next.setDate(next.getDate() + 1);
        }
      }

      // Final check if date is still in the past
      if (next <= startDate) next.setDate(next.getDate() + 1);

      return next;
    } catch (error) {
      return null;
    }
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
        Next 5 runs:
      </Typography>
      <List sx={{ p: 0 }}>
        {nextRuns.map((run, index) => {
          let formattedDate = "Invalid Date";
          try {
            if (run && !isNaN(run.getTime())) {
              formattedDate = format(run, "MM/dd/yyyy, hh:mm:ss aa");
            }
          } catch (error) {
            console.error("Date formatting error:", error);
          }

          return (
            <ListItem
              key={index}
              sx={{
                color: formattedDate !== "Invalid Date" ? "#666" : "red",
                py: 1,
                px: 0,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                "&:last-child": {
                  borderBottom: "none",
                },
              }}
            >
              {formattedDate}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default CrontabNextRuns;
