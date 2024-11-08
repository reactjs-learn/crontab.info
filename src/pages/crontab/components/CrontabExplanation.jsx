import React from "react";
import { Typography } from "@mui/material";
import { parseCrontabExpression } from "../../../utils/crontabUtils";

const CrontabExplanation = ({ crontabValue, invalidFields = [] }) => {
  console.log(crontabValue, invalidFields);

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

  return (
    <>
      <Typography sx={{ color: "text.secondary", mb: 1, fontSize: "2rem" }}>
        "At{" "}
        <Typography
          component="span"
          sx={{
            color: getFieldColor(0),
            fontSize: "inherit",
            opacity: invalidFields.includes(0) || invalidFields.includes(1) ? 0.5 : 1,
          }}
        >
          {`${parsed.hour}:${parsed.minute}`}
        </Typography>{" "}
        on day-of-month{" "}
        <Typography
          component="span"
          sx={{
            color: getFieldColor(2),
            fontSize: "inherit",
            opacity: invalidFields.includes(2) ? 0.5 : 1,
          }}
        >
          {parsed.dayOfMonth}
        </Typography>{" "}
        of{" "}
        <Typography
          component="span"
          sx={{
            color: getFieldColor(3),
            fontSize: "inherit",
            opacity: invalidFields.includes(3) ? 0.5 : 1,
          }}
        >
          {parsed.month}
        </Typography>{" "}
        and every{" "}
        <Typography
          component="span"
          sx={{
            color: getFieldColor(4),
            fontSize: "inherit",
            opacity: invalidFields.includes(4) ? 0.5 : 1,
          }}
        >
          {dayOfWeekText}
        </Typography>
        "
      </Typography>
      <Typography sx={{ color: "text.secondary" }}>
        {isValid ? (
          <>
            next at {`${parsed.hour}:${parsed.minute}`}
            <Typography component="span" sx={{ ml: 2, color: "#3399ff", cursor: "pointer" }}>
              random
            </Typography>
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
