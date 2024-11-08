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

  return (
    <>
      <Typography sx={{ color: "text.secondary", mb: 1, fontSize: "2rem" }}>
        "At{" "}
        <Typography component="span" sx={getFieldStyle(0)}>
          {`${parsed.hour}:${parsed.minute}`}
        </Typography>{" "}
        on day-of-month{" "}
        <Typography component="span" sx={getFieldStyle(2)}>
          {parsed.dayOfMonth}
        </Typography>{" "}
        of{" "}
        <Typography component="span" sx={getFieldStyle(3)}>
          {parsed.month}
        </Typography>{" "}
        and every{" "}
        <Typography component="span" sx={getFieldStyle(4)}>
          {dayOfWeekText}
        </Typography>
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
