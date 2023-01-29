import { Box, Grid, Typography } from "@mui/material";

// UI component for user profile
export default function UserProfile({ user }) {
  return (
    <Grid container sx={{ justifyContent: "center", mb: 3 }}>
      <Grid item sx={{ textAlign: "center" }}>
        <Box>
          <Typography variant="h1">
            {user?.displayName || "Anonymous User"}
          </Typography>
          <Box
            component="img"
            alt="User profile"
            src={user?.photoURL || "/hacker.png"}
            sx={{ borderRadius: "50%", width: "200px", height: "200px" }}
          />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
            <i>@{user?.username}</i>
          </Typography>
        </Box>

        <Box></Box>
      </Grid>
    </Grid>
  );
}
