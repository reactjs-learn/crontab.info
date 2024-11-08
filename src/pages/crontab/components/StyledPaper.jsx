import { Paper, styled } from "@mui/material";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));
