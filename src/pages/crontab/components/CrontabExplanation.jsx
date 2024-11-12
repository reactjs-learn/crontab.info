import React, { useState, useEffect } from "react";
import { Tooltip, Typography } from "@mui/material";
import { parseCrontabExpression, getNextOccurrence, formatDateTime } from "../../../utils/crontabUtils";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const CrontabExplanation = ({ crontabValue, invalidFields = [], onRandomGenerate, focusedField }) => {
  const [nextRun, setNextRun] = useState(null);
  const [copyTooltip, setCopyTooltip] = useState(false);

  useEffect(() => {
    if (invalidFields.length === 0 && crontabValue) {
      try {
        const nextDate = getNextOccurrence(crontabValue);
        setNextRun(nextDate);
      } catch (error) {
        console.error("Error getting next occurrence:", error);
        setNextRun(null);
      }
    } else {
      setNextRun(null);
    }
  }, [crontabValue, invalidFields]);

  const getFieldColor = (fieldIndex) => {
    return invalidFields.includes(fieldIndex) ? "#ff0000" : "white";
  };

  const dayOfWeekMap = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
    "*": "day",
  };

  const monthMap = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
    "*": "month",
  };

  const parsed = parseCrontabExpression(crontabValue || "");
  const isValid = invalidFields.length === 0;
  const dayOfWeekText = parsed.dayOfWeek
    .split(",")
    .map((day) => dayOfWeekMap[day] || day)
    .join(", ");

  const handleCopy = () => {
    navigator.clipboard.writeText(crontabValue);
    setCopyTooltip(true);
    setTimeout(() => setCopyTooltip(false), 1500);
  };

  const getFieldStyle = (fieldIndex) => ({
    color: getFieldColor(fieldIndex),
    fontSize: "inherit",
    opacity: invalidFields.includes(fieldIndex) ? 0.5 : 1,
    backgroundColor: focusedField === fieldIndex ? "rgba(255, 215, 0, 0.1)" : "transparent",
    padding: "0 4px",
    borderRadius: "4px",
    transition: "background-color 0.2s ease",
  });

  const getFieldExplanation = (field, fieldType) => {
    if (field === "*") return "any";

    // Handle lists
    if (field.includes(",")) {
      return field
        .split(",")
        .map((part) => getFieldExplanation(part, fieldType))
        .join(" or ");
    }

    // Handle steps
    if (field.includes("/")) {
      const [range, step] = field.split("/");
      const stepText = `every ${step}`;
      const unitText = getUnitText(fieldType, parseInt(step));

      return range !== "*"
        ? `${stepText} ${unitText} from ${getFieldExplanation(range, fieldType)}`
        : `${stepText} ${unitText}`;
    }

    // Handle ranges
    if (field.includes("-")) {
      const [start, end] = field.split("-");
      if (fieldType === "month") {
        return `from ${monthMap[start]} to ${monthMap[end]}`;
      }
      if (fieldType === "day of week") {
        return `from ${dayOfWeekMap[start]} to ${dayOfWeekMap[end]}`;
      }
      return `from ${start} to ${end}`;
    }

    // Handle single values
    if (fieldType === "month") return monthMap[field];
    if (fieldType === "day of week") return dayOfWeekMap[field];
    return field;
  };

  const getUnitText = (fieldType, step) => {
    const units = {
      minute: "minute",
      hour: "hour",
      "day of month": "day",
      month: "month",
      "day of week": "day",
    };
    const unit = units[fieldType];
    return step > 1 ? `${unit}s` : unit;
  };

  const getExplanationParts = () => {
    const minuteText = getFieldExplanation(parsed.minute, "minute");
    const hourText = getFieldExplanation(parsed.hour, "hour");
    const dayMonthText = getFieldExplanation(parsed.dayOfMonth, "day of month");
    const monthText = getFieldExplanation(parsed.month, "month");
    const dayWeekText = getFieldExplanation(parsed.dayOfWeek, "day of week");

    return [
      { text: "At ", field: null },
      { text: hourText, field: 1 },
      { text: ":", field: null },
      { text: minuteText, field: 0 },
      { text: " on ", field: null },
      { text: dayMonthText, field: 2 },
      { text: " of ", field: null },
      { text: monthText, field: 3 },
      { text: " and every ", field: null },
      { text: dayWeekText, field: 4 },
    ];
  };

  return (
    <>
      <Typography sx={{ color: "text.secondary", mb: 1, fontSize: "2rem" }}>
        "
        {getExplanationParts().map((part, index) => (
          <React.Fragment key={index}>
            {part.field !== null ? (
              <Typography
                component="span"
                sx={{
                  color: getFieldColor(part.field),
                  fontSize: "inherit",
                  opacity: invalidFields.includes(part.field) ? 0.5 : 1,
                  backgroundColor: focusedField === part.field ? "rgba(255, 215, 0, 0.1)" : "transparent",
                  padding: "0 4px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                }}
              >
                {part.text}
              </Typography>
            ) : (
              part.text
            )}
          </React.Fragment>
        ))}
        "
      </Typography>
      <Typography sx={{ color: "text.secondary" }}>
        {isValid ? (
          <>
            next at{" "}
            <Typography
              component="span"
              sx={{
                color: "#FFD700",
                fontWeight: "medium",
              }}
            >
              {nextRun ? formatDateTime(nextRun) : `${parsed.hour}:${parsed.minute}`}
            </Typography>
            <Typography
              component="span"
              sx={{
                ml: 2,
                color: "#3399ff",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={onRandomGenerate}
            >
              random
            </Typography>
            <Tooltip title={copyTooltip ? "Copied to clipboard!" : "Copy crontab value"} placement="top">
              <ContentCopyIcon
                sx={{
                  ml: 2,
                  color: "#3399ff",
                  cursor: "pointer",
                  fontSize: "1rem",
                  verticalAlign: "middle",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
                onClick={handleCopy}
              />
            </Tooltip>
          </>
        ) : (
          <Typography component="span" sx={{ color: "#ff0000" }}>
            Invalid cron expression
          </Typography>
        )}
      </Typography>
    </>
  );
};

export default CrontabExplanation;
