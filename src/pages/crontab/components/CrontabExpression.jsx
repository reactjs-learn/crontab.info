import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { validateCrontab, parseCrontabExpression } from "../../../utils/crontabUtils";

const ExpressionField = styled(TextField)({
  "& .MuiInputBase-input": {
    color: "white",
    fontSize: "24px",
    textAlign: "center",
    letterSpacing: "8px",
    fontFamily: "monospace",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#2a2a2a",
    "& fieldset": {
      borderColor: "#333",
    },
    "&:hover fieldset": {
      borderColor: "#444",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FFD700",
    },
  },
});

const FieldLabel = styled(Typography)({
  color: "#FFD700",
  textAlign: "center",
  marginTop: "8px",
  fontSize: "0.9rem",
});

const FieldRange = styled(Typography)({
  color: "#666",
  textAlign: "center",
  fontSize: "0.8rem",
});

const CrontabExpression = ({ value, onChange }) => {
  const [focusedField, setFocusedField] = React.useState(null);
  const [invalidFields, setInvalidFields] = React.useState([]);
  const parts = value.split(" ");

  const validateExpression = (expression) => {
    const isValid = validateCrontab(expression);
    if (!isValid) {
      const parsed = parseCrontabExpression(expression);
      const newInvalidFields = [];

      if (!/^[0-9*,/-]+$/.test(parsed.minute)) newInvalidFields.push(0);
      if (!/^[0-9*,/-]+$/.test(parsed.hour)) newInvalidFields.push(1);
      if (!/^[0-9*,/-]+$/.test(parsed.dayOfMonth)) newInvalidFields.push(2);
      if (!/^[0-9*,/-]+$/.test(parsed.month)) newInvalidFields.push(3);
      if (!/^[0-9*,/-]+$/.test(parsed.dayOfWeek)) newInvalidFields.push(4);

      setInvalidFields(newInvalidFields);
    } else {
      setInvalidFields([]);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    validateExpression(newValue);
  };

  const handleClick = (e) => {
    const clickPosition = e.target.selectionStart;
    let currentPosition = 0;
    let fieldIndex = 0;

    parts.forEach((part, index) => {
      const fieldLength = part.length;
      if (clickPosition >= currentPosition && clickPosition <= currentPosition + fieldLength) {
        setFocusedField(index);
      }
      currentPosition += fieldLength + 1; // +1 for space
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <ExpressionField
        fullWidth
        value={value}
        onChange={handleChange}
        onClick={handleClick}
        variant="outlined"
        inputProps={{
          style: { padding: "12px" },
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
          gap: 1,
        }}
      >
        {[
          { label: "minute", range: "0-59" },
          { label: "hour", range: "0-23" },
          { label: "day (month)", range: "1-31" },
          { label: "month", range: "1-12" },
          { label: "day (week)", range: "0-6" },
        ].map((field, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              transition: "all 0.2s",
              p: 1,
              borderRadius: 1,
              backgroundColor: invalidFields.includes(index)
                ? "rgba(255, 0, 0, 0.1)"
                : focusedField === index
                  ? "rgba(255, 215, 0, 0.1)"
                  : "transparent",
            }}
          >
            <FieldLabel
              sx={{
                color: invalidFields.includes(index) ? "#ff0000" : focusedField === index ? "#FFD700" : "#666",
              }}
            >
              {field.label}
            </FieldLabel>
            <FieldRange>{field.range}</FieldRange>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ color: "#666", mb: 1 }}>
          Special Characters:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography sx={{ color: "#FFD700" }}>*</Typography>
            <Typography sx={{ color: "#666", fontSize: "0.8rem" }}>any value</Typography>
          </Box>
          <Box>
            <Typography sx={{ color: "#FFD700" }}>,</Typography>
            <Typography sx={{ color: "#666", fontSize: "0.8rem" }}>value list separator</Typography>
          </Box>
          <Box>
            <Typography sx={{ color: "#FFD700" }}>-</Typography>
            <Typography sx={{ color: "#666", fontSize: "0.8rem" }}>range of values</Typography>
          </Box>
          <Box>
            <Typography sx={{ color: "#FFD700" }}>/</Typography>
            <Typography sx={{ color: "#666", fontSize: "0.8rem" }}>step values</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CrontabExpression;
