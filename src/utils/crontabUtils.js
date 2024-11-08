import { parse } from "cron-parser";
import { parseExpression } from "cron-parser";

const validateRange = (value, min, max) => {
  // Handle '*' case
  if (value === "*") return true;

  // Handle step values (*/2, */3, etc.)
  if (value.includes("/")) {
    const [range, step] = value.split("/");
    if (range !== "*") return false;
    const stepNum = parseInt(step, 10);
    return !isNaN(stepNum) && stepNum >= 1;
  }

  // Handle ranges (1-5, 2-6, etc.)
  if (value.includes("-")) {
    const [start, end] = value.split("-");
    const startNum = parseInt(start, 10);
    const endNum = parseInt(end, 10);
    return (
      !isNaN(startNum) &&
      !isNaN(endNum) &&
      startNum >= min &&
      startNum <= max &&
      endNum >= min &&
      endNum <= max &&
      startNum <= endNum
    );
  }

  // Handle multiple values (comma-separated)
  const values = value.split(",");
  return values.every((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= min && num <= max;
  });
};

export const validateCrontab = (expression) => {
  try {
    // Split and validate number of parts
    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) return false;

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    // Check each field's bounds
    const validations = [
      validateRange(minute, 0, 59), // Minutes: 0-59
      validateRange(hour, 0, 23), // Hours: 0-23
      validateRange(dayOfMonth, 1, 31), // Day of Month: 1-31
      validateRange(month, 1, 12), // Month: 1-12
      validateRange(dayOfWeek, 0, 7), // Day of Week: 0-7 (0 and 7 are Sunday)
    ];

    // If any validation fails, return the index of failed validations
    const failedValidations = validations
      .map((isValid, index) => (isValid ? -1 : index))
      .filter((index) => index !== -1);

    if (failedValidations.length > 0) {
      return failedValidations;
    }

    // Try parsing with cron-parser as final validation
    parse(expression);

    return [];
  } catch (err) {
    // If parsing fails, consider all fields invalid
    return [0, 1, 2, 3, 4];
  }
};

export const getNextRuns = (expression, count = 5) => {
  try {
    const interval = parse(expression);
    const dates = [];
    for (let i = 0; i < count; i++) {
      dates.push(interval.next().toDate());
    }
    return dates;
  } catch (err) {
    return [];
  }
};

export const parseCrontabExpression = (expression) => {
  const parts = expression.split(" ");
  return {
    minute: parts[0] || "",
    hour: parts[1] || "",
    dayOfMonth: parts[2] || "",
    month: parts[3] || "",
    dayOfWeek: parts[4] || "",
  };
};

export const generateCrontabFromDate = (date, preservePattern = "* * * * *") => {
  if (!date || isNaN(date.getTime())) {
    return preservePattern;
  }

  const parts = preservePattern.split(" ");
  return [
    parts[0] === "*" ? "*" : date.getMinutes(),
    parts[1] === "*" ? "*" : date.getHours(),
    parts[2] === "*" ? "*" : date.getDate(),
    parts[3] === "*" ? "*" : date.getMonth() + 1,
    parts[4], // Keep original day of week pattern
  ].join(" ");
};

export const parseCrontabForCalendar = (expression) => {
  const parts = expression.split(" ");
  const now = new Date();

  return {
    minute: parts[0] === "*" ? now.getMinutes() : parseInt(parts[0], 10),
    hour: parts[1] === "*" ? now.getHours() : parseInt(parts[1], 10),
    dayOfMonth: parts[2] === "*" ? now.getDate() : parseInt(parts[2], 10),
    month: parts[3] === "*" ? now.getMonth() + 1 : parseInt(parts[3], 10),
    dayOfWeek: parts[4] === "*" ? now.getDay() : parseInt(parts[4], 10),
  };
};

export const getNextOccurrence = (expression) => {
  try {
    const interval = parseExpression(expression, {
      currentDate: new Date(),
      iterator: true,
      utc: false,
    });
    return interval.next().value.toDate();
  } catch (err) {
    console.error("Error parsing cron expression:", err);
    return null;
  }
};

export const formatDateTime = (date) => {
  if (!date) return "";

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
};
