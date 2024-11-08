import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { validateCrontab, parseCrontabExpression } from "../../../utils/crontabUtils";

const ExpressionField = styled(TextField)({
  "& .MuiInputBase-input": {
    color: "white",
    fontSize: "32px",
    textAlign: "center",
    letterSpacing: "12px",
    fontFamily: "monospace",
    padding: "20px !important",
    "@media (max-width: 600px)": {
      fontSize: "20px",
      letterSpacing: "6px",
      padding: "12px !important",
    },
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#1a1a1a",
    borderRadius: "16px",
    "& fieldset": {
      borderColor: "#444",
      borderWidth: "2px",
      borderRadius: "16px",
    },
    "&:hover fieldset": {
      borderColor: "#666",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FFD700",
      borderWidth: "2px",
    },
  },
  width: "90%",
  maxWidth: "800px",
  margin: "0 auto",
});

const FieldLabel = styled(Typography)({
  color: "#FFD700",
  textAlign: "center",
  marginTop: "8px",
  fontSize: "0.9rem",
  "@media (max-width: 600px)": {
    fontSize: "0.7rem",
  },
});

const FieldRange = styled(Typography)({
  color: "#666",
  textAlign: "center",
  fontSize: "0.8rem",
  "@media (max-width: 600px)": {
    fontSize: "0.6rem",
  },
});

const CrontabExpression = ({ value, onChange, onFieldFocus }) => {
  const [focusedField, setFocusedField] = React.useState(null);
  const [invalidFields, setInvalidFields] = React.useState([]);
  const parts = value.split(" ");

  const fields = [
    { label: "minute", range: "0-59" },
    { label: "hour", range: "0-23" },
    { label: "day of month", range: "1-31" },
    { label: "month", range: "1-12" },
    { label: "day of week", range: "0-6" },
  ];

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
        onFieldFocus(index);
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
        {fields.map((field, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              transition: "all 0.2s",
              borderRadius: 1,
              backgroundColor: invalidFields.includes(index)
                ? "rgba(255, 0, 0, 0.1)"
                : focusedField === index
                  ? "rgba(255, 215, 0, 0.5)"
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

      <Box sx={{ mt: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: "#666", textDecoration: "underline", fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
        >
          Special Characters:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography sx={{ color: "#FFD700" }}>*</Typography>
            <Typography sx={{ color: "#666", fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>any value</Typography>
          </Box>
          <Box>
            <Typography sx={{ color: "#FFD700" }}>,</Typography>
            <Typography sx={{ color: "#666", fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
              value list separator
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: "#FFD700" }}>-</Typography>
            <Typography sx={{ color: "#666", fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>range of values</Typography>
          </Box>
          <Box>
            <Typography sx={{ color: "#FFD700" }}>/</Typography>
            <Typography sx={{ color: "#666", fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>step values</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CrontabExpression;
