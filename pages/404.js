import Link from "next/link";

import { Button, Typography, Box } from "@mui/material";

export default function Custom404() {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{ borderRadius: "30px", mb: 2, width: { md: "auto", xs: "100%" } }}
        component="img"
        src="https://media1.giphy.com/media/l2JehQ2GitHGdVG9y/giphy.gif?cid=790b76112d9cc242b18a8da4993d2afd52990551cc5a27aa&rid=giphy.gif&ct=g"
      />
      <Typography variant="h4" gutterBottom>
        404 - That page does not seem to exist...
      </Typography>
      <Link href="/">
        <Button
          variant="contained"
          size="large"
          sx={{ fontFamily: "cubano", fontSize: "1.5rem" }}
        >
          Go home
        </Button>
      </Link>
    </Box>
  );
}
