import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { DigitalClock } from "@mui/x-date-pickers/DigitalClock";
import { ChevronLeft, ChevronRight, Schedule } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { generateCrontabFromDate, parseCrontabForCalendar } from "../utils/crontabUtils";

// Create styled components with higher specificity
const StyledPickerRoot = styled("div")(({ theme }) => ({
  "&& .MuiPickersLayout-root": {
    minWidth: "unset",
    width: "100%",
    backgroundColor: "#2a2a2a",
  },
  "&& .MuiPickersLayout-contentWrapper": {
    minWidth: "unset",
    backgroundColor: "#2a2a2a",
  },
  "&& .MuiDateCalendar-root": {
    width: "100%",
    minWidth: "unset",
    backgroundColor: "#2a2a2a",
  },
  "&& .MuiTimeClock-root": {
    width: "100%",
    minWidth: "unset",
    backgroundColor: "#2a2a2a",
  },
  "&& .MuiClock-root": {
    backgroundColor: "#2a2a2a",
  },
  "& .MuiPickersDay-dayWithMargin": {
    backgroundColor: "#2a2a2a",
  },
}));

const CrontabCalendar = ({ selectedDate, onDateChange, crontabValue, onCrontabChange }) => {
  const [clockType, setClockType] = useState("analog");

  // Initial sync effect
  useEffect(() => {
    const now = new Date();
    const parts = crontabValue.split(" ");

    // If all parts are asterisks, set the current date/time
    if (parts.every((part) => part === "*")) {
      const newCrontab = `${now.getMinutes()} ${now.getHours()} ${now.getDate()} ${now.getMonth() + 1} *`;
      onCrontabChange(newCrontab);
      onDateChange(now);
    }
  }, []);

  useEffect(() => {
    const parsed = parseCrontabForCalendar(crontabValue);
    const currentDate = new Date(selectedDate);

    // Only update if the time components are different
    if (
      currentDate.getHours() !== parsed.hour ||
      currentDate.getMinutes() !== parsed.minute ||
      currentDate.getDate() !== parsed.dayOfMonth ||
      currentDate.getMonth() + 1 !== parsed.month
    ) {
      const newDate = new Date(
        currentDate.getFullYear(),
        parsed.month - 1,
        parsed.dayOfMonth,
        parsed.hour,
        parsed.minute
      );

      if (!isNaN(newDate.getTime())) {
        onDateChange(newDate);
      }
    }
  }, [crontabValue]);

  const handleTimeChange = (newDate) => {
    if (newDate && !isNaN(newDate.getTime())) {
      onDateChange(newDate);

      // Generate new crontab value, preserving asterisks in original expression
      const parts = crontabValue.split(" ");
      const newCrontab = [
        parts[0] === "*" ? "*" : newDate.getMinutes(),
        parts[1] === "*" ? "*" : newDate.getHours(),
        parts[2] === "*" ? "*" : newDate.getDate(),
        parts[3] === "*" ? "*" : newDate.getMonth() + 1,
        parts[4], // Preserve day of week setting
      ].join(" ");

      onCrontabChange(newCrontab);
    }
  };

  const handleDateChange = (newDate) => {
    if (newDate && !isNaN(newDate.getTime())) {
      onDateChange(newDate);

      // Generate new crontab value, preserving asterisks in original expression
      const parts = crontabValue.split(" ");
      const newCrontab = [
        parts[0] === "*" ? "*" : selectedDate.getMinutes(), // Keep existing minutes
        parts[1] === "*" ? "*" : selectedDate.getHours(), // Keep existing hours
        parts[2] === "*" ? "*" : newDate.getDate(),
        parts[3] === "*" ? "*" : newDate.getMonth() + 1,
        parts[4], // Preserve day of week setting
      ].join(" ");

      onCrontabChange(newCrontab);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledPickerRoot>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#2a2a2a",
            borderRadius: "8px",
          }}
        >
          <Box sx={{ bgcolor: "#2a2a2a" }}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={selectedDate}
              onChange={handleDateChange}
              components={{
                LeftArrowButton: (props) => (
                  <IconButton {...props} sx={{ color: "text.primary" }}>
                    <ChevronLeft />
                  </IconButton>
                ),
                RightArrowButton: (props) => (
                  <IconButton {...props} sx={{ color: "text.primary" }}>
                    <ChevronRight />
                  </IconButton>
                ),
              }}
              sx={{
                width: "100%",
                bgcolor: "#2a2a2a",
                "& .MuiPickersCalendarHeader-root": {
                  color: "text.primary",
                  padding: "8px 0",
                  bgcolor: "#2a2a2a",
                  "& .MuiPickersCalendarHeader-label": {
                    color: "#FFD700",
                  },
                  "& .MuiIconButton-root": {
                    color: "#FFD700",
                    padding: "4px",
                  },
                },
                "& .MuiDayPicker-header": {
                  bgcolor: "#2a2a2a",
                  "& .MuiTypography-root": {
                    color: "#FFD700",
                  },
                },
                "& .MuiDayPicker-monthContainer": {
                  bgcolor: "#2a2a2a",
                },
                "& .MuiPickersDay-root": {
                  color: "text.primary",
                  width: "32px",
                  height: "32px",
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#FFD700",
                    color: "#2a2a2a",
                  },
                },
                "& .MuiPickersDay-today": {
                  border: "1px solid #FFD700",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              bgcolor: "#2a2a2a",
            }}
          >
            <Schedule sx={{ color: "text.secondary" }} />
            <Button
              variant="text"
              onClick={() => setClockType(clockType === "analog" ? "digital" : "analog")}
              sx={{ color: "text.secondary" }}
            >
              Show {clockType === "analog" ? "Digital" : "Analog"} Clock
            </Button>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              bgcolor: "#2a2a2a",
            }}
          >
            {clockType === "analog" ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "#2a2a2a",
                }}
              >
                <StaticTimePicker
                  displayStaticWrapperAs="desktop"
                  value={selectedDate}
                  onChange={handleTimeChange}
                  sx={{
                    bgcolor: "#2a2a2a",
                    "& .MuiClock-pin": {
                      backgroundColor: "#FFD700",
                    },
                    "& .MuiClockPointer-root": {
                      backgroundColor: "#FFD700",
                      "& .MuiClockPointer-thumb": {
                        backgroundColor: "#FFD700",
                        borderColor: "#FFD700",
                      },
                    },
                    "& .MuiClock-clock": {
                      backgroundColor: "#2a2a2a",
                      width: "200px",
                      height: "200px",
                      margin: "8px",
                    },
                    "& .MuiClockNumber-root": {
                      color: "text.primary",
                      "&.Mui-selected": {
                        backgroundColor: "#FFD700",
                        color: "#2a2a2a",
                      },
                    },
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ flex: 1, maxHeight: "200px", bgcolor: "#2a2a2a", overflow: "hidden" }}>
                <DigitalClock
                  value={selectedDate}
                  onChange={handleTimeChange}
                  ampm={false}
                  skipDisabled
                  timeSteps={{ hours: 1, minutes: 1 }}
                  sx={{
                    bgcolor: "#2a2a2a",
                    height: "100%",
                    "& .MuiList-root": {
                      padding: 0,
                      bgcolor: "#2a2a2a",
                      maxHeight: "200px",
                      overflowY: "auto",
                    },
                    "& .MuiList-root::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "& .MuiList-root::-webkit-scrollbar-track": {
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "4px",
                    },
                    "& .MuiList-root::-webkit-scrollbar-thumb": {
                      background: "rgba(255,215,0,0.3)",
                      borderRadius: "4px",
                    },
                    "& .MuiList-root::-webkit-scrollbar-thumb:hover": {
                      background: "rgba(255,215,0,0.5)",
                    },
                    "& .MuiDigitalClock-item": {
                      color: "text.primary",
                      py: 0.5,
                      minHeight: "32px",
                      bgcolor: "#2a2a2a",
                      "&:hover": {
                        backgroundColor: "rgba(255, 215, 0, 0.1)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#FFD700",
                        color: "#2a2a2a",
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </StyledPickerRoot>
    </LocalizationProvider>
  );
};

export default CrontabCalendar;
