import { parse } from "cron-parser";

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

export const generateCrontabFromDate = (date) => {
  return `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
};
