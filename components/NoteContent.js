import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Box, Typography } from "@mui/material";

// UI component for main note content
export default function NoteContent({ note }) {
  const createdAt =
    typeof note?.createdAt === "number"
      ? new Date(note.createdAt)
      : note.createdAt.toDate();

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Typography variant="p" sx={{ ml: 2, fontSize: "1.3rem" }}>
          Posted by <Link href={`/${note.username}/`}>u/{note.username}</Link>{" "}
          on {formattedDate}
        </Typography>
      </Box>

      <Box sx={{ bgcolor: "white", p: 3, borderRadius: "15px" }}>
        <ReactMarkdown>{note?.content}</ReactMarkdown>
      </Box>
    </Box>
  );
}
