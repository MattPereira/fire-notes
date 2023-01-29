import { Box, CircularProgress } from "@mui/material";

export default function LoadingSpinner({ show }) {
  return show ? (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  ) : null;
}
