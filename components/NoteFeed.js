import Link from "next/link";
import { Typography, Paper, Button, Grid, Box } from "@mui/material";
import { fromMillis } from "../lib/firebase";
import { useTheme } from "@mui/material/styles";

export default function NoteFeed({ notes, admin }) {
  return notes
    ? notes.map((note) => (
        <NoteItem note={note} key={note.slug} admin={admin} />
      ))
    : null;
}

function NoteItem({ note, admin = false }) {
  const theme = useTheme();
  // Naive method to calc word count and read time
  const wordCount = note?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  // console.log(fromMillis(note.createdAt));

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "10px",
        mb: 3,
      }}
    >
      <Grid container sx={{ justifyContent: "space-between" }}>
        <Grid item>
          <Link
            href={`/${note.username}/${note.slug}`}
            style={{ textDecoration: "none" }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontFamily: "cubano",
                color: theme.palette.primary.main,
                fontSize: "1.75rem",
              }}
            >
              {note.title}
            </Typography>
          </Link>

          <Box sx={{ mb: 1 }}>
            <Typography variant="p">
              {wordCount} words. {minutesToRead} min read
            </Typography>
          </Box>

          <Link href={`/${note.username}`} style={{ textDecoration: "none" }}>
            Posted by u/{note.username}
          </Link>
        </Grid>

        {/* If admin view, show extra controls for user */}
        {admin && (
          <Grid item>
            <Link
              href={`/admin/${note.slug}`}
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained" color="primary">
                Edit
              </Button>
            </Link>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
