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

    const validateValue = (value, min, max) => {
      const num = parseInt(value);
      return !isNaN(num) && num >= min && num <= max;
    };

    const validateRange = (range, min, max) => {
      const [start, end] = range.split("-").map(Number);
      return !isNaN(start) && !isNaN(end) && start >= min && start <= max && end >= min && end <= max && start <= end;
    };

    const validateStep = (step, range, min, max) => {
      const stepNum = parseInt(step);
      if (isNaN(stepNum) || stepNum < 1 || stepNum > max) return false;

      if (range === "*") return true;
      return validateRange(range, min, max);
    };

    const validateList = (list, min, max) => {
      return list.split(",").every((item) => {
        // Handle ranges in lists (e.g., "1-5,7,9")
        if (item.includes("-")) {
          return validateRange(item, min, max);
        }
        // Handle steps in lists (e.g., "*/2,*/3")
        if (item.includes("/")) {
          const [range, step] = item.split("/");
          return validateStep(step, range, min, max);
        }
        // Handle single values
        return validateValue(item, min, max);
      });
    };

    return fields.every((field, index) => {
      const { min, max } = ranges[index];

      // Handle asterisk
      if (field === "*") return true;

      // Handle lists (comma-separated values)
      if (field.includes(",")) {
        return validateList(field, min, max);
      }

      // Handle steps with ranges (e.g., "1-5/2")
      if (field.includes("/")) {
        const [range, step] = field.split("/");
        return validateStep(step, range, min, max);
      }

      // Handle ranges (e.g., "1-5")
      if (field.includes("-")) {
        return validateRange(field, min, max);
      }

      // Handle single values
      return validateValue(field, min, max);
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

      const parseStepValue = (field) => {
        if (field.includes("/")) {
          const [range, step] = field.split("/");
          return {
            isStep: true,
            step: parseInt(step),
            range: range === "*" ? null : range,
          };
        }
        return { isStep: false };
      };

      const getNextValueForStep = (current, step, min, max) => {
        let next = current + (step - (current % step));
        if (next > max) {
          next = min + (step - (min % step));
        }
        return next;
      };

      // Handle minute
      const minuteStep = parseStepValue(minute);
      if (minuteStep.isStep) {
        const currentMinute = next.getMinutes();
        const nextMinute = getNextValueForStep(currentMinute, minuteStep.step, 0, 59);
        next.setMinutes(nextMinute);
        if (nextMinute <= currentMinute) {
          next.setHours(next.getHours() + 1);
        }
      } else if (minute !== "*") {
        const minuteValue = parseInt(minute);
        next.setMinutes(minuteValue);
        if (next <= startDate) {
          next.setHours(next.getHours() + 1);
        }
      }

      // Handle hour
      const hourStep = parseStepValue(hour);
      if (hourStep.isStep) {
        const currentHour = next.getHours();
        const nextHour = getNextValueForStep(currentHour, hourStep.step, 0, 23);
        next.setHours(nextHour);
        if (nextHour <= currentHour) {
          next.setDate(next.getDate() + 1);
        }
      } else if (hour !== "*") {
        const hourValue = parseInt(hour);
        next.setHours(hourValue);
        if (next <= startDate) {
          next.setDate(next.getDate() + 1);
        }
      }

      // Handle day of month
      const dayMonthStep = parseStepValue(dayMonth);
      if (dayMonthStep.isStep) {
        const currentDay = next.getDate();
        const nextDay = getNextValueForStep(currentDay, dayMonthStep.step, 1, 31);
        next.setDate(nextDay);
        if (nextDay <= currentDay) {
          next.setMonth(next.getMonth() + 1);
        }
      } else if (dayMonth !== "*") {
        const dayValue = parseInt(dayMonth);
        next.setDate(dayValue);
        if (next <= startDate) {
          next.setMonth(next.getMonth() + 1);
        }
      }

      // Handle month
      const monthStep = parseStepValue(month);
      if (monthStep.isStep) {
        const currentMonth = next.getMonth() + 1; // JavaScript months are 0-based
        const nextMonth = getNextValueForStep(currentMonth, monthStep.step, 1, 12) - 1;
        next.setMonth(nextMonth);
        if (nextMonth <= currentMonth - 1) {
          next.setFullYear(next.getFullYear() + 1);
        }
      } else if (month !== "*") {
        const monthValue = parseInt(month) - 1; // Convert to 0-based month
        next.setMonth(monthValue);
        if (next <= startDate) {
          next.setFullYear(next.getFullYear() + 1);
        }
      }

      // Handle day of week
      const dayWeekStep = parseStepValue(dayWeek);
      if (dayWeekStep.isStep) {
        const currentDayOfWeek = next.getDay();
        const nextDayOfWeek = getNextValueForStep(currentDayOfWeek, dayWeekStep.step, 0, 6);
        while (next.getDay() !== nextDayOfWeek || next <= startDate) {
          next.setDate(next.getDate() + 1);
        }
      } else if (dayWeek !== "*") {
        const dayWeekValue = parseInt(dayWeek);
        while (next.getDay() !== dayWeekValue || next <= startDate) {
          next.setDate(next.getDate() + 1);
        }
      }

      // Final check if date is still in the past
      if (next <= startDate) {
        next.setDate(next.getDate() + 1);
      }

      return next;
    } catch (error) {
      console.error("Error in calculateNextRun:", error);
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
